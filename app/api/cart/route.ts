import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import clientPromise from '@/lib/mongodbClientPromise';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import mongoose from 'mongoose';
import { z } from 'zod';

// Validation schemas
const addToCartSchema = z.object({
  productId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid product ID"
  }),
  quantity: z.number().int().min(1).max(99)
});

const updateCartSchema = z.object({
  quantity: z.number().int().min(0).max(99)
});

// NOTE: This requires adding a 'cart' field to your User schema, e.g.:
// cart: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }]

export async function POST(request: NextRequest) {
    const session = await auth(); // Get session using server-side helper
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const client = await clientPromise;
        const db = client.db();
        const body = await request.json();
        
        // Validate input using Zod
        const validatedData = addToCartSchema.parse(body);
        const { productId, quantity } = validatedData;

        const product = await Product.findById(productId);
        if (!product || product.status !== 'approved') {
            return NextResponse.json({ message: 'Product not available' }, { status: 404 });
        }

        // Check stock availability
        if (product.stock < quantity) {
            return NextResponse.json({ 
                message: 'Insufficient stock', 
                availableStock: product.stock 
            }, { status: 400 });
        }

        const userId = session.user.id;
        const user = await User.findById(userId);
        if (!user) {
             return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Initialize cart if it doesn't exist
        if (!user.cart) {
            user.cart = [];
        }

        const cartItemIndex = user.cart.findIndex((item: any) => item.productId.toString() === productId);

        if (cartItemIndex > -1) {
            // Update quantity
            user.cart[cartItemIndex].quantity += quantity;
        } else {
            // Add new item
            user.cart.push({ productId: new mongoose.Types.ObjectId(productId), quantity });
        }

        await user.save();

        return NextResponse.json({ message: 'Cart updated successfully', cart: user.cart });

    } catch (error: any) {
        console.error('Cart API Error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ 
                message: 'Invalid input', 
                details: error.errors 
            }, { status: 400 });
        }
        return NextResponse.json({ 
            message: 'Failed to update cart', 
            error: error.message 
        }, { status: 500 });
    }
}

// Add GET, PUT (update quantity), DELETE methods similarly
export async function GET(request: NextRequest) {
   const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
     try {
         const client = await clientPromise;
         const db = client.db();
         const user = await User.findById(session.user.id).populate('cart.productId').select('cart'); // Populate product details
          if (!user) {
             return NextResponse.json({ message: 'User not found' }, { status: 404 });
         }
          return NextResponse.json(user.cart || []);

     } catch (error: any) {
        console.error('Cart GET API Error:', error);
        return NextResponse.json({ message: 'Failed to get cart', error: error.message }, { status: 500 });
    }
}