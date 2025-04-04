// app/seller/earnings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface WithdrawalHistory {
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  requestDate: string;
  completionDate?: string;
  notes?: string;
}

interface UserData {
  balance: number;
  totalEarnings: number;
  commissionRate: number;
  withdrawalHistory: WithdrawalHistory[];
  monthlyEarnings: { month: string; earnings: number; }[];
}

export default function EarningsPage() {
  const { data: session } = useSession();
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalNotes, setWithdrawalNotes] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleWithdrawalRequest = async () => {
    try {
      const amount = parseFloat(withdrawalAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('يرجى إدخال مبلغ صحيح');
        return;
      }

      const response = await fetch('/api/commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, notes: withdrawalNotes })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      toast.success('تم تقديم طلب السحب بنجاح');
      setWithdrawalAmount('');
      setWithdrawalNotes('');
      // Refresh user data
      fetchUserData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  if (!session) {
    return <div>يرجى تسجيل الدخول للوصول إلى هذه الصفحة</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">الأرباح والعمولات</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">الرصيد الحالي</h2>
          <p className="text-2xl">{userData?.balance?.toFixed(2)} ريال</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">إجمالي الأرباح</h2>
          <p className="text-2xl">{userData?.totalEarnings?.toFixed(2)} ريال</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">نسبة العمولة</h2>
          <p className="text-2xl">{userData?.commissionRate}%</p>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">الأرباح الشهرية</h2>
        <div className="h-[300px]">
          <ChartContainer>
            <BarChart data={userData?.monthlyEarnings || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip />
              <Bar dataKey="earnings" fill="hsl(var(--chart-1))" name="الأرباح" />
            </BarChart>
          </ChartContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">طلب سحب جديد</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">المبلغ</label>
              <Input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="أدخل المبلغ المراد سحبه"
              />
            </div>
            <div>
              <label className="block mb-2">ملاحظات</label>
              <Textarea
                value={withdrawalNotes}
                onChange={(e) => setWithdrawalNotes(e.target.value)}
                placeholder="أي ملاحظات إضافية"
              />
            </div>
            <Button onClick={handleWithdrawalRequest}>تقديم طلب السحب</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">سجل طلبات السحب</h2>
          <div className="space-y-4">
            {userData?.withdrawalHistory?.map((withdrawal, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{withdrawal.amount} ريال</span>
                  <span className={`status-${withdrawal.status}`}>
                    {withdrawal.status === 'pending' && 'قيد المراجعة'}
                    {withdrawal.status === 'completed' && 'مكتمل'}
                    {withdrawal.status === 'rejected' && 'مرفوض'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(withdrawal.requestDate).toLocaleDateString('ar-SA')}
                </div>
                {withdrawal.notes && (
                  <div className="text-sm mt-2">{withdrawal.notes}</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}