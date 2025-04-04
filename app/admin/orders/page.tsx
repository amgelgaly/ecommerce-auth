"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

// Dummy orders data
const orders = [
  {
    id: "123456",
    customer: {
      id: "u1",
      name: "أحمد محمد",
      email: "ahmed@example.com",
    },
    date: "2023-06-15",
    status: "delivered",
    total: 2850,
    paymentMethod: "cod",
    items: [
      { id: "1", name: "هاتف ذكي جديد", quantity: 1, price: 2500 },
      { id: "3", name: "سماعات لاسلكية", quantity: 1, price: 350 },
    ],
    sellers: ["شركة الإلكترونيات"],
  },
  {
    id: "123457",
    customer: {
      id: "u2",
      name: "سارة خالد",
      email: "sara@example.com",
    },
    date: "2023-06-14",
    status: "shipped",
    total: 5000,
    paymentMethod: "credit",
    items: [{ id: "2", name: "لابتوب احترافي", quantity: 1, price: 5000 }],
    sellers: ["متجر تكنو"],
  },
  {
    id: "123458",
    customer: {
      id: "u3",
      name: "محمد علي",
      email: "mohamed@example.com",
    },
    date: "2023-06-13",
    status: "processing",
    total: 3500,
    paymentMethod: "wallet",
    items: [
      { id: "1", name: "هاتف ذكي جديد", quantity: 1, price: 2500 },
      { id: "4", name: "ساعة ذكية", quantity: 1, price: 1000 },
    ],
    sellers: ["شركة الإلكترونيات"],
  },
  {
    id: "123459",
    customer: {
      id: "u4",
      name: "فاطمة أحمد",
      email: "fatma@example.com",
    },
    date: "2023-06-12",
    status: "delivered",
    total: 950,
    paymentMethod: "cod",
    items: [
      { id: "3", name: "سماعات لاسلكية", quantity: 1, price: 350 },
      { id: "4", name: "ساعة ذكية", quantity: 1, price: 600 },
    ],
    sellers: ["متجر الصوتيات", "شركة الإلكترونيات"],
  },
  {
    id: "123460",
    customer: {
      id: "u5",
      name: "خالد محمود",
      email: "khaled@example.com",
    },
    date: "2023-06-11",
    status: "cancelled",
    total: 1500,
    paymentMethod: "credit",
    items: [{ id: "1", name: "هاتف ذكي جديد", quantity: 1, price: 1500 }],
    sellers: ["شركة الإلكترونيات"],
  },
  {
    id: "123461",
    customer: {
      id: "u6",
      name: "نورا سامي",
      email: "noura@example.com",
    },
    date: "2023-06-10",
    status: "delivered",
    total: 4200,
    paymentMethod: "wallet",
    items: [{ id: "2", name: "لابتوب احترافي", quantity: 1, price: 4200 }],
    sellers: ["متجر تكنو"],
  },
]

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

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would filter orders based on the search query
    console.log("Searching for:", searchQuery)
  }

  const handleStatusChange = (orderId: string, status: string) => {
    // In a real app, you would call your API to update the order status
    console.log("Updating order status:", orderId, status)

    // Show success message
    toast({
      title: "تم تحديث حالة الطلب",
      description: "تم تحديث حالة الطلب بنجاح",
    })
  }

  // Filter orders based on selected tab
  const filteredOrders = selectedTab === "all" ? orders : orders.filter((order) => order.status === selectedTab)

  // Calculate statistics
  const totalOrders = orders.length
  const totalDelivered = orders.filter((order) => order.status === "delivered").length
  const totalProcessing = orders.filter((order) => order.status === "processing").length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">إدارة الطلبات</h1>
          <p className="text-muted-foreground">مراقبة وإدارة طلبات العملاء</p>
        </div>
        <Button variant="outline" asChild className="mt-4 md:mt-0 border-blue-600 text-blue-600 hover:bg-blue-50">
          <Link href="/admin/dashboard">العودة للوحة التحكم</Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>إحصائيات الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">الطلبات المكتملة</p>
              <p className="text-2xl font-bold">{totalDelivered}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">الطلبات قيد المعالجة</p>
              <p className="text-2xl font-bold">{totalProcessing}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold">{totalRevenue} ج.م</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <form onSubmit={handleSearch} className="w-full md:w-auto">
          <div className="relative">
            <Input
              type="search"
              placeholder="ابحث برقم الطلب أو اسم العميل..."
              className="w-full md:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="ghost" size="icon" className="absolute left-0 top-0 h-full">
              <Search className="h-4 w-4" />
              <span className="sr-only">بحث</span>
            </Button>
          </div>
        </form>
      </div>

      <Tabs defaultValue="all" onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">جميع الطلبات</TabsTrigger>
          <TabsTrigger value="processing">قيد المعالجة</TabsTrigger>
          <TabsTrigger value="shipped">تم الشحن</TabsTrigger>
          <TabsTrigger value="delivered">تم التسليم</TabsTrigger>
          <TabsTrigger value="cancelled">ملغية</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <OrdersTable
            orders={filteredOrders}
            getStatusBadge={getStatusBadge}
            getPaymentMethodName={getPaymentMethodName}
            handleStatusChange={handleStatusChange}
          />
        </TabsContent>

        <TabsContent value="processing">
          <OrdersTable
            orders={filteredOrders}
            getStatusBadge={getStatusBadge}
            getPaymentMethodName={getPaymentMethodName}
            handleStatusChange={handleStatusChange}
          />
        </TabsContent>

        <TabsContent value="shipped">
          <OrdersTable
            orders={filteredOrders}
            getStatusBadge={getStatusBadge}
            getPaymentMethodName={getPaymentMethodName}
            handleStatusChange={handleStatusChange}
          />
        </TabsContent>

        <TabsContent value="delivered">
          <OrdersTable
            orders={filteredOrders}
            getStatusBadge={getStatusBadge}
            getPaymentMethodName={getPaymentMethodName}
            handleStatusChange={handleStatusChange}
          />
        </TabsContent>

        <TabsContent value="cancelled">
          <OrdersTable
            orders={filteredOrders}
            getStatusBadge={getStatusBadge}
            getPaymentMethodName={getPaymentMethodName}
            handleStatusChange={handleStatusChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function OrdersTable({
  orders,
  getStatusBadge,
  getPaymentMethodName,
  handleStatusChange,
}: {
  orders: any[]
  getStatusBadge: (status: string) => React.ReactNode
  getPaymentMethodName: (method: string) => string
  handleStatusChange: (orderId: string, status: string) => void
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>رقم الطلب</TableHead>
            <TableHead>العميل</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>المبلغ</TableHead>
            <TableHead>طريقة الدفع</TableHead>
            <TableHead>البائعون</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <Link href={`/admin/users/${order.customer.id}`} className="text-blue-600 hover:underline">
                    {order.customer.name}
                  </Link>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.total} ج.م</TableCell>
                <TableCell>{getPaymentMethodName(order.paymentMethod)}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {order.sellers.map((seller: string, index: number) => (
                      <span key={index}>{seller}</span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        عرض التفاصيل
                      </Link>
                    </Button>

                    {order.status === "processing" && (
                      <Select onValueChange={(value) => handleStatusChange(order.id, value)}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="تغيير الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shipped">تم الشحن</SelectItem>
                          <SelectItem value="cancelled">إلغاء</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                لا توجد طلبات
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

