"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heading } from '@/components/ui/heading';
import { ProductCard } from '@/components/product-card';
import { Product } from '@/lib/db-models';
import { useToast } from '@/components/ui/use-toast';

// دالة لجلب قائمة الرغبات من واجهة برمجة التطبيقات
const fetchWishlist = async (): Promise<Product[]> => {
  const res = await fetch('/api/wishlist');
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'فشل في جلب قائمة الرغبات');
  }
  return res.json();
};

// دالة لإزالة منتج من قائمة الرغبات
const removeFromWishlist = async (productId: string) => {
  const res = await fetch('/api/wishlist', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'فشل في إزالة المنتج من قائمة الرغبات');
  }
  return res.json();
};

export default function WishlistPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wishlistItems, isLoading, error } = useQuery<Product[]>({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
  });

  const removeMutation = useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({
        description: 'تمت إزالة المنتج من قائمة الرغبات بنجاح',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        description: error.message,
      });
    },
  });

  const handleRemoveFromWishlist = (productId: string) => {
    removeMutation.mutate(productId);
  };

  return (
    <div className="container mx-auto py-8">
      <Heading
        title="قائمة الرغبات"
        description="المنتجات المحفوظة في قائمة رغباتك"
      />
      {error && (
        <div className="text-center text-red-500 py-10">
          حدث خطأ: {error instanceof Error ? error.message : 'فشل في جلب قائمة الرغبات'}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <ProductCard key={index} isLoading={true} />
            ))
          : wishlistItems?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onRemoveFromWishlist={() => handleRemoveFromWishlist(product.id)}
                showWishlistButton
              />
            ))}
      </div>
      {!isLoading && wishlistItems?.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          لا توجد منتجات في قائمة رغباتك
        </div>
      )}
    </div>
  );
}