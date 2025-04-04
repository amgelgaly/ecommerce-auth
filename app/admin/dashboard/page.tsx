// app/admin/dashboard/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  recentOrders: {
    id: string;
    total: number;
    status: string;
    date: string;
  }[];
  monthlyRevenue: {
    month: string;
    revenue: number;
  }[];
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (status === 'authenticated' && (session?.user as any)?.role === 'admin') {
        try {
          const response = await fetch('/api/admin/stats');
          if (response.ok) {
            const data = await response.json();
            setStats(data);
          }
        } catch (error) {
          console.error('Error fetching stats:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStats();
  }, [status, session]);

  if (status === 'loading' || loading) {
    return <div>جاري التحميل...</div>;
  }

  if (status === 'unauthenticated' || (session?.user as any)?.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <div className="space-x-4 rtl:space-x-reverse">
          <Button asChild>
            <Link href="/admin/settings">الإعدادات</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">المستخدمين</h3>
          <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
          <Button variant="link" className="mt-4" asChild>
            <Link href="/admin/users">إدارة المستخدمين</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">التجار</h3>
          <p className="text-3xl font-bold">{stats?.totalSellers || 0}</p>
          <Button variant="link" className="mt-4" asChild>
            <Link href="/admin/sellers">إدارة التجار</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">المنتجات</h3>
          <p className="text-3xl font-bold">{stats?.totalProducts || 0}</p>
          <Button variant="link" className="mt-4" asChild>
            <Link href="/admin/products">إدارة المنتجات</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">الطلبات</h3>
          <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
          <Button variant="link" className="mt-4" asChild>
            <Link href="/admin/orders">إدارة الطلبات</Link>
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">الإيرادات الشهرية</h3>
          <div className="h-[300px]">
            <ChartContainer>
              <BarChart data={stats?.monthlyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" name="الإيرادات" />
              </BarChart>
            </ChartContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">آخر الطلبات</h3>
          <div className="space-y-4">
            {stats?.recentOrders?.map((order) => (
              <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">#{order.id}</p>
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>
                <div className="text-left">
                  <p className="font-semibold">{order.total} ريال</p>
                  <p className="text-sm">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="link" className="mt-4" asChild>
            <Link href="/admin/orders">عرض جميع الطلبات</Link>
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">روابط سريعة</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/settings/commission">إعدادات العمولة</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/discounts">أكواد الخصم</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/content">إدارة المحتوى</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/notifications">الإشعارات</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
