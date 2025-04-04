"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Bell, Trash2, Send } from "lucide-react"

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [audience, setAudience] = useState("all")

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "عرض خاص",
      message: "خصم 20% على جميع المنتجات الإلكترونية",
      audience: "all",
      date: "2023-06-15",
      status: "active",
    },
    {
      id: 2,
      title: "منتج جديد",
      message: "تم إضافة هاتف ذكي جديد إلى المتجر",
      audience: "customers",
      date: "2023-06-14",
      status: "active",
    },
    {
      id: 3,
      title: "تحديث الشحن",
      message: "تم تحديث سياسة الشحن الخاصة بنا",
      audience: "sellers",
      date: "2023-06-13",
      status: "inactive",
    },
    {
      id: 4,
      title: "عطلة رسمية",
      message: "المتجر سيكون مغلقًا يوم الجمعة القادم بمناسبة العطلة الرسمية",
      audience: "all",
      date: "2023-06-12",
      status: "active",
    },
  ])

  const handleSendNotification = () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    // Add new notification
    const newNotification = {
      id: Date.now(),
      title,
      message,
      audience,
      date: new Date().toISOString().split("T")[0],
      status: "active",
    }

    setNotifications([newNotification, ...notifications])

    // Reset form
    setTitle("")
    setMessage("")
    setAudience("all")

    // Show success message
    toast({
      title: "تم إرسال الإشعار",
      description: "تم إرسال الإشعار بنجاح إلى المستخدمين المحددين",
    })
  }

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))

    toast({
      title: "تم حذف الإشعار",
      description: "تم حذف الإشعار بنجاح",
    })
  }

  const getAudienceName = (audience: string) => {
    switch (audience) {
      case "all":
        return "جميع المستخدمين"
      case "customers":
        return "العملاء فقط"
      case "sellers":
        return "البائعين فقط"
      default:
        return audience
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">إدارة الإشعارات</h1>
          <p className="text-muted-foreground">إرسال وإدارة الإشعارات للمستخدمين</p>
        </div>
        <Button variant="outline" asChild className="mt-4 md:mt-0 border-blue-600 text-blue-600 hover:bg-blue-50">
          <Link href="/admin/dashboard">العودة للوحة التحكم</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                إرسال إشعار جديد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  عنوان الإشعار
                </label>
                <Input
                  id="title"
                  placeholder="أدخل عنوان الإشعار"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  نص الإشعار
                </label>
                <Textarea
                  id="message"
                  placeholder="أدخل نص الإشعار"
                  className="min-h-[100px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="audience" className="text-sm font-medium">
                  الجمهور المستهدف
                </label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger id="audience">
                    <SelectValue placeholder="اختر الجمهور المستهدف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المستخدمين</SelectItem>
                    <SelectItem value="customers">العملاء فقط</SelectItem>
                    <SelectItem value="sellers">البائعين فقط</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4" onClick={handleSendNotification}>
                <Send className="h-4 w-4 mr-2" />
                إرسال الإشعار
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>الإشعارات السابقة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العنوان</TableHead>
                      <TableHead>الرسالة</TableHead>
                      <TableHead>الجمهور</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="text-left">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <TableRow key={notification.id}>
                          <TableCell className="font-medium">{notification.title}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{notification.message}</TableCell>
                          <TableCell>{getAudienceName(notification.audience)}</TableCell>
                          <TableCell>{notification.date}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                notification.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {notification.status === "active" ? "نشط" : "غير نشط"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">حذف</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          لا توجد إشعارات
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

