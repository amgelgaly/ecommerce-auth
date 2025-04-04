import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Truck, Package, Clock } from "lucide-react"

// This would come from a database in a real application
function getOrderById(id: string) {
  const orders = {
    "123456": {
      id: "123456",
      status: "processing",
      date: "2023-06-15",
      estimatedDelivery: "2023-06-20",
      items: [
        {
          id: "1",
          name: "هاتف ذكي جديد",
          price: 2500,
          quantity: 1,
          image: "/placeholder.svg?height=100&width=100",
        },
        {
          id: "3",
          name: "سماعات لاسلكية",
          price: 350,
          quantity: 2,
          image: "/placeholder.svg?height=100&width=100",
        },
      ],
      total: 3200,
      shippingAddress: {
        name: "أحمد محمد",
        street: "شارع النصر، 123",
        city: "القاهرة",
        postalCode: "12345",
        country: "مصر",
        phone: "+20 123 456 7890",
      },
      trackingSteps: [
        {
          id: 1,
          title: "تم استلام الطلب",
          description: "تم استلام طلبك وهو قيد المعالجة",
          date: "2023-06-15 10:30",
          completed: true,
        },
        {
          id: 2,
          title: "تم تجهيز الطلب",
          description: "تم تجهيز طلبك وهو جاهز للشحن",
          date: "2023-06-16 14:45",
          completed: true,
        },
        {
          id: 3,
          title: "تم شحن الطلب",
          description: "تم شحن طلبك وهو في الطريق إليك",
          date: "2023-06-17 09:15",
          completed: false,
        },
        {
          id: 4,
          title: "تم التسليم",
          description: "تم تسليم طلبك بنجاح",
          date: "",
          completed: false,
        },
      ],
    },
  }

  return orders[id as keyof typeof orders]
}

export default function TrackOrderPage({ params }: { params: { orderId: string } }) {
  const order = getOrderById(params.orderId)

  if (!order) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">الطلب غير موجود</h1>
        <p className="mb-6 text-muted-foreground">لم يتم العثور على الطلب برقم {params.orderId}</p>
        <Link href="/">
          <Button>العودة للصفحة الرئيسية</Button>
        </Link>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "processing":
        return "قيد المعالجة"
      case "shipped":
        return "تم الشحن"
      case "delivered":
        return "تم التسليم"
      default:
        return "غير معروف"
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">تتبع الطلب</h1>
          <p className="text-muted-foreground">رقم الطلب: {order.id}</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          {getStatusIcon(order.status)}
          <span className="font-medium">{getStatusText(order.status)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>حالة الطلب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute top-0 bottom-0 left-7 w-0.5 bg-muted" />
                <div className="space-y-8">
                  {order.trackingSteps.map((step) => (
                    <div key={step.id} className="relative flex gap-6">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center ${
                          step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.id}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                        {step.date && <p className="text-sm text-muted-foreground mt-1">{step.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold mb-2">موعد التسليم المتوقع</h3>
                <p>{order.estimatedDelivery}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>ملخص الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">المنتجات</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × {item.price} ج.م
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between font-bold text-lg">
                  <span>الإجمالي:</span>
                  <span>{order.total} ج.م</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>عنوان الشحن</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-2">{order.shippingAddress.phone}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

