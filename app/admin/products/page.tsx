"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Eye, CheckCircle, XCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

// Dummy products data
const products = [
  {
    id: "1",
    name: "هاتف ذكي جديد",
    price: 2500,
    category: "electronics",
    status: "approved",
    date: "2023-06-10",
    seller: {
      id: "s1",
      name: "شركة الإلكترونيات",
    },
  },
  {
    id: "2",
    name: "لابتوب احترافي",
    price: 5000,
    category: "electronics",
    status: "approved",
    date: "2023-06-08",
    seller: {
      id: "s2",
      name: "متجر تكنو",
    },
  },
  {
    id: "3",
    name: "سماعات لاسلكية",
    price: 350,
    category: "electronics",
    status: "pending",
    date: "2023-06-15",
    seller: {
      id: "s3",
      name: "متجر الصوتيات",
    },
  },
  {
    id: "4",
    name: "ساعة ذكية",
    price: 1200,
    category: "electronics",
    status: "rejected",
    date: "2023-06-14",
    reason: "الصور غير واضحة، يرجى إعادة الرفع بصور أوضح",
    seller: {
      id: "s1",
      name: "شركة الإلكترونيات",
    },
  },
  {
    id: "5",
    name: "حقيبة يد فاخرة",
    price: 850,
    category: "fashion",
    status: "pending",
    date: "2023-06-16",
    seller: {
      id: "s4",
      name: "بوتيك الموضة",
    },
  },
  {
    id: "6",
    name: "طقم أواني مطبخ",
    price: 650,
    category: "home",
    status: "pending",
    date: "2023-06-17",
    seller: {
      id: "s5",
      name: "متجر المنزل",
    },
  },
  {
    id: "7",
    name: "طاولة قهوة عصرية",
    price: 750,
    category: "home",
    status: "approved",
    date: "2023-06-09",
    seller: {
      id: "s6",
      name: "متجر الأثاث",
    },
  },
  {
    id: "8",
    name: "لابتوب خفيف",
    price: 3500,
    category: "electronics",
    status: "pending",
    date: "2023-06-18",
    seller: {
      id: "s2",
      name: "متجر تكنو",
    },
  },
]

export default function AdminProductsPage() {
  const searchParams = useSearchParams()
  const statusParam = searchParams.get("status")

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState(statusParam || "all")
  const [rejectionReason, setRejectionReason] = useState("")
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would filter products based on the search query
    console.log("Searching for:", searchQuery)
  }

  const handleApproveProduct = (id: string) => {
    // In a real app, you would call your API to approve the product
    console.log("Approving product:", id)

    // Show success message
    toast({
      title: "تم قبول المنتج",
      description: "تم قبول المنتج بنجاح",
    })
  }

  const handleRejectProduct = () => {
    if (!selectedProductId) return

    // In a real app, you would call your API to reject the product
    console.log("Rejecting product:", selectedProductId, "Reason:", rejectionReason)

    // Show success message
    toast({
      title: "تم رفض المنتج",
      description: "تم رفض المنتج بنجاح",
    })

    // Close dialog and reset state
    setIsRejectDialogOpen(false)
    setRejectionReason("")
    setSelectedProductId(null)
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
      default:
        return category
    }
  }

  // Filter products based on selected tab
  const filteredProducts =
    selectedTab === "all" ? products : products.filter((product) => product.status === selectedTab)

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
          <p className="text-muted-foreground">مراجعة وإدارة منتجات البائعين</p>
        </div>
        <Button variant="outline" asChild className="mt-4 md:mt-0 border-blue-600 text-blue-600 hover:bg-blue-50">
          <Link href="/admin/dashboard">العودة للوحة التحكم</Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>إحصائيات المنتجات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">إجمالي المنتجات</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">المنتجات المقبولة</p>
              <p className="text-2xl font-bold">{products.filter((p) => p.status === "approved").length}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">المنتجات قيد المراجعة</p>
              <p className="text-2xl font-bold">{products.filter((p) => p.status === "pending").length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <form onSubmit={handleSearch} className="w-full md:w-auto">
          <div className="relative">
            <Input
              type="search"
              placeholder="ابحث عن المنتجات..."
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

        <Select defaultValue={selectedTab} onValueChange={(value) => setSelectedTab(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="تصفية حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المنتجات</SelectItem>
            <SelectItem value="pending">قيد المراجعة</SelectItem>
            <SelectItem value="approved">مقبولة</SelectItem>
            <SelectItem value="rejected">مرفوضة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم المنتج</TableHead>
              <TableHead>البائع</TableHead>
              <TableHead>الفئة</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead className="text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Link href={`/sellers/${product.seller.id}`} className="text-blue-600 hover:underline">
                      {product.seller.name}
                    </Link>
                  </TableCell>
                  <TableCell>{getCategoryName(product.category)}</TableCell>
                  <TableCell>{product.price} ج.م</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>{product.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/products/${product.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">عرض</span>
                        </Link>
                      </Button>

                      {product.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApproveProduct(product.id)}
                            className="text-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">قبول</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedProductId(product.id)
                              setIsRejectDialogOpen(true)
                            }}
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4" />
                            <span className="sr-only">رفض</span>
                          </Button>
                        </>
                      )}

                      {product.status === "rejected" && product.reason && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              سبب الرفض
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>سبب رفض المنتج</DialogTitle>
                            </DialogHeader>
                            <p>{product.reason}</p>
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
                  لا توجد منتجات
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>رفض المنتج</DialogTitle>
            <DialogDescription>
              يرجى إدخال سبب رفض المنتج ليتمكن البائع من معرفة السبب وتصحيح المشكلة.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                سبب الرفض
              </label>
              <textarea
                id="reason"
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="أدخل سبب رفض المنتج..."
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
            <Button variant="destructive" onClick={handleRejectProduct} disabled={!rejectionReason.trim()}>
              رفض
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

