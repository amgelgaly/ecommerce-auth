"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { StarIcon, MapPin, Search } from "lucide-react"

// This would come from a database in a real application
const sellers = [
  {
    id: "s1",
    name: "شركة الإلكترونيات",
    description: "متخصصون في بيع أحدث الأجهزة الإلكترونية والهواتف الذكية بأفضل الأسعار وجودة عالية.",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviewsCount: 156,
    location: "القاهرة، مصر",
    category: "electronics",
  },
  {
    id: "s2",
    name: "متجر الأزياء",
    description: "أحدث صيحات الموضة والأزياء للرجال والنساء والأطفال بأسعار مناسبة وجودة ممتازة.",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    reviewsCount: 98,
    location: "الإسكندرية، مصر",
    category: "fashion",
  },
  {
    id: "s3",
    name: "متجر الصوتيات",
    description: "متخصصون في بيع أجهزة الصوت والسماعات عالية الجودة من أشهر الماركات العالمية.",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviewsCount: 72,
    location: "القاهرة، مصر",
    category: "electronics",
  },
  {
    id: "s4",
    name: "بوتيك الموضة",
    description: "ملابس وإكسسوارات فاخرة للمناسبات والحفلات بتصميمات حصرية وأنيقة.",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    reviewsCount: 45,
    location: "الجيزة، مصر",
    category: "fashion",
  },
  {
    id: "s5",
    name: "متجر المنزل",
    description: "كل ما يخص المنزل من أثاث ومستلزمات وديكورات بتصميمات عصرية وجودة عالية.",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    reviewsCount: 112,
    location: "المنصورة، مصر",
    category: "home",
  },
  {
    id: "s6",
    name: "متجر الأجهزة المنزلية",
    description: "أجهزة منزلية وكهربائية من أشهر الماركات العالمية بضمان وخدمة ما بعد البيع.",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.4,
    reviewsCount: 87,
    location: "طنطا، مصر",
    category: "home",
  },
  {
    id: "s7",
    name: "متجر الرياضة",
    description: "كل ما يخص الرياضة من ملابس وأحذية وأدوات رياضية من أشهر الماركات العالمية.",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviewsCount: 65,
    location: "الإسكندرية، مصر",
    category: "sports",
  },
  {
    id: "s8",
    name: "متجر الهدايا",
    description: "هدايا مميزة ومتنوعة لجميع المناسبات والأعياد بأفكار إبداعية وأسعار مناسبة.",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviewsCount: 53,
    location: "القاهرة، مصر",
    category: "gifts",
  },
  {
    id: "s9",
    name: "متجر الكتب",
    description: "مكتبة متكاملة تضم أحدث الإصدارات من الكتب العربية والأجنبية في مختلف المجالات.",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    reviewsCount: 41,
    location: "الإسكندرية، مصر",
    category: "books",
  },
]

// Categories for filtering
const categories = [
  { id: "all", name: "جميع الفئات" },
  { id: "electronics", name: "إلكترونيات" },
  { id: "fashion", name: "أزياء" },
  { id: "home", name: "منزل" },
  { id: "sports", name: "رياضة" },
  { id: "gifts", name: "هدايا" },
  { id: "books", name: "كتب" },
]

export default function SellersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Filter sellers based on search query and selected category
  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || seller.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">البائعون</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="ابحث عن بائع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={selectedCategory === category.id ? "bg-blue-600 hover:bg-blue-700" : ""}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSellers.map((seller) => (
          <Link key={seller.id} href={`/sellers/${seller.id}`} className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={seller.image || "/placeholder.svg"}
                      alt={seller.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{seller.name}</h3>
                    <div className="flex items-center mt-1 mb-2">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="mr-1 text-sm font-medium">{seller.rating}</span>
                      <span className="text-sm text-muted-foreground">({seller.reviewsCount} تقييم)</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      {seller.location}
                    </div>
                    <p className="text-sm line-clamp-2">{seller.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredSellers.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">لا يوجد بائعين مطابقين للبحث</h3>
          <p className="text-muted-foreground mt-2">حاول تغيير معايير البحث أو الفئة المحددة</p>
        </div>
      )}
    </div>
  )
}

