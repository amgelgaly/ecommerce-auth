"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heading } from '@/components/ui/heading';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Review {
  id: string;
  productId: string;
  customerId: {
    name: string;
    image: string;
  };
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  moderationNote?: string;
  createdAt: string;
}

// دالة لجلب التقييمات من واجهة برمجة التطبيقات
const fetchReviews = async (status: string): Promise<Review[]> => {
  const res = await fetch(`/api/reviews/admin?status=${status}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'فشل في جلب التقييمات');
  }
  return res.json();
};

// دالة لتحديث حالة التقييم
const updateReviewStatus = async ({
  reviewId,
  status,
  moderationNote,
}: {
  reviewId: string;
  status: 'approved' | 'rejected';
  moderationNote?: string;
}) => {
  const res = await fetch('/api/reviews', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviewId, status, moderationNote }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'فشل في تحديث حالة التقييم');
  }
  return res.json();
};

export default function ReviewsAdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingReviews, isLoading: isPendingLoading } = useQuery<Review[]>({
    queryKey: ['reviews', 'pending'],
    queryFn: () => fetchReviews('pending'),
  });

  const { data: approvedReviews, isLoading: isApprovedLoading } = useQuery<Review[]>({
    queryKey: ['reviews', 'approved'],
    queryFn: () => fetchReviews('approved'),
  });

  const { data: rejectedReviews, isLoading: isRejectedLoading } = useQuery<Review[]>({
    queryKey: ['reviews', 'rejected'],
    queryFn: () => fetchReviews('rejected'),
  });

  const updateMutation = useMutation({
    mutationFn: updateReviewStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        description: 'تم تحديث حالة التقييم بنجاح',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        description: error.message,
      });
    },
  });

  const handleUpdateStatus = (
    reviewId: string,
    status: 'approved' | 'rejected',
    moderationNote?: string
  ) => {
    updateMutation.mutate({ reviewId, status, moderationNote });
  };

  const ReviewCard = ({ review }: { review: Review }) => (
    <Card className="p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={review.customerId.image || '/placeholder-user.jpg'}
              alt={review.customerId.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium">{review.customerId.name}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-500">
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('ar-SA')}
            </span>
          </div>
          <p className="text-gray-700">{review.comment}</p>
          {review.moderationNote && (
            <p className="mt-2 text-sm text-gray-500">
              ملاحظة الإشراف: {review.moderationNote}
            </p>
          )}
        </div>
        {review.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdateStatus(review.id, 'approved')}
            >
              قبول
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                const note = prompt('سبب الرفض:');
                if (note) {
                  handleUpdateStatus(review.id, 'rejected', note);
                }
              }}
            >
              رفض
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto py-8">
      <Heading
        title="إدارة التقييمات"
        description="مراجعة وإدارة تقييمات المستخدمين"
      />
      <Tabs defaultValue="pending" className="mt-8">
        <TabsList>
          <TabsTrigger value="pending">
            معلق ({pendingReviews?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="approved">
            مقبول ({approvedReviews?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            مرفوض ({rejectedReviews?.length || 0})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">
          {isPendingLoading ? (
            <div className="text-center py-4">جاري التحميل...</div>
          ) : pendingReviews?.length === 0 ? (
            <div className="text-center py-4">لا توجد تقييمات معلقة</div>
          ) : (
            pendingReviews?.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </TabsContent>
        <TabsContent value="approved" className="mt-4">
          {isApprovedLoading ? (
            <div className="text-center py-4">جاري التحميل...</div>
          ) : approvedReviews?.length === 0 ? (
            <div className="text-center py-4">لا توجد تقييمات مقبولة</div>
          ) : (
            approvedReviews?.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </TabsContent>
        <TabsContent value="rejected" className="mt-4">
          {isRejectedLoading ? (
            <div className="text-center py-4">جاري التحميل...</div>
          ) : rejectedReviews?.length === 0 ? (
            <div className="text-center py-4">لا توجد تقييمات مرفوضة</div>
          ) : (
            rejectedReviews?.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}