import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, CheckCircle, Clock, User, MapPin, Phone, Mail, CreditCard } from "lucide-react"

// Dummy orders data
const orders = {
  "123456": {
    id: "123456",
    customer: {
      id: "u1",
      name: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "+20 123 456 7890",
    },
    date: "2023-06-15",
    status: "delivered",
    total: 2850,
    items: [
      {
        id: "1",
        name: "هاتف ذكي جديد",
        quantity: 1,
        price: 2500,
        image: "/placeholder.svg?height=80&width=80",
        seller: {
          id: "s1",
          name: "شركة الإلكترونيات",
        },
      },
      {
        id: "3",
        name: "سماعات لاسلكية",
        quantity: 1,
        price: 350,
        image: "/placeholder.svg?height=80&width=80",
        seller: {
          id: "s3",
          name: "متجر الصوتيات",
        },
      },
    ],
    paymentMethod: "cod",
    shippingAddress: {
      address: "شارع النصر، 123",
      city: "القاهرة",
      postalCode: "12345",
      country: "مصر",
    },
    notes: "يرجى الاتصال قبل التسليم",
    timeline: [
      { status: "ordered", date: "2023-06-15 10:30", description: "تم استلام الطلب" },
      { status: "processing", date: "2023-06-15 14:45", description: "قيد المعالجة" },
      { status: "shipped", date: "2023-06-16 09:15", description: "تم شحن الطلب" },
      { status: "delivered", date: "2023-06-17 15:30", description: "تم تسليم الطلب" },
    ],
  },
  "123457": {
    id: "123457",
    customer: {
      id: "u2",
      name: "سارة خالد",
      email: "sara@example.com",
      phone: "+20 123 456 7891",
    },
    date: "2023-06-14",
    status: "shipped",
    total: 5000,
    items: [
      {
        id: "2",
        name: "لابتوب احترافي",
        quantity: 1,
        price: 5000,
        image: "/placeholder.svg?height=80&width=80",
        seller: {
          id: "s2",
          name: "متجر تكنو",
        },
      },
    ],
    paymentMethod: "credit",
    shippingAddress: {
      address: "شارع الحرية، 45",
      city: "الإسكندرية",
      postalCode: "21111",
      country: "مصر",
    },
    notes: "",
    timeline: [
      { status: "ordered", date: "2023-06-14 11:20", description: "تم استلام الطلب" },
      { status: "processing", date: "2023-06-14 16:30", description: "قيد المعالجة" },
      { status: "shipped", date: "2023-06-15 10:45", description: "تم شحن الطلب" },
    ],
  },
  "123458": {
    id: "123458",
    customer: {
      id: "u3",
      name: "محمد علي",
      email: "mohamed@example.com",
      phone: "+20 123 456 7892",
    },
    date: "2023-06-13",
    status: "processing",
    total: 3500,
    items: [
      {
        id: "1",
        name: "هاتف ذكي جديد",
        quantity: 1,
        price: 2500,
        image: "/placeholder.svg?height=80&width=80",
        seller: {
          id: "s1",
          name: "شركة الإلكترونيات",
        },
      },
      {
        id: "4",
        name: "ساعة ذكية",
        quantity: 1,
        price: 1000,
        image: "/placeholder.svg?height=80&width=80",
        seller: {
          id: "s1",
          name: "شركة الإلكترونيات",
        },
      },
    ],
    paymentMethod: "wallet",
    shippingAddress: {
      address: "شارع الهرم، 78",
      city: "الجيزة",
      postalCode: "12411",
      country: "مصر",
    },
    notes: "الطلب هدية، يرجى التغليف بشكل جميل",
    timeline: [
      { status: "ordered", date: "2023-06-13 09:15", description: "تم استلام الطلب" },
      { status: "processing", date: "2023-06-13 14:20", description: "قيد المعالجة" },
    ],
  },
}

export default function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
  const orderId = params.id
  const order = orders[orderId as keyof typeof orders]

  if (!order) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">الطلب غير موجود</h1>
        <p className="text-muted-foreground mb-6">لم يتم العثور على الطلب برقم {orderId}</p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/admin/orders">العودة للطلبات</Link>
        </Button>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ordered":
        return <Package className="h-6 w-6 text-blue-500" />
      case "processing":
        return <Clock className="h-6 w-6 text-yellow-500" />
      case "shipped":
        return <Truck className="h-6 w-6 text-blue-500" />
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "cancelled":
        return <Package className="h-6 w-6 text-red-500" />
      default:
        return <Package className="h-6 w-6" />
    }
  }

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "cod":
        return "الدفع عند الاستلام"
      case "credit":
        return "بطاقة ائتمان"
      case "wallet":
        return "محفظة إلكترونية"
      default:
        return method
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">تفاصيل الطلب #{order.id}</h1>
          <p className="text-muted-foreground">تاريخ الطلب: {order.date}</p>
        </div>
        <Button variant="outline" asChild className="mt-4 md:mt-0 border-blue-600 text-blue-600 hover:bg-blue-50">
          <Link href="/admin/orders">العودة للطلبات</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>المنتجات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-2 border-b last:border-0">
                    <div className="w-20 h-20 rounded-md overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × {item.price} ج.م
                      </p>
                      <p className="text-sm text-blue-600 hover:underline">
                        <Link href={`/sellers/${item.seller.id}`}>{item.seller.name}</Link>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.price * item.quantity} ج.م</p>
                    </div>
                  </div>
                ))}

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span>{order.total} ج.م</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>الإجمالي:</span>
                    <span>{order.total} ج.م</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>حالة الطلب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute top-0 bottom-0 left-7 w-0.5 bg-muted" />
                <div className="space-y-8">
                  {order.timeline.map((step, index) => (
                    <div key={index} className="relative flex gap-6">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center bg-muted">
                        {getStatusIcon(step.status)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{step.description}</h3>
                        <p className="text-sm text-muted-foreground">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>معلومات العميل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">الاسم</h3>
                    <p>{order.customer.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">البريد الإلكتروني</h3>
                    <p>{order.customer.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">رقم الهاتف</h3>
                    <p>{order.customer.phone}</p>
                  </div>
                </div>

                <Button variant="outline" asChild className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Link href={`/admin/users/${order.customer.id}`}>عرض ملف العميل</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>معلومات الشحن</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">العنوان</h3>
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city}، {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">طريقة الدفع</h3>
                    <p>{getPaymentMethodName(order.paymentMethod)}</p>
                  </div>
                </div>

                {order.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-1">ملاحظات</h3>
                      <p className="text-sm">{order.notes}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {order.status === "processing" && (
            <div className="flex gap-4">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">تحديث إلى "تم الشحن"</Button>
              <Button variant="outline" className="flex-1 border-red-600 text-red-600 hover:bg-red-50">
                إلغاء الطلب
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

