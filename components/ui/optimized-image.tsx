'use client';

import Image from 'next/image';
import { ComponentProps } from 'react';

type OptimizedImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  imageType?: 'product' | 'category' | 'avatar' | 'banner' | 'thumbnail';
} & Partial<Omit<ComponentProps<typeof Image>, 'src' | 'alt' | 'className' | 'fill'>>;

const imageSizes = {
  product: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  category: '(max-width: 640px) 50vw, 33vw',
  avatar: '96px',
  banner: '100vw',
  thumbnail: '(max-width: 768px) 33vw, 25vw'
};

export function OptimizedImage({
  src,
  alt,
  className,
  fill = false,
  imageType = 'product',
  sizes = imageSizes.product,
  quality = 90,
  priority = imageType === 'banner',
  loading = imageType === 'banner' ? 'eager' : 'lazy',
  ...props
}: OptimizedImageProps) {
  const defaultPlaceholder = '/placeholder.svg';
  const imageSrc = src || defaultPlaceholder;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      className={className}
      fill={fill}
      sizes={sizes}
      quality={quality}
      priority={priority}
      loading={loading}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4="
      {...props}
    />
  );
}