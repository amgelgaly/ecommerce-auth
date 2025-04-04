import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Phone, Calendar, ShoppingBag, CreditCard, UserX } from "lucide-react"

// Dummy users data
const users = {
  u1: {
    id: "u1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+20 123 456 7890",
    role: "customer",
    status: "active",
    date: "2022-03-15",
    ordersCount: 12,
    totalSpent: 15600,
    orders: [
      {
        id: "123456",
        date: "2023-06-15",
        status: "delivered",
        total: 2850,
        items: [
          { id: "1", name: "هاتف ذكي جديد", quantity: 1, price: 2500 },
          { id: "3", name: "سماعات لاسلكية", quantity: 1, price: 350 },
        ],
      },
      {
        id: "123458",
        date: "2023-06-13",
        status: "processing",
        total: 3500,
        items: [
          { id: "1", name: "هاتف ذكي جديد", quantity: 1, price: 2500 },
          { id: "4", name: "ساعة ذكية", quantity: 1, price: 1000 },
        ],
      },
      {
        id: "123460",
        date: "2023-06-11",
        status: "cancelled",
        total: 1500,
        items: [{ id: "1", name: "هاتف ذكي جديد", quantity: 1, price: 1500 }],
      },
    ],
    address: {
      street: "شارع النصر، 123",
      city: "القاهرة",
      postalCode: "12345",
      country: "مصر",
    },
  },
  u2: {
    id: "u2",
    name: "سارة خالد",
    email: "sara@example.com",
    phone: "+20 123 456 7891",
    role: "customer",
    status: "active",
    date: "2022-05-20",
    ordersCount: 8,
    totalSpent: 9200,
    orders: [
      {
        id: "123457",
        date: "2023-06-14",
        status: "shipped",
        total: 5000,
        items: [{ id: "2", name: "لابتوب احترافي", quantity: 1, price: 5000 }],
      },
      {
        id: "123461",
        date: "2023-06-10",
        status: "delivered",
        total: 4200,
        items: [{ id: "2", name: "لابتوب احترافي", quantity: 1, price: 4200 }],
      },
    ],
    address: {
      street: "شارع الحرية، 45",
      city: "الإسكندرية",
      postalCode: "21111",
      country: "مصر",
    },
  },
}

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const userId = params.id
  const user = users[userId as keyof typeof users]

  if (!user) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">المستخدم غير موجود</h1>
        <p className="text-muted-foreground mb-6">لم يتم العثور على المستخدم برقم {userId}</p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/admin/users">العودة للمستخدمين</Link>
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">تم التسليم</span>
      case "shipped":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">تم الشحن</span>
      case "processing":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">قيد المعالجة</span>
      case "cancelled":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">ملغي</span>
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">غير معروف</span>
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">ملف المستخدم</h1>
          <p className="text-muted-foreground">عرض معلومات المستخدم وطلباته</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" asChild className="border-blue-600 text-blue-600 hover:bg-blue-50">
            <Link href="/admin/users">العودة للمستخدمين</Link>
          </Button>
          <Button variant="destructive" className="flex items-center gap-1">
            <UserX className="h-4 w-4" />
            حظر المستخدم
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>معلومات المستخدم</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">الاسم</h3>
                  <p>{user.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">البريد الإلكتروني</h3>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">رقم الهاتف</h3>
                  <p>{user.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">تاريخ التسجيل</h3>
                  <p>{user.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>العنوان</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>{user.address.street}</p>
                <p>
                  {user.address.city}، {user.address.postalCode}
                </p>
                <p>{user.address.country}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>إحصائيات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <ShoppingBag className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">عدد الطلبات</h3>
                  <p>{user.ordersCount}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">إجمالي المشتريات</h3>
                  <p>{user.totalSpent} ج.م</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>الطلبات</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">جميع الطلبات</TabsTrigger>
                  <TabsTrigger value="processing">قيد المعالجة</TabsTrigger>
                  <TabsTrigger value="delivered">تم التسليم</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <div className="space-y-4">
                    {user.orders.length > 0 ? (
                      user.orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold">طلب #{order.id}</h3>
                              <p className="text-sm text-muted-foreground">{order.date}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(order.status)}
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/orders/${order.id}`}>عرض التفاصيل</Link>
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>
                                  {item.name} × {item.quantity}
                                </span>
                                <span>{item.price * item.quantity} ج.م</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between font-semibold mt-4 pt-2 border-t">
                            <span>الإجمالي</span>
                            <span>{order.total} ج.م</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">لا توجد طلبات</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="processing">
                  <div className="space-y-4">
                    {user.orders.filter((o) => o.status === "processing").length > 0 ? (
                      user.orders
                        .filter((o) => o.status === "processing")
                        .map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-semibold">طلب #{order.id}</h3>
                                <p className="text-sm text-muted-foreground">{order.date}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(order.status)}
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/admin/orders/${order.id}`}>عرض التفاصيل</Link>
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>
                                    {item.name} × {item.quantity}
                                  </span>
                                  <span>{item.price * item.quantity} ج.م</span>
                                </div>
                              ))}
                            </div>

                            <div className="flex justify-between font-semibold mt-4 pt-2 border-t">
                              <span>الإجمالي</span>
                              <span>{order.total} ج.م</span>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">لا توجد طلبات قيد المعالجة</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="delivered">
                  <div className="space-y-4">
                    {user.orders.filter((o) => o.status === "delivered").length > 0 ? (
                      user.orders
                        .filter((o) => o.status === "delivered")
                        .map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-semibold">طلب #{order.id}</h3>
                                <p className="text-sm text-muted-foreground">{order.date}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(order.status)}
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/admin/orders/${order.id}`}>عرض التفاصيل</Link>
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>
                                    {item.name} × {item.quantity}
                                  </span>
                                  <span>{item.price * item.quantity} ج.م</span>
                                </div>
                              ))}
                            </div>

                            <div className="flex justify-between font-semibold mt-4 pt-2 border-t">
                              <span>الإجمالي</span>
                              <span>{order.total} ج.م</span>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">لا توجد طلبات تم تسليمها</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

