"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Eye, CheckCircle, XCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

// Dummy sellers data
const sellers = [
  {
    id: "s1",
    name: "شركة الإلكترونيات",
    email: "info@electronics-company.com",
    phone: "+20 123 456 7890",
    status: "approved",
    date: "2022-03-15",
    productsCount: 45,
    category: "electronics",
  },
  {
    id: "s2",
    name: "متجر تكنو",
    email: "info@techno-store.com",
    phone: "+20 123 456 7891",
    status: "approved",
    date: "2022-05-20",
    productsCount: 32,
    category: "electronics",
  },
  {
    id: "s3",
    name: "متجر الصوتيات",
    email: "info@audio-store.com",
    phone: "+20 123 456 7892",
    status: "approved",
    date: "2022-04-10",
    productsCount: 28,
    category: "electronics",
  },
  {
    id: "s4",
    name: "بوتيك الموضة",
    email: "info@fashion-boutique.com",
    phone: "+20 123 456 7893",
    status: "approved",
    date: "2021-11-05",
    productsCount: 56,
    category: "fashion",
  },
  {
    id: "s5",
    name: "متجر المنزل",
    email: "info@home-store.com",
    phone: "+20 123 456 7894",
    status: "approved",
    date: "2022-01-18",
    productsCount: 38,
    category: "home",
  },
  {
    id: "s6",
    name: "متجر الأثاث",
    email: "info@furniture-store.com",
    phone: "+20 123 456 7895",
    status: "approved",
    date: "2022-02-22",
    productsCount: 25,
    category: "home",
  },
  {
    id: "s7",
    name: "متجر الرياضة",
    email: "info@sports-store.com",
    phone: "+20 123 456 7896",
    status: "pending",
    date: "2023-06-10",
    productsCount: 0,
    category: "sports",
  },
  {
    id: "s8",
    name: "متجر الهدايا",
    email: "info@gifts-store.com",
    phone: "+20 123 456 7897",
    status: "pending",
    date: "2023-06-08",
    productsCount: 0,
    category: "gifts",
  },
  {
    id: "s9",
    name: "متجر الكتب",
    email: "info@books-store.com",
    phone: "+20 123 456 7898",
    status: "rejected",
    date: "2023-06-07",
    productsCount: 0,
    category: "books",
    reason: "معلومات غير مكتملة، يرجى إكمال ملف الشركة",
  },
  {
    id: "s10",
    name: "متجر الألعاب",
    email: "info@toys-store.com",
    phone: "+20 123 456 7899",
    status: "rejected",
    date: "2023-06-05",
    productsCount: 0,
    category: "kids",
    reason: "المستندات المطلوبة غير متوفرة",
  },
]

export default function AdminSellersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [rejectionReason, setRejectionReason] = useState("")
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would filter sellers based on the search query
    console.log("Searching for:", searchQuery)
  }

  const handleApproveSeller = (id: string) => {
    // In a real app, you would call your API to approve the seller
    console.log("Approving seller:", id)

    // Show success message
    toast({
      title: "تم قبول البائع",
      description: "تم قبول البائع بنجاح",
    })
  }

  const handleRejectSeller = () => {
    if (!selectedSellerId) return

    // In a real app, you would call your API to reject the seller
    console.log("Rejecting seller:", selectedSellerId, "Reason:", rejectionReason)

    // Show success message
    toast({
      title: "تم رفض البائع",
      description: "تم رفض البائع بنجاح",
    })

    // Close dialog and reset state
    setIsRejectDialogOpen(false)
    setRejectionReason("")
    setSelectedSellerId(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">مقبول</span>
      case "pending":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">قيد المراجعة</span>
      case "rejected":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">مرفوض</span>
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">غير معروف</span>
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "electronics":
        return "الإلكترونيات"
      case "fashion":
        return "الموضة"
      case "home":
        return "المنزل"
      case "sports":
        return "الرياضة"
      case "kids":
        return "الأطفال"
      case "gifts":
        return "الهدايا"
      case "books":
        return "الكتب"
      default:
        return category
    }
  }

  // Filter sellers based on selected tab
  const filteredSellers = selectedTab === "all" ? sellers : sellers.filter((seller) => seller.status === selectedTab)

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">إدارة البائعين</h1>
          <p className="text-muted-foreground">مراجعة وإدارة طلبات البائعين</p>
        </div>
        <Button variant="outline" asChild className="mt-4 md:mt-0 border-blue-600 text-blue-600 hover:bg-blue-50">
          <Link href="/admin/dashboard">العودة للوحة التحكم</Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>إحصائيات البائعين</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">إجمالي البائعين</p>
              <p className="text-2xl font-bold">{sellers.length}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">البائعون المعتمدون</p>
              <p className="text-2xl font-bold">{sellers.filter((s) => s.status === "approved").length}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">طلبات الانضمام الجديدة</p>
              <p className="text-2xl font-bold">{sellers.filter((s) => s.status === "pending").length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <form onSubmit={handleSearch} className="w-full md:w-auto">
          <div className="relative">
            <Input
              type="search"
              placeholder="ابحث عن البائعين..."
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
          <TabsTrigger value="all">جميع البائعين</TabsTrigger>
          <TabsTrigger value="pending">طلبات جديدة</TabsTrigger>
          <TabsTrigger value="approved">معتمدون</TabsTrigger>
          <TabsTrigger value="rejected">مرفوضون</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <SellerTable
            sellers={filteredSellers}
            getStatusBadge={getStatusBadge}
            getCategoryName={getCategoryName}
            handleApproveSeller={handleApproveSeller}
            setSelectedSellerId={setSelectedSellerId}
            setIsRejectDialogOpen={setIsRejectDialogOpen}
          />
        </TabsContent>

        <TabsContent value="pending">
          <SellerTable
            sellers={filteredSellers}
            getStatusBadge={getStatusBadge}
            getCategoryName={getCategoryName}
            handleApproveSeller={handleApproveSeller}
            setSelectedSellerId={setSelectedSellerId}
            setIsRejectDialogOpen={setIsRejectDialogOpen}
          />
        </TabsContent>

        <TabsContent value="approved">
          <SellerTable
            sellers={filteredSellers}
            getStatusBadge={getStatusBadge}
            getCategoryName={getCategoryName}
            handleApproveSeller={handleApproveSeller}
            setSelectedSellerId={setSelectedSellerId}
            setIsRejectDialogOpen={setIsRejectDialogOpen}
          />
        </TabsContent>

        <TabsContent value="rejected">
          <SellerTable
            sellers={filteredSellers}
            getStatusBadge={getStatusBadge}
            getCategoryName={getCategoryName}
            handleApproveSeller={handleApproveSeller}
            setSelectedSellerId={setSelectedSellerId}
            setIsRejectDialogOpen={setIsRejectDialogOpen}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>رفض البائع</DialogTitle>
            <DialogDescription>يرجى إدخال سبب رفض البائع ليتمكن من معرفة السبب وتصحيح المشكلة.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                سبب الرفض
              </label>
              <textarea
                id="reason"
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="أدخل سبب رفض البائع..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleRejectSeller} disabled={!rejectionReason.trim()}>
              رفض
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SellerTable({
  sellers,
  getStatusBadge,
  getCategoryName,
  handleApproveSeller,
  setSelectedSellerId,
  setIsRejectDialogOpen,
}: {
  sellers: any[]
  getStatusBadge: (status: string) => React.ReactNode
  getCategoryName: (category: string) => string
  handleApproveSeller: (id: string) => void
  setSelectedSellerId: (id: string) => void
  setIsRejectDialogOpen: (open: boolean) => void
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>اسم المتجر</TableHead>
            <TableHead>البريد الإلكتروني</TableHead>
            <TableHead>رقم الهاتف</TableHead>
            <TableHead>الفئة</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>تاريخ الانضمام</TableHead>
            <TableHead className="text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sellers.length > 0 ? (
            sellers.map((seller) => (
              <TableRow key={seller.id}>
                <TableCell className="font-medium">{seller.name}</TableCell>
                <TableCell>{seller.email}</TableCell>
                <TableCell>{seller.phone}</TableCell>
                <TableCell>{getCategoryName(seller.category)}</TableCell>
                <TableCell>{getStatusBadge(seller.status)}</TableCell>
                <TableCell>{seller.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/sellers/${seller.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">عرض</span>
                      </Link>
                    </Button>

                    {seller.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleApproveSeller(seller.id)}
                          className="text-green-600"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="sr-only">قبول</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedSellerId(seller.id)
                            setIsRejectDialogOpen(true)
                          }}
                          className="text-red-600"
                        >
                          <XCircle className="h-4 w-4" />
                          <span className="sr-only">رفض</span>
                        </Button>
                      </>
                    )}

                    {seller.status === "rejected" && seller.reason && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            سبب الرفض
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>سبب رفض البائع</DialogTitle>
                          </DialogHeader>
                          <p>{seller.reason}</p>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                لا يوجد بائعين
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

