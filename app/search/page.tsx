// app/search/page.tsx
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { SearchForm } from "@/components/search-form"; // Assuming you create this component
import { Skeleton } from "@/components/ui/skeleton";

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q;

  if (!query) {
    return (
      <div className="container py-8 text-center">
        <p className="text-lg">أدخل مصطلح البحث.</p>
      </div>
    );
  }

  const fetchSearchResults = async (query: string) => {
    const res = await fetch(`/api/search?q=${query}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch search results");
    }
    return res.json();
  };

  const { products } = await fetchSearchResults(query);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">نتائج البحث عن: "{query}"</h1>
      {/* Search Form (Optional) */}
      {/* <SearchForm initialQuery={query} /> */}

      {products.length === 0 ? (
        <p className="text-lg text-gray-500">لم يتم العثور على منتجات.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => ( // Assuming any for now
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
