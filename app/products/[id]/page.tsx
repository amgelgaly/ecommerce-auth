// app/products/[id]/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@/components/ui/rating";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/cart-context";

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  seller: {
    id: string;
    name: string;
  };
  reviews: Review[];
  averageRating: number;
}

const fetchProduct = async (id: string): Promise<Product> => {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch product details");
  }
  return res.json();
};

const addReview = async ({ productId, rating, comment }: { productId: string; rating: number; comment: string }) => {
  const res = await fetch(`/api/products/${productId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating, comment }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to add review");
  }
  return res.json();
};

function ProductDetail() {
  const params = useParams();
  const { id } = params;
  const { data: session } = useSession();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id as string),
  });

  const addReviewMutation = useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      setNewReview({ rating: 5, comment: "" });
      toast({ title: "تمت إضافة المراجعة بنجاح" });
    },
    onError: (error) => {
      toast({ title: "حدث خطأ", description: error.message, variant: "destructive" });
    },
  });

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast({ title: "تمت إضافة المنتج إلى السلة" });
    }
  };

  const handleAddReview = () => {
    if (!session) {
      toast({ title: "يجب تسجيل الدخول لإضافة مراجعة", variant: "destructive" });
      return;
    }
    addReviewMutation.mutate({
      productId: id as string,
      rating: newReview.rating,
      comment: newReview.comment,
    });
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[500px] w-full" />
          <div>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">حدث خطأ: {(error as Error).message}</div>;
  }

  if (!product) {
    return <div className="text-center text-muted-foreground py-10">لم يتم العثور على المنتج</div>;
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <OptimizedImage
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover"
            width={600}
            height={600}
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <Rating value={product.averageRating} readOnly />
            <span className="text-sm text-muted-foreground">({product.reviews.length} مراجعة)</span>
          </div>
          <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <Button onClick={handleAddToCart} className="w-full mb-4">إضافة إلى السلة</Button>
          <p className="text-sm text-muted-foreground">البائع: {product.seller.name}</p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">المراجعات</h2>
        
        {/* Add Review Form */}
        {session && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">أضف مراجعة</h3>
            <div className="mb-4">
              <Rating
                value={newReview.rating}
                onChange={(value) => setNewReview(prev => ({ ...prev, rating: value }))}
              />
            </div>
            <Textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="اكتب مراجعتك هنا..."
              className="mb-4"
            />
            <Button
              onClick={handleAddReview}
              disabled={addReviewMutation.isPending}
            >
              {addReviewMutation.isPending ? "جاري الإضافة..." : "إضافة مراجعة"}
            </Button>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {product.reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center gap-2 mb-2">
                <Rating value={review.rating} readOnly size="sm" />
                <span className="font-semibold">{review.userName}</span>
              </div>
              <p className="text-gray-600">{review.comment}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {new Date(review.createdAt).toLocaleDateString("ar-SA")}
              </p>
            </div>
          ))}
          {product.reviews.length === 0 && (
            <p className="text-center text-muted-foreground">لا توجد مراجعات بعد</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="container py-8">جاري التحميل...</div>}>
      <ProductDetail />
    </Suspense>
  );
}
