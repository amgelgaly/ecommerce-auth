import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Wishlist from '@/lib/models/Wishlist';
import { isValidObjectId } from 'mongoose';

// GET /api/wishlist - Get user's wishlist
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'غير مصرح به' }, { status: 401 });
    }

    await dbConnect();
    const wishlist = await Wishlist.findOne({ userId: session.user.id }).populate('products');
    
    return NextResponse.json(wishlist?.products || []);
  } catch (error) {
    console.error('خطأ في جلب قائمة الرغبات:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء جلب قائمة الرغبات' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Add product to wishlist
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'غير مصرح به' }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId || !isValidObjectId(productId)) {
      return NextResponse.json(
        { message: 'معرف المنتج غير صالح' },
        { status: 400 }
      );
    }

    await dbConnect();
    let wishlist = await Wishlist.findOne({ userId: session.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId: session.user.id,
        products: [productId],
      });
    } else if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }

    await wishlist.save();
    return NextResponse.json({ message: 'تمت إضافة المنتج إلى قائمة الرغبات' });
  } catch (error) {
    console.error('خطأ في إضافة المنتج إلى قائمة الرغبات:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء إضافة المنتج إلى قائمة الرغبات' },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist - Remove product from wishlist
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'غير مصرح به' }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId || !isValidObjectId(productId)) {
      return NextResponse.json(
        { message: 'معرف المنتج غير صالح' },
        { status: 400 }
      );
    }

    await dbConnect();
    const wishlist = await Wishlist.findOne({ userId: session.user.id });
    
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId
      );
      await wishlist.save();
    }

    return NextResponse.json({ message: 'تمت إزالة المنتج من قائمة الرغبات' });
  } catch (error) {
    console.error('خطأ في إزالة المنتج من قائمة الرغبات:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء إزالة المنتج من قائمة الرغبات' },
      { status: 500 }
    );
  }
}