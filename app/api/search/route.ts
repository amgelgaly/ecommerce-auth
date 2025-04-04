import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { z } from 'zod';

// Validation schema for search parameters
const searchParamsSchema = z.object({
  q: z.string().min(1).max(100),
  category: z.string().optional(),
  minPrice: z.string().regex(/^\d+$/).transform(Number).optional(),
  maxPrice: z.string().regex(/^\d+$/).transform(Number).optional(),
  sort: z.enum(['relevance', 'price_asc', 'price_desc', 'newest']).optional().default('relevance'),
  page: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().positive()).optional().default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(1).max(50)).optional().default('20')
});

// Type for validated search parameters
type ValidatedSearchParams = z.infer<typeof searchParamsSchema>;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  try {
    // Validate search parameters
    const validatedParams = searchParamsSchema.parse(params);
    const { q: query, category, minPrice, maxPrice, sort, page, limit } = validatedParams;

    // Build filter object
    const filter: any = { status: 'approved' };
    
    // Add price range filter if provided
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    // Add category filter if provided
    if (category) {
      filter.category = category;
    }
  }

  try {
    await connectToDB();

    // Search using text index if available, fallback to regex
    const searchQuery = await Product.collection.indexExists('name_text_description_text') ?
      { $text: { $search: query }, ...filter } :
      {
        $and: [
          filter,
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } }
            ]
          }
        ]
      };

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Determine sort options
    const sortOptions: any = {};
    switch (sort) {
      case 'price_asc':
        sortOptions.price = 1;
        break;
      case 'price_desc':
        sortOptions.price = -1;
        break;
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      default:
        if (await Product.collection.indexExists('name_text_description_text')) {
          sortOptions.score = { $meta: 'textScore' };
        } else {
          sortOptions.createdAt = -1; // Fallback sort
        }
    }

    // Execute search query
    const [products, total] = await Promise.all([
      Product.find(searchQuery)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(searchQuery)
    ]);

    // --- Alternative: Using Text Index (Requires index setup in model) ---
    /*
    if (await Product.collection.indexExists('name_text_description_text_category_text')) { // Check if index exists
        const products = await Product.find(
            { $text: { $search: query }, status: 'approved' },
            { score: { $meta: "textScore" } } // Optional: sort by relevance
        )
        .sort({ score: { $meta: "textScore" } }) // Optional: sort by relevance
        .limit(20)
        .lean();
    } else {
        // Fallback or throw error if text index is expected but not found
        console.warn("Text index not found, falling back to regex search or handle as error.");
        // Implement fallback (like regex search above) or return an error
        return NextResponse.json({ message: 'Search index not configured properly' }, { status: 500 });
    }
    */
    // --- End Search Logic ---


    // Return paginated results with metadata
    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasMore: skip + products.length < total
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        message: 'Invalid search parameters', 
        details: error.errors 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      message: 'Failed to fetch search results'
    }, { status: 500 });
  }
}