import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { reviewSchema, reviewUpdateSchema } from '@/lib/validations/review';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Review from '@/lib/models/Review';
import { isValidObjectId } from 'mongoose';

// GET /api/reviews?productId=xxx - Get reviews for a product
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId || !isValidObjectId(productId)) {
      return NextResponse.json(
        { message: 'معرف المنتج غير صالح' },
        { status: 400 }
      );
    }

    await dbConnect();
    const reviews = await Review.find({ 
      productId,
      status: 'approved'
    }).populate('customerId', 'name image');

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('خطأ في جلب التقييمات:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء جلب التقييمات' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Add a new review
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'غير مصرح به' }, { status: 401 });
    }

    const { productId, rating, comment } = await request.json();

    if (!productId || !isValidObjectId(productId)) {
      return NextResponse.json(
        { message: 'معرف المنتج غير صالح' },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: 'التقييم يجب أن يكون بين 1 و 5' },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { message: 'يجب أن يحتوي التعليق على 10 أحرف على الأقل' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      productId,
      customerId: session.user.id
    });

    if (existingReview) {
      return NextResponse.json(
        { message: 'لقد قمت بتقييم هذا المنتج مسبقاً' },
        { status: 400 }
      );
    }

    const validatedData = reviewSchema.parse({ productId, rating, comment });
    const review = new Review({
      ...validatedData,
      customerId: session.user.id,
      status: 'pending' // All reviews start as pending
    });

    await review.save();
    return NextResponse.json({ 
      message: 'تم إرسال تقييمك بنجاح وسيتم مراجعته قريباً'
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'خطأ في التحقق من البيانات', errors: error.errors },
        { status: 400 }
      );
    }
    console.error('خطأ في إضافة التقييم:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء إضافة التقييم' },
      { status: 500 }
    );
  }
}

// PATCH /api/reviews/:id/moderate - Moderate a review (admin only)
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'غير مصرح به' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = reviewUpdateSchema.parse(body);
    const { reviewId, status, moderationNote } = validatedData;

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { message: 'حالة التقييم غير صالحة' },
        { status: 400 }
      );
    }

    await dbConnect();
    const review = await Review.findById(reviewId);

    if (!review) {
      return NextResponse.json(
        { message: 'التقييم غير موجود' },
        { status: 404 }
      );
    }

    review.status = status;
    if (moderationNote) {
      review.moderationNote = moderationNote;
    }

    await review.save();
    return NextResponse.json({ 
      message: 'تم تحديث حالة التقييم بنجاح'
    });
  } catch (error) {
    console.error('خطأ في تحديث حالة التقييم:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تحديث حالة التقييم' },
      { status: 500 }
    );
  }
}