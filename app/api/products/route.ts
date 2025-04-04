import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodbClientPromise";
import Product from "@/lib/models/Product";
import { z } from 'zod';

// Validation schemas
const queryParamsSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
  sort: z.enum(['createdAt', 'price']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().positive()).optional().default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(1).max(50)).optional().default('12')
});

const productSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().positive(),
  category: z.string().min(2).max(50),
  stock: z.number().int().min(0),
  images: z.array(z.string().url()).min(1)
});

export async function GET(request: NextRequest) {
  console.log("API Route: GET /api/products called");
  try {
    const client = await clientPromise;
    const db = client.db();

    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    // Validate query parameters
    const validatedParams = queryParamsSchema.parse(params);
    const { category, q: searchQuery, sort: sortBy, order, page, limit } = validatedParams;

    const filter: any = {}; // Show all products

    if (category) {
      filter.category = category;
    }

    if (searchQuery) {
       // Basic case-insensitive search on name and description
       // For more advanced search, consider MongoDB text indexes ($text)
       filter.$or = [
         { name: { $regex: searchQuery, $options: "i" } },
         { description: { $regex: searchQuery, $options: "i" } },
         // Add category or other fields if needed
         // { category: { $regex: searchQuery, $options: "i" } },
       ];
       // If using text index: filter.$text = { $search: searchQuery };
    }

    const sortOptions: any = {};
    if (sortBy === 'price') {
        sortOptions.price = order === 'asc' ? 1 : -1;
    } else { // Default to createdAt or other fields
        sortOptions.createdAt = order === 'asc' ? 1 : -1;
    }

    const skip = (page - 1) * limit;
  
    console.log("API Route: Querying products with filter:", filter, "sortOptions:", sortOptions, "skip:", skip, "limit:", limit);
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance if not modifying docs

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
       products,
       currentPage: page,
       totalPages,
       totalProducts,
    });

  } catch (error: any) {
    console.error("API Error fetching products:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        message: "Invalid query parameters", 
        details: error.errors 
      }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create new product (Seller/Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is seller or admin
    const user = await User.findById(session.user.id);
    if (!user || !['seller', 'admin'].includes(user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = productSchema.parse(body);

    const product = new Product({
      ...validatedData,
      seller: session.user.id,
      status: user.role === 'admin' ? 'approved' : 'pending'
    });

    await product.save();

    return NextResponse.json(product, { status: 201 });

  } catch (error: any) {
    console.error('Product creation error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        message: 'Invalid product data', 
        details: error.errors 
      }, { status: 400 });
    }
    return NextResponse.json(
      { message: 'Failed to create product' },
      { status: 500 }
    );
  }
}