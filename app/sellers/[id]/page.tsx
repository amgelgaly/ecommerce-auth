import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StarIcon, MapPin, Phone, Mail, Calendar } from "lucide-react"
import { ProductCard } from "@/components/product-card"

// This would come from a database in a real application
function getSellerById(id: string) {
  const sellers = {
    s1: {
      id: "s1",
      name: "شركة الإلكترونيات",
      description:
        "متخصصون في بيع أحدث الأجهزة الإلكترونية والهواتف الذكية بأفضل الأسعار وجودة عالية. نوفر منتجات أصلية مع ضمان وخدمة ما بعد البيع.",
      image: "/placeholder.svg?height=300&width=300",
      coverImage: "/placeholder.svg?height=400&width=1200",
      rating: 4.8,
      reviewsCount: 156,
      productsCount: 45,
      joinedDate: "2022-03-15",
      location: "القاهرة، مصر",
      contact: {
        phone: "+20 123 456 7890",
        email: "info@electronics-company.com",
      },
      products: [
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
          seller: "شركة الإلكترونيات",
        },
        {
          id: "3",
          name: "سماعات لاسلكية",
          description: "سماعات بجودة صوت عالية",
          price: 350,
          image: "/placeholder.svg?height=200&width=200",
          category: "electronics",
          seller: "شركة الإلكترونيات",
        },
      ],
      reviews: [
        {
          id: "r1",
          userId: "u1",
          userName: "أحمد محمد",
          rating: 5,
          comment: "تعاملت مع الشركة عدة مرات وكانت التجربة ممتازة في كل مرة. المنتجات أصلية والتوصيل سريع.",
          date: "2023-05-15",
        },
        {
          id: "r2",
          userId: "u2",
          userName: "سارة خالد",
          rating: 4,
          comment: "منتجات ذات جودة عالية وأسعار منافسة. خدمة العملاء ممتازة.",
          date: "2023-04-20",
        },
      ],
    },
    s2: {
      id: "s2",
      name: "متجر الأزياء",
      description:
        "أحدث صيحات الموضة والأزياء للرجال والنساء والأطفال بأسعار مناسبة وجودة ممتازة. نوفر تشكيلة واسعة من الملابس والأحذية والإكسسوارات.",
      image: "/placeholder.svg?height=300&width=300",
      coverImage: "/placeholder.svg?height=400&width=1200",
      rating: 4.5,
      reviewsCount: 98,
      productsCount: 120,
      joinedDate: "2021-08-10",
      location: "الإسكندرية، مصر",
      contact: {
        phone: "+20 111 222 3333",
        email: "info@fashion-store.com",
      },
      products: [
        {
          id: "4",
          name: "قميص رجالي أنيق",
          description: "قميص قطني بتصميم عصري",
          price: 350,
          image: "/placeholder.svg?height=200&width=200",
          category: "fashion",
          seller: "متجر الأزياء",
        },
        {
          id: "5",
          name: "فستان نسائي",
          description: "فستان أنيق للمناسبات",
          price: 650,
          image: "/placeholder.svg?height=200&width=200",
          category: "fashion",
          seller: "متجر الأزياء",
        },
        {
          id: "6",
          name: "حذاء رياضي",
          description: "حذاء رياضي مريح للجري",
          price: 450,
          image: "/placeholder.svg?height=200&width=200",
          category: "fashion",
          seller: "متجر الأزياء",
        },
      ],
      reviews: [
        {
          id: "r3",
          userId: "u3",
          userName: "محمد علي",
          rating: 5,
          comment: "جودة الملابس ممتازة والأسعار معقولة. سرعة في التوصيل وخدمة عملاء متميزة.",
          date: "2023-03-10",
        },
        {
          id: "r4",
          userId: "u4",
          userName: "فاطمة أحمد",
          rating: 4,
          comment: "تشكيلة رائعة من الملابس والإكسسوارات. أنصح بالتعامل معهم.",
          date: "2023-02-15",
        },
      ],
    },
    s3: {
      id: "s3",
      name: "متجر الصوتيات",
      description:
        "متخصصون في بيع أجهزة الصوت والسماعات عالية الجودة من أشهر الماركات العالمية. نوفر منتجات أصلية بضمان وخدمة ما بعد البيع.",
      image: "/placeholder.svg?height=300&width=300",
      coverImage: "/placeholder.svg?height=400&width=1200",
      rating: 4.7,
      reviewsCount: 72,
      productsCount: 35,
      joinedDate: "2022-01-20",
      location: "القاهرة، مصر",
      contact: {
        phone: "+20 123 789 4560",
        email: "info@audio-store.com",
      },
      products: [
        {
          id: "7",
          name: "سماعات احترافية",
          description: "سماعات استوديو احترافية",
          price: 1200,
          image: "/placeholder.svg?height=200&width=200",
          category: "electronics",
          seller: "متجر الصوتيات",
        },
        {
          id: "8",
          name: "مكبر صوت بلوتوث",
          description: "مكبر صوت لاسلكي بجودة عالية",
          price: 750,
          image: "/placeholder.svg?height=200&width=200",
          category: "electronics",
          seller: "متجر الصوتيات",
        },
        {
          id: "9",
          name: "ميكروفون احترافي",
          description: "ميكروفون للتسجيل الصوتي",
          price: 850,
          image: "/placeholder.svg?height=200&width=200",
          category: "electronics",
          seller: "متجر الصوتيات",
        },
      ],
      reviews: [
        {
          id: "r5",
          userId: "u5",
          userName: "خالد محمود",
          rating: 5,
          comment: "منتجات أصلية وذات جودة عالية. خدمة العملاء ممتازة والتوصيل سريع.",
          date: "2023-04-05",
        },
        {
          id: "r6",
          userId: "u6",
          userName: "نورا سامي",
          rating: 4,
          comment: "أسعار منافسة وجودة ممتازة. أنصح بالتعامل معهم.",
          date: "2023-03-20",
        },
      ],
    },
    s4: {
      id: "s4",
      name: "بوتيك الموضة",
      description:
        "ملابس وإكسسوارات فاخرة للمناسبات والحفلات بتصميمات حصرية وأنيقة. نوفر أحدث صيحات الموضة العالمية بجودة عالية.",
      image: "/placeholder.svg?height=300&width=300",
      coverImage: "/placeholder.svg?height=400&width=1200",
      rating: 4.9,
      reviewsCount: 45,
      productsCount: 60,
      joinedDate: "2022-05-15",
      location: "الجيزة، مصر",
      contact: {
        phone: "+20 111 555 7777",
        email: "info@fashion-boutique.com",
      },
      products: [
        {
          id: "10",
          name: "فستان سهرة",
          description: "فستان سهرة فاخر للمناسبات",
          price: 1500,
          image: "/placeholder.svg?height=200&width=200",
          category: "fashion",
          seller: "بوتيك الموضة",
        },
        {
          id: "11",
          name: "بدلة رجالي",
          description: "بدلة رجالي أنيقة للمناسبات",
          price: 2200,
          image: "/placeholder.svg?height=200&width=200",
          category: "fashion",
          seller: "بوتيك الموضة",
        },
        {
          id: "12",
          name: "حقيبة يد نسائية",
          description: "حقيبة يد فاخرة للسيدات",
          price: 950,
          image: "/placeholder.svg?height=200&width=200",
          category: "fashion",
          seller: "بوتيك الموضة",
        },
      ],
      reviews: [
        {
          id: "r7",
          userId: "u7",
          userName: "سمر أحمد",
          rating: 5,
          comment: "تصميمات رائعة وجودة ممتازة. خدمة العملاء متميزة والتوصيل سريع.",
          date: "2023-05-10",
        },
        {
          id: "r8",
          userId: "u8",
          userName: "أحمد سامي",
          rating: 5,
          comment: "أفضل متجر للملابس الفاخرة. التصميمات حصرية والجودة عالية.",
          date: "2023-04-25",
        },
      ],
    },
    s5: {
      id: "s5",
      name: "متجر المنزل",
      description:
        "كل ما يخص المنزل من أثاث ومستلزمات وديكورات بتصميمات عصرية وجودة عالية. نوفر منتجات متنوعة لتجديد منزلك بأفضل الأسعار.",
      image: "/placeholder.svg?height=300&width=300",
      coverImage: "/placeholder.svg?height=400&width=1200",
      rating: 4.6,
      reviewsCount: 112,
      productsCount: 85,
      joinedDate: "2021-11-10",
      location: "المنصورة، مصر",
      contact: {
        phone: "+20 123 456 8888",
        email: "info@home-store.com",
      },
      products: [
        {
          id: "13",
          name: "طقم كنب عصري",
          description: "طقم كنب بتصميم عصري وأنيق",
          price: 7500,
          image: "/placeholder.svg?height=200&width=200",
          category: "home",
          seller: "متجر المنزل",
        },
        {
          id: "14",
          name: "طاولة طعام",
          description: "طاولة طعام خشبية فاخرة",
          price: 3200,
          image: "/placeholder.svg?height=200&width=200",
          category: "home",
          seller: "متجر المنزل",
        },
        {
          id: "15",
          name: "سجادة غرفة معيشة",
          description: "سجادة بتصميم عصري وألوان متناسقة",
          price: 1200,
          image: "/placeholder.svg?height=200&width=200",
          category: "home",
          seller: "متجر المنزل",
        },
      ],
      reviews: [
        {
          id: "r9",
          userId: "u9",
          userName: "محمد سعيد",
          rating: 5,
          comment: "منتجات ذات جودة عالية وأسعار منافسة. التوصيل سريع وخدمة العملاء ممتازة.",
          date: "2023-03-15",
        },
        {
          id: "r10",
          userId: "u10",
          userName: "هدى علي",
          rating: 4,
          comment: "تشكيلة رائعة من الأثاث والديكورات. أنصح بالتعامل معهم.",
          date: "2023-02-20",
        },
      ],
    },
    s6: {
      id: "s6",
      name: "متجر الأجهزة المنزلية",
      description:
        "أجهزة منزلية وكهربائية من أشهر الماركات العالمية بضمان وخدمة ما بعد البيع. نوفر أحدث الأجهزة بأفضل الأسعار.",
      image: "/placeholder.svg?height=300&width=300",
      coverImage: "/placeholder.svg?height=400&width=1200",
      rating: 4.4,
      reviewsCount: 87,
      productsCount: 50,
      joinedDate: "2022-02-05",
      location: "طنطا، مصر",
      contact: {
        phone: "+20 123 789 1111",
        email: "info@appliances-store.com",
      },
      products: [
        {
          id: "16",
          name: "غسالة أوتوماتيك",
          description: "غسالة ملابس أوتوماتيك بالكامل",
          price: 6500,
          image: "/placeholder.svg?height=200&width=200",
          category: "home",
          seller: "متجر الأجهزة المنزلية",
        },
        {
          id: "17",
          name: "ثلاجة نوفروست",
          description: "ثلاجة بتقنية النوفروست المتطورة",
          price: 8200,
          image: "/placeholder.svg?height=200&width=200",
          category: "home",
          seller: "متجر الأجهزة المنزلية",
        },
        {
          id: "18",
          name: "مكيف هواء",
          description: "مكيف هواء بتقنية التبريد السريع",
          price: 5500,
          image: "/placeholder.svg?height=200&width=200",
          category: "home",
          seller: "متجر الأجهزة المنزلية",
        },
      ],
      reviews: [
        {
          id: "r11",
          userId: "u11",
          userName: "أحمد فؤاد",
          rating: 4,
          comment: "أجهزة أصلية وبأسعار منافسة. خدمة العملاء جيدة والتوصيل في الموعد.",
          date: "2023-04-10",
        },
        {
          id: "r12",
          userId: "u12",
          userName: "سمية محمد",
          rating: 5,
          comment: "تعاملت معهم عدة مرات وكانت التجربة ممتازة في كل مرة. أنصح بالتعامل معهم.",
          date: "2023-03-25",
        },
      ],
    },
    s7: {
      id: "s7",
      name: "متجر الرياضة",
      description:
        "كل ما يخص الرياضة من ملابس وأحذية وأدوات رياضية من أشهر الماركات العالمية. نوفر منتجات أصلية بأفضل الأسعار.",
      image: "/placeholder.svg?height=300&width=300",
      coverImage: "/placeholder.svg?height=400&width=1200",
      rating: 4.7,
      reviewsCount: 65,
      productsCount: 70,
      joinedDate: "2022-04-10",
      location: "الإسكندرية، مصر",
      contact: {
        phone: "+20 111 222 4444",
        email: "info@sports-store.com",
      },
      products: [
        {
          id: "19",
          name: "حذاء رياضي للجري",
          description: "حذاء رياضي مريح للجري والتمارين",
          price: 850,
          image: "/placeholder.svg?height=200&width=200",
          category: "sports",
          seller: "متجر الرياضة",
        },
        {
          id: "20",
          name: "بدلة رياضية",
          description: "بدلة رياضية مريحة للتمارين",
          price: 650,
          image: "/placeholder.svg?height=200&width=200",
          category: "sports",
          seller: "متجر الرياضة",
        },
        {
          id: "21",
          name: "كرة قدم",
          description: "كرة قدم احترافية",
          price: 350,
          image: "/placeholder.svg?height=200&width=200",
          category: "sports",
          seller: "متجر الرياضة",
        },
      ],
      reviews: [
        {
          id: "r13",
          userId: "u13",
          userName: "محمود سامي",
          rating: 5,
          comment: "منتجات أصلية وذات جودة عالية. خدمة العملاء ممتازة والتوصيل سريع.",
          date: "2023-05-05",
        },
        {
          id: "r14",
          userId: "u14",
          userName: "رانيا أحمد",
          rating: 4,
          comment: "أسعار منافسة وجودة ممتازة. أنصح بالتعامل معهم.",
          date: "2023-04-15",
        },
      ],
    },
    s8: {
      id: "s8",
      name: "متجر الهدايا",
      description:
        "هدايا مميزة ومتنوعة لجميع المناسبات والأعياد بأفكار إبداعية وأسعار مناسبة. نقدم خدمة التغليف الأنيق والتوصيل السريع.",
      image: "/placeholder.svg?height=300&width=300",
      coverImage: "/placeholder.svg?height=400&width=1200",
      rating: 4.8,
      reviewsCount: 53,
      productsCount: 65,
      joinedDate: "2022-03-20",
      location: "القاهرة، مصر",
      contact: {
        phone: "+20 123 456 9999",
        email: "info@gifts-store.com",
      },
      products: [
        {
          id: "22",
          name: "صندوق هدايا فاخر",
          description: "صندوق هدايا متنوع للمناسبات الخاصة",
          price: 750,
          image: "/placeholder.svg?height=200&width=200",
          category: "gifts",
          seller: "متجر الهدايا",
        },
        {
          id: "23",
          name: "ساعة يد أنيقة",
          description: "ساعة يد فاخرة مناسبة كهدية",
          price: 1200,
          image: "/placeholder.svg?height=200&width=200",
          category: "gifts",
          seller: "متجر الهدايا",
        },
        {
          id: "24",
          name: "طقم عطور",
          description: "طقم عطور فاخر للرجال والنساء",
          price: 950,
          image: "/placeholder.svg?height=200&width=200",
          category: "gifts",
          seller: "متجر الهدايا",
        },
      ],
      reviews: [
        {
          id: "r15",
          userId: "u15",
          userName: "سارة محمود",
          rating: 5,
          comment: "أفكار هدايا رائعة وتغليف أنيق. خدمة العملاء ممتازة والتوصيل سريع.",
          date: "2023-05-20",
        },
        {
          id: "r16",
          userId: "u16",
          userName: "محمد كريم",
          rating: 5,
          comment: "منتجات متميزة وأفكار إبداعية. أنصح بالتعامل معهم لشراء الهدايا.",
          date: "2023-04-30",
        },
      ],
    },
    s9: {
      id: "s9",
      name: "متجر الكتب",
      description:
        "مكتبة متكاملة تضم أحدث الإصدارات من الكتب العربية والأجنبية في مختلف المجالات. نوفر خدمة التوصيل لجميع المحافظات.",
      image: "/placeholder.svg?height=300&width=300",
      coverImage: "/placeholder.svg?height=400&width=1200",
      rating: 4.9,
      reviewsCount: 41,
      productsCount: 150,
      joinedDate: "2022-01-15",
      location: "الإسكندرية، مصر",
      contact: {
        phone: "+20 111 555 8888",
        email: "info@books-store.com",
      },
      products: [
        {
          id: "25",
          name: "رواية عربية",
          description: "رواية عربية من تأليف كاتب مشهور",
          price: 120,
          image: "/placeholder.svg?height=200&width=200",
          category: "books",
          seller: "متجر الكتب",
        },
        {
          id: "26",
          name: "كتاب تنمية بشرية",
          description: "كتاب في مجال التنمية البشرية وتطوير الذات",
          price: 150,
          image: "/placeholder.svg?height=200&width=200",
          category: "books",
          seller: "متجر الكتب",
        },
        {
          id: "27",
          name: "كتاب تاريخي",
          description: "كتاب يتناول أحداث تاريخية مهمة",
          price: 180,
          image: "/placeholder.svg?height=200&width=200",
          category: "books",
          seller: "متجر الكتب",
        },
      ],
      reviews: [
        {
          id: "r17",
          userId: "u17",
          userName: "أحمد سعيد",
          rating: 5,
          comment: "تشكيلة رائعة من الكتب وأسعار منافسة. التوصيل سريع وخدمة العملاء ممتازة.",
          date: "2023-05-15",
        },
        {
          id: "r18",
          userId: "u18",
          userName: "نورا محمد",
          rating: 5,
          comment: "أفضل متجر للكتب. يوفرون أحدث الإصدارات بأسعار معقولة.",
          date: "2023-04-25",
        },
      ],
    },
  }

  return sellers[id as keyof typeof sellers]
}

export default function SellerPage({ params }: { params: { id: string } }) {
  const seller = getSellerById(params.id)

  if (!seller) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">البائع غير موجود</h1>
        <Link href="/sellers">
          <Button className="bg-blue-600 hover:bg-blue-700">العودة للبائعين</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={seller.coverImage || "/placeholder.svg?height=400&width=1200"}
          alt={`${seller.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="container py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="relative -mt-20 md:-mt-24">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white bg-white">
                <img
                  src={seller.image || "/placeholder.svg"}
                  alt={seller.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="mt-4">
              <h1 className="text-3xl font-bold">{seller.name}</h1>
              <div className="flex items-center mt-2">
                <StarIcon className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="mr-1 font-medium">{seller.rating}</span>
                <span className="text-muted-foreground">({seller.reviewsCount} تقييم)</span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">الموقع</h3>
                    <p className="text-muted-foreground">{seller.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">رقم الهاتف</h3>
                    <p className="text-muted-foreground">{seller.contact.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">البريد الإلكتروني</h3>
                    <p className="text-muted-foreground">{seller.contact.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">تاريخ الانضمام</h3>
                    <p className="text-muted-foreground">{new Date(seller.joinedDate).toLocaleDateString("ar-EG")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>عن المتجر</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{seller.description}</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="products" className="mt-8">
              <TabsList>
                <TabsTrigger value="products">المنتجات ({seller.products.length})</TabsTrigger>
                <TabsTrigger value="reviews">التقييمات ({seller.reviews.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {seller.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href={`/products?seller=${seller.id}`}>عرض جميع المنتجات</Link>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-4">
                  {seller.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-semibold">{review.userName}</h4>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

