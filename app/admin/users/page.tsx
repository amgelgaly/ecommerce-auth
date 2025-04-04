"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Eye, UserX } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

// Dummy users data
const users = [
  {
    id: "u1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+20 123 456 7890",
    role: "customer",
    status: "active",
    date: "2022-03-15",
    ordersCount: 12,
    totalSpent: 15600,
  },
  {
    id: "u2",
    name: "سارة خالد",
    email: "sara@example.com",
    phone: "+20 123 456 7891",
    role: "customer",
    status: "active",
    date: "2022-05-20",
    ordersCount: 8,
    totalSpent: 9200,
  },
  {
    id: "u3",
    name: "محمد علي",
    email: "mohamed@example.com",
    phone: "+20 123 456 7892",
    role: "customer",
    status: "active",
    date: "2022-04-10",
    ordersCount: 5,
    totalSpent: 6500,
  },
  {
    id: "u4",
    name: "فاطمة أحمد",
    email: "fatma@example.com",
    phone: "+20 123 456 7893",
    role: "customer",
    status: "inactive",
    date: "2021-11-05",
    ordersCount: 3,
    totalSpent: 3200,
  },
  {
    id: "u5",
    name: "خالد محمود",
    email: "khaled@example.com",
    phone: "+20 123 456 7894",
    role: "customer",
    status: "active",
    date: "2022-01-18",
    ordersCount: 7,
    totalSpent: 8100,
  },
  {
    id: "u6",
    name: "نورا سامي",
    email: "noura@example.com",
    phone: "+20 123 456 7895",
    role: "customer",
    status: "active",
    date: "2022-02-22",
    ordersCount: 4,
    totalSpent: 5400,
  },
  {
    id: "s1",
    name: "شركة الإلكترونيات",
    email: "info@electronics-company.com",
    phone: "+20 123 456 7896",
    role: "seller",
    status: "active",
    date: "2022-03-15",
    productsCount: 45,
    totalSales: 125000,
  },
  {
    id: "s2",
    name: "متجر تكنو",
    email: "info@techno-store.com",
    phone: "+20 123 456 7897",
    role: "seller",
    status: "active",
    date: "2022-05-20",
    productsCount: 32,
    totalSales: 98000,
  },
  {
    id: "a1",
    name: "المدير العام",
    email: "admin@marteagle.com",
    phone: "+20 123 456 7898",
    role: "admin",
    status: "active",
    date: "2022-01-01",
  },
]

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would filter users based on the search query
    console.log("Searching for:", searchQuery)
  }

  const handleBlockUser = () => {
    if (!selectedUserId) return

    // In a real app, you would call your API to block the user
    console.log("Blocking user:", selectedUserId)

    // Show success message
    toast({
      title: "تم حظر المستخدم",
      description: "تم حظر المستخدم بنجاح",
    })

    // Close dialog and reset state
    setIsBlockDialogOpen(false)
    setSelectedUserId(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">نشط</span>
      case "inactive":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">غير نشط</span>
      case "blocked":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">محظور</span>
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">غير معروف</span>
    }
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case "customer":
        return "عميل"
      case "seller":
        return "بائع"
      case "admin":
        return "مدير"
      default:
        return role
    }
  }

  // Filter users based on selected tab
  const filteredUsers = selectedTab === "all" ? users : users.filter((user) => user.role === selectedTab)

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
          <p className="text-muted-foreground">إدارة العملاء والبائعين والمديرين</p>
        </div>
        <Button variant="outline" asChild className="mt-4 md:mt-0 border-blue-600 text-blue-600 hover:bg-blue-50">
          <Link href="/admin/dashboard">العودة للوحة التحكم</Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>إحصائيات المستخدمين</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">إجمالي المستخدمين</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">العملاء</p>
              <p className="text-2xl font-bold">{users.filter((u) => u.role === "customer").length}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">البائعون</p>
              <p className="text-2xl font-bold">{users.filter((u) => u.role === "seller").length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <form onSubmit={handleSearch} className="w-full md:w-auto">
          <div className="relative">
            <Input
              type="search"
              placeholder="ابحث عن المستخدمين..."
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
          <TabsTrigger value="all">جميع المستخدمين</TabsTrigger>
          <TabsTrigger value="customer">العملاء</TabsTrigger>
          <TabsTrigger value="seller">البائعون</TabsTrigger>
          <TabsTrigger value="admin">المديرون</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <UsersTable
            users={filteredUsers}
            getStatusBadge={getStatusBadge}
            getRoleName={getRoleName}
            setSelectedUserId={setSelectedUserId}
            setIsBlockDialogOpen={setIsBlockDialogOpen}
          />
        </TabsContent>

        <TabsContent value="customer">
          <UsersTable
            users={filteredUsers}
            getStatusBadge={getStatusBadge}
            getRoleName={getRoleName}
            setSelectedUserId={setSelectedUserId}
            setIsBlockDialogOpen={setIsBlockDialogOpen}
          />
        </TabsContent>

        <TabsContent value="seller">
          <UsersTable
            users={filteredUsers}
            getStatusBadge={getStatusBadge}
            getRoleName={getRoleName}
            setSelectedUserId={setSelectedUserId}
            setIsBlockDialogOpen={setIsBlockDialogOpen}
          />
        </TabsContent>

        <TabsContent value="admin">
          <UsersTable
            users={filteredUsers}
            getStatusBadge={getStatusBadge}
            getRoleName={getRoleName}
            setSelectedUserId={setSelectedUserId}
            setIsBlockDialogOpen={setIsBlockDialogOpen}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حظر المستخدم</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حظر هذا المستخدم؟ لن يتمكن من الوصول إلى حسابه بعد الحظر.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBlockDialogOpen(false)}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleBlockUser}>
              حظر
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function UsersTable({
  users,
  getStatusBadge,
  getRoleName,
  setSelectedUserId,
  setIsBlockDialogOpen,
}: {
  users: any[]
  getStatusBadge: (status: string) => React.ReactNode
  getRoleName: (role: string) => string
  setSelectedUserId: (id: string) => void
  setIsBlockDialogOpen: (open: boolean) => void
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>البريد الإلكتروني</TableHead>
            <TableHead>رقم الهاتف</TableHead>
            <TableHead>الدور</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>تاريخ التسجيل</TableHead>
            <TableHead className="text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{getRoleName(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{user.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={user.role === "seller" ? `/sellers/${user.id}` : `/admin/users/${user.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">عرض</span>
                      </Link>
                    </Button>

                    {user.role !== "admin" && user.status !== "blocked" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedUserId(user.id)
                          setIsBlockDialogOpen(true)
                        }}
                        className="text-red-600"
                      >
                        <UserX className="h-4 w-4" />
                        <span className="sr-only">حظر</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                لا يوجد مستخدمين
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

