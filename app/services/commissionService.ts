// app/services/commissionService.ts
import { User } from '@/lib/models/User';
import { Order } from '@/lib/models/Order';
import { Product } from '@/lib/models/Product';
import mongoose from 'mongoose';

// Calculate earnings for a new order
export async function calculateOrderEarnings(orderId: string) {
  const order = await Order.findById(orderId)
    .populate('products.productId')
    .populate('customerId');

  if (!order) throw new Error('Order not found');

  let totalPlatformEarnings = 0;
  let totalSellerEarnings = 0;

  // Calculate earnings for each product in the order
  for (const item of order.products) {
    const product = item.productId as any;
    const commissionRate = product.sellerId.commissionRate || 10; // Default 10%
    
    const itemTotal = item.price * item.quantity;
    const platformEarning = (itemTotal * commissionRate) / 100;
    const sellerEarning = itemTotal - platformEarning;

    totalPlatformEarnings += platformEarning;
    totalSellerEarnings += sellerEarning;

    // Update product earnings
    await Product.findByIdAndUpdate(product._id, {
      $inc: {
        platformFee: platformEarning,
        sellerEarnings: sellerEarning
      }
    });

    // Update seller's balance and total earnings
    await User.findByIdAndUpdate(product.sellerId, {
      $inc: {
        balance: sellerEarning,
        totalEarnings: sellerEarning
      }
    });
  }

  // Update order with earnings breakdown
  await Order.findByIdAndUpdate(orderId, {
    platformEarnings: totalPlatformEarnings,
    sellerEarnings: totalSellerEarnings
  });

  return {
    platformEarnings: totalPlatformEarnings,
    sellerEarnings: totalSellerEarnings
  };
}

// Process withdrawal request
export async function processWithdrawalRequest(
  sellerId: string,
  amount: number,
  notes?: string
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const seller = await User.findById(sellerId);
    if (!seller) throw new Error('Seller not found');
    if (seller.balance < amount) throw new Error('Insufficient balance');

    // Create withdrawal request
    const withdrawalRequest = {
      amount,
      status: 'pending',
      requestDate: new Date(),
      notes: notes || ''
    };

    // Update seller's balance and add withdrawal request
    await User.findByIdAndUpdate(
      sellerId,
      {
        $inc: { balance: -amount },
        $push: { withdrawalHistory: withdrawalRequest }
      },
      { session }
    );

    await session.commitTransaction();
    return withdrawalRequest;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

// Update commission rate for a seller
export async function updateSellerCommissionRate(
  sellerId: string,
  newRate: number
) {
  if (newRate < 0 || newRate > 100) {
    throw new Error('Commission rate must be between 0 and 100');
  }

  const seller = await User.findByIdAndUpdate(
    sellerId,
    { commissionRate: newRate },
    { new: true }
  );

  if (!seller) throw new Error('Seller not found');
  return seller;
}