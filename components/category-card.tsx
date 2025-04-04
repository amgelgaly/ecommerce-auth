import Link from "next/link";
import { OptimizedImage } from './ui/optimized-image';
import { Category } from "@/lib/db-models";
import { Skeleton } from './ui/skeleton'; // Import Skeleton

interface CategoryCardProps {
  category?: Category; // Make category optional
  isLoading?: boolean; // Add isLoading prop
}

export function CategoryCard({ category, isLoading }: CategoryCardProps) {
  if (isLoading || !category) {
    return (
      <div className="group relative block overflow-hidden rounded-lg bg-gray-100">
        <Skeleton className="aspect-h-2 aspect-w-3 w-full" />
      </div>
    );
  }

  return (
    <Link href={`/products?category=${category.name}`} className="group relative block overflow-hidden rounded-lg bg-gray-100">
      <div className="aspect-h-2 aspect-w-3 relative">
        <OptimizedImage
          src={category.image || "/placeholder.svg"}
          alt={category.name}
          fill
          imageType="category"
          className="object-cover object-center transition-opacity group-hover:opacity-75"
        />
      </div>
      <div className="absolute inset-0 flex items-end p-6">
        <h3 className="self-start text-lg font-semibold text-white">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}
