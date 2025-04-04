// app/products/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming Skeleton is in ui
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the structure of the API response
interface ProductsApiResponse {
    products: any[]; // Define a proper Product type later
    currentPage: number;
    totalPages: number;
    totalProducts: number;
}

// Function to fetch products from the API
const fetchProducts = async (params: {
    category?: string | null;
    q?: string | null;
    sort?: string;
    order?: string;
    page?: number;
    limit?: number;
}): Promise<ProductsApiResponse> => {
    const urlParams = new URLSearchParams();
    if (params.category) urlParams.append("category", params.category);
    if (params.q) urlParams.append("q", params.q);
    if (params.sort) urlParams.append("sort", params.sort);
    if (params.order) urlParams.append("order", params.order);
    if (params.page) urlParams.append("page", params.page.toString());
    if (params.limit) urlParams.append("limit", params.limit.toString());

    const res = await fetch(`/api/products?${urlParams.toString()}`);
    if (!res.ok) {
         const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch products");
    }
    const data = await res.json();
    console.log("Frontend: Received data:", data);
    return data;
};

 // Helper to manage Search Params and State
function useProductFilters() {
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState({
        category: searchParams.get("category"),
        q: searchParams.get("q"),
        sort: searchParams.get("sort") || "createdAt",
        order: searchParams.get("order") || "desc",
        page: parseInt(searchParams.get("page") || "1", 10),
        limit: 12,
    });

    // Update state when search params change (e.g., browser back/forward)
    useEffect(() => {
        setFilters({
            category: searchParams.get("category"),
            q: searchParams.get("q"),
            sort: searchParams.get("sort") || "createdAt",
            order: searchParams.get("order") || "desc",
            page: parseInt(searchParams.get("page") || "1", 10),
            limit: 12,
        });
    }, [searchParams]);

     // Function to update filters and push to URL
    const updateFilters = (newFilters: Partial<typeof filters>) => {
         const updated = { ...filters, ...newFilters, page: newFilters.page || 1 }; // Reset page on filter change
         setFilters(updated);

         // Update URL Search Params (Client-side navigation)
         const urlParams = new URLSearchParams();
         if (updated.category) urlParams.append("category", updated.category);
         if (updated.q) urlParams.append("q", updated.q);
         if (updated.sort !== "createdAt") urlParams.append("sort", updated.sort); // Only add if not default
         if (updated.order !== "desc") urlParams.append("order", updated.order); // Only add if not default
         if (updated.page > 1) urlParams.append("page", updated.page.toString());

          // Use history.pushState or router.push for client-side update without full reload
          window.history.pushState(null, '', `/products?${urlParams.toString()}`);
          // Or if using next/navigation's router:
          // import { useRouter } from 'next/navigation'; const router = useRouter();
          // router.push(`/products?${urlParams.toString()}`, { scroll: false });

     };


    return { filters, updateFilters };
}


function ProductGrid() {
    const { filters, updateFilters } = useProductFilters();

    const { data, isLoading, error, isFetching } = useQuery<ProductsApiResponse, Error>({
        queryKey: ["products", filters], // Query key includes filters
        queryFn: () => fetchProducts(filters),
         // keepPreviousData: true, // Keep showing old data while fetching new page/filter
         // staleTime: 5 * 60 * 1000, // Optional: 5 minutes stale time
    });

    const handleSortChange = (value: string) => {
         const [sort, order] = value.split('-');
         updateFilters({ sort, order });
     };

     const handlePageChange = (newPage: number) => {
         updateFilters({ page: newPage });
     };


    if (error) {
        return <div className="text-center text-red-500 py-10">حدث خطأ: {error.message}</div>;
    }

    return (
         <div className="container py-8">
            {/* Filters/Sorting Section */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold">
                   {filters.category ? `فئة: ${filters.category}` : filters.q ? `نتائج البحث عن: "${filters.q}"` : "جميع المنتجات"}
                </h1>
                <Select
                    value={`${filters.sort}-${filters.order}`}
                    onValueChange={handleSortChange}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="ترتيب حسب" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt-desc">الأحدث</SelectItem>
                        <SelectItem value="price-asc">السعر: من الأقل للأعلى</SelectItem>
                        <SelectItem value="price-desc">السعر: من الأعلى للأقل</SelectItem>
                         {/* Add more sort options if needed */}
                    </SelectContent>
                </Select>
            </div>

            {/* Product Grid */}
            {isLoading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array.from({ length: filters.limit }).map((_, index) => (
                    <Skeleton key={index} className="h-[350px] w-full" />
                  ))}
               </div>
            ) : data?.products && data.products.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                   {data.products.map((product: any) => ( // Added type any
                     // Ensure ProductCard expects the correct product structure from API
                     <ProductCard key={product.id} product={product} />
                   ))}
                </div>
            ) : (
                 <div className="text-center text-muted-foreground py-10">لا توجد منتجات تطابق بحثك.</div>
            )}

             {/* Pagination */}
            {data && data.totalPages && ( // Changed data.totalPages to data?.totalPages
                 <div className="mt-8">
                     <Pagination>
                         <PaginationContent>
                             <PaginationItem
                                 href="#"
                                 onClick={(e) => { e.preventDefault(); if (filters.page > 1) handlePageChange(filters.page - 1); }}
                                 aria-disabled={filters.page <= 1}
                                 className={filters.page <= 1 ? "pointer-events-none opacity-50" : ""}
                             />
                         </PaginationContent>
                         {/* Simple page number display - can be improved with ellipsis */}
                         {Array.from({ length: data.totalPages }).map((_, i) => (
                             <PaginationItem key={i} href={`/products?page=${i + 1}`} onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }} isActive={filters.page === i + 1}>
                                 {i + 1}
                             </PaginationItem>
                         ))}
                          {/* Add PaginationEllipsis logic if needed */}
                         <PaginationContent>
                             <PaginationNext
                                 href="#"
                                 onClick={(e) => { e.preventDefault(); if (filters.page < data.totalPages) handlePageChange(filters.page + 1); }}
                                 aria-disabled={filters.page >= data.totalPages}
                                  className={filters.page >= data.totalPages ? "pointer-events-none opacity-50" : ""}
                             />
                         </PaginationContent>
                     </Pagination>
                 </div>
             )}

        </div>
    );
}


 export default function ProductsPage() {
     // Suspense is needed because useSearchParams() can only be used in Client Components
     // See: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
     return (
         <Suspense fallback={<div >Loading filters...</div>}>
             <ProductGrid />
         </Suspense>
     );
 }
