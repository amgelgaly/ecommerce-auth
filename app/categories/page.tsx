"use client";

import { useQuery } from '@tanstack/react-query';
import { Heading } from '@/components/ui/heading';
import { CategoryCard } from '@/components/category-card';
import { Category } from '@/lib/db-models';

// دالة لجلب الفئات من واجهة برمجة التطبيقات
const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch('/api/categories');
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'فشل في جلب الفئات');
  }
  return res.json();
};

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  return (
    <div className="container mx-auto py-8">
      <Heading
        title="التصنيفات"
        description="استعرض جميع التصنيفات المتاحة"
      />
      {error && (
        <div className="text-center text-red-500 py-10">
          حدث خطأ: {error instanceof Error ? error.message : 'فشل في جلب الفئات'}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <CategoryCard key={index} isLoading={true} />
            ))
          : categories?.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
      </div>
    </div>
  );
}