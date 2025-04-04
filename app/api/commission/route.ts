// app/api/commission/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  processWithdrawalRequest,
  updateSellerCommissionRate
} from '@/app/services/commissionService';

// Handle withdrawal requests
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    const { amount, notes } = await req.json();
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'مبلغ السحب غير صالح' },
        { status: 400 }
      );
    }

    const withdrawalRequest = await processWithdrawalRequest(
      session.user.id,
      amount,
      notes
    );

    return NextResponse.json(withdrawalRequest);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

// Update seller's commission rate (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    const { sellerId, newRate } = await req.json();
    if (!sellerId || typeof newRate !== 'number') {
      return NextResponse.json(
        { error: 'بيانات غير صالحة' },
        { status: 400 }
      );
    }

    const updatedSeller = await updateSellerCommissionRate(sellerId, newRate);
    return NextResponse.json(updatedSeller);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}