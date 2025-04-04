import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { CategoryCard } from "@/components/category-card"
import type { Metadata } from 'next';

// Dummy featured products data
const featuredProducts = [
  {
    id: "1",
    name: "هاتف ذكي جديد",
    description: "هاتف ذكي متطور بمواصفات عالية",
    price: 2500,
    image: "/placeholder.svg?height=200&width=200",
    category: "electronics",
    seller: "شركة الإلكترونيات",
  },
  {
    id: "2",
    name: "لابتوب احترافي",
    description: "لابتوب للألعاب والتصميم",
    price: 5000,
    image: "/placeholder.svg?height=200&width=200",
    category: "electronics",
    seller: "متجر تكنو",
  },
  {
    id: "3",
    name: "سماعات لاسلكية",
    description: "سماعات بجودة صوت عالية",
    price: 350,
    image: "/placeholder.svg?height=200&width=200",
    category: "electronics",
    seller: "متجر الصوتيات",
  },
  {
    id: "4",
    name: "حقيبة يد فاخرة",
    description: "حقيبة يد من الجلد الطبيعي",
    price: 850,
    image: "/placeholder.svg?height=200&width=200",
    category: "fashion",
    seller: "بوتيك الموضة",
  },
]

// Dummy categories data
const categories = [
  {
    _id: "1",
    name: "الإلكترونيات",
    image: "/placeholder.svg?height=150&width=150",
    count: 120,
  },
  {
    _id: "2",
    name: "الموضة",
    image: "/placeholder.svg?height=150&width=150",
    count: 85,
  },
  {
    _id: "3",
    name: "المنزل",
    image: "/placeholder.svg?height=150&width=150",
    count: 65,
  },
  {
    _id: "4",
    name: "الرياضة",
    image: "/placeholder.svg?height=150&width=150",
    count: 40,
  },
]

export const metadata: Metadata = {
  title: 'متجري - اسم متجرك | الصفحة الرئيسية',
  description: 'تسوق أفضل المنتجات بأسعار تنافسية',
  openGraph: {
    title: 'متجري - اسم متجرك',
    description: 'تسوق أفضل المنتجات بأسعار تنافسية',
    // url: 'https://yourstore.com', // رابط موقعك
    // siteName: 'متجري - اسم متجرك',
    // images: [ { url: 'https://yourstore.com/og-image.png', width: 800, height: 600 } ], // رابط صورة للمشاركة
    // locale: 'ar_SA', // اللغة
    type: 'website',
  },
};

export default function Home() {
  return (
    <div>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Mart Eagle
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                تسوق بسهولة واحصل على أفضل المنتجات من أفضل البائعين
              </p>
            </div>
            <div className="space-x-4 rtl:space-x-reverse">
              <Link href="/products">
                <Button className="bg-blue-600 hover:bg-blue-700">تصفح المنتجات</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  تسجيل الدخول
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold tracking-tighter">الفئات المميزة</h2>
              <p className="text-gray-500 dark:text-gray-400">تصفح أشهر الفئات في متجرنا</p>
            </div>
            <Link href="/products">
              <Button variant="link">عرض جميع الفئات</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold tracking-tighter">المنتجات المميزة</h2>
              <p className="text-gray-500 dark:text-gray-400">اكتشف أحدث المنتجات في متجرنا</p>
            </div>
            <Link href="/products">
              <Button variant="link">عرض جميع المنتجات</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 md:gap-8">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-4 bg-blue-600 text-white rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">منتجات متنوعة</h3>
              <p className="text-gray-500 dark:text-gray-400">الآلاف من المنتجات المتنوعة في أقسام مختلفة</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-4 bg-blue-600 text-white rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">تتبع الطلبات</h3>
              <p className="text-gray-500 dark:text-gray-400">تتبع طلباتك ومعرفة موعد وصولها بسهولة</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-4 bg-blue-600 text-white rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">حسابات متعددة</h3>
              <p className="text-gray-500 dark:text-gray-400">حسابات مختلفة للعملاء والبائعين والإدارة</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

