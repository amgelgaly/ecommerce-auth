// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "../../../../lib/mongodb";
import Product from "../../../../lib/models/Product";
import mongoose from "mongoose";

interface Params {
    params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
  }

  try {
    await connectToDB();

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

     // Optionally populate seller or reviews here if needed
     // const product = await Product.findById(id).populate('sellerId', 'name').populate('reviews').lean();


    return NextResponse.json(product);
  } catch (error: any) {
    console.error(`API Error fetching product ${id}:`, error);
    return NextResponse.json(
      { message: "Failed to fetch product", error: error.message },
      { status: 500 }
    );
  }
}