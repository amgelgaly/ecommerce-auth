import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import Order from '@/lib/models/Order';
import connectToDB from '@/lib/mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    await connectToDB();

    // إحصائيات المستخدمين والتجار
    const [totalUsers, totalSellers] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'seller' })
    ]);

    // إحصائيات المنتجات
    const totalProducts = await Product.countDocuments();

    // إحصائيات الطلبات
    const totalOrders = await Order.countDocuments();

    // آخر الطلبات
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
      .then(orders => orders.map(order => ({
        id: order._id.toString(),
        total: order.total,
        status: order.status,
        date: new Date(order.createdAt).toLocaleDateString('ar-SA')
      })));

    // الإيرادات الشهرية
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$total' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]).then(results => results.map(result => ({
      month: new Date(result._id.year, result._id.month - 1)
        .toLocaleDateString('ar-SA', { month: 'short' }),
      revenue: result.revenue
    })));

    return NextResponse.json({
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      recentOrders,
      monthlyRevenue
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الإحصائيات' },
      { status: 500 }
    );
  }
}