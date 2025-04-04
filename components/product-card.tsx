import Link from 'next/link';
import { Product } from '@/lib/db-models'; // Import the Product interface
import { Skeleton } from './ui/skeleton';
import { OptimizedImage } from './ui/optimized-image';

interface ProductCardProps {
  product?: Product; // Make product optional to handle loading state
  isLoading?: boolean; // Add isLoading prop
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isLoading }) => {
  if (isLoading || !product) {
    return (
      <div className="group">
        <Skeleton className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7" />
        <Skeleton className="mt-4 h-4 w-3/4" />
        <Skeleton className="mt-1 h-6 w-1/4" />
      </div>
    );
  }

  return (
    <Link href={`/products/${product?.id}`} className="group">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <OptimizedImage
          src={product?.images?.[0] || '/placeholder.svg'}
          alt={product?.name}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
          width={300}
          height={300}
          imageType="product"
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{product?.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">${product?.price.toFixed(2)}</p>
    </Link>
  );
};

export default ProductCard;