// app/sitemap.ts
import { MetadataRoute } from 'next';

import { getAllProducts } from '../lib/db-models';
import { getAllCategories } from '../lib/db-models';

async function getAllProductsSitemap(): Promise<{ id: string; updatedAt: Date }[]> {
    const products = await getAllProducts();
    return products.map(product => ({
        id: product.id,
        updatedAt: product.updatedAt
    }));
}

async function getAllCategoriesSitemap(): Promise<{ name: string; updatedAt: Date }[]> {
    const categories = await getAllCategories();
    return categories.map(category => ({
        name: category.slug,
        updatedAt: category.updatedAt
    }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourstore.com';

  // جلب المنتجات
  const products = await getAllProductsSitemap();
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const, // أو 'daily' أو 'monthly'
    priority: 0.8, // الأولوية للمنتجات
  }));

   // جلب الأصناف
   const categories = await getAllCategoriesSitemap();
   const categoryUrls = categories.map((category) => ({
     url: `${baseUrl}/products?category=${encodeURIComponent(category.name)}`, // أو رابط صفحة الصنف المخصص
     lastModified: category.updatedAt,
     changeFrequency: 'weekly' as const,
     priority: 0.7,
   }));

  // إضافة صفحات ثابتة أخرى
  const staticUrls = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
    // أضف صفحات أخرى مثل "عنا", "اتصل بنا"
  ];

  return [
      ...staticUrls,
      ...productUrls,
      ...categoryUrls,
  ];
}