"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, Eye, AlertTriangle } from "lucide-react"
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

// Dummy products data
const products = [
  {
    id: "1",
    name: "هاتف ذكي جديد",
    price: 2500,
    category: "electronics",
    status: "approved",
    date: "2023-06-10",
    stock: 50,
    sales: 12,
  },
  {
    id: "2",
    name: "لابتوب احترافي",
    price: 5000,
    category: "electronics",
    status: "approved",
    date: "2023-06-08",
    stock: 20,
    sales: 5,
  },
  {
    id: "3",
    name: "سماعات لاسلكية",
    price: 350,
    category: "electronics",
    status: "pending",
    date: "2023-06-15",
    stock: 100,
    sales: 0,
  },
  {
    id: "4",
    name: "ساعة ذكية",
    price: 1200,
    category: "electronics",
    status: "rejected",
    date: "2023-06-14",
    reason: "الصور غير واضحة، يرجى إعادة الرفع بصور أوضح",
    stock: 0,
    sales: 0,
  },
]

export default function SellerProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would filter products based on the search query
    console.log("Searching for:", searchQuery)
  }

  const handleDeleteProduct = (id: string) => {
    // In a real app, you would call your API to delete the product
    console.log("Deleting product:", id)

    // Show success message
    toast({
      title: "تم حذف المنتج",
      description: "تم حذف المنتج بنجاح",
    })

    // Close dialog
    setIsDeleteDialogOpen(false)
    setDeleteProductId(null)
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

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
        <Button asChild className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700">
          <Link href="/seller/products/add">إضافة منتج جديد</Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>إحصائيات المنتجات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">إجمالي المبيعات</p>
              <p className="text-2xl font-bold">{products.reduce((total, product) => total + product.sales, 0)}</p>
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
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">جميع المنتجات</TabsTrigger>
          <TabsTrigger value="approved">المقبولة</TabsTrigger>
          <TabsTrigger value="pending">قيد المراجعة</TabsTrigger>
          <TabsTrigger value="rejected">المرفوضة</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ProductsTable
            products={products}
            getStatusBadge={getStatusBadge}
            getCategoryName={getCategoryName}
            setDeleteProductId={setDeleteProductId}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          />
        </TabsContent>

        <TabsContent value="approved">
          <ProductsTable
            products={products.filter((p) => p.status === "approved")}
            getStatusBadge={getStatusBadge}
            getCategoryName={getCategoryName}
            setDeleteProductId={setDeleteProductId}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          />
        </TabsContent>

        <TabsContent value="pending">
          <ProductsTable
            products={products.filter((p) => p.status === "pending")}
            getStatusBadge={getStatusBadge}
            getCategoryName={getCategoryName}
            setDeleteProductId={setDeleteProductId}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          />
        </TabsContent>

        <TabsContent value="rejected">
          <ProductsTable
            products={products.filter((p) => p.status === "rejected")}
            getStatusBadge={getStatusBadge}
            getCategoryName={getCategoryName}
            setDeleteProductId={setDeleteProductId}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف المنتج</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={() => deleteProductId && handleDeleteProduct(deleteProductId)}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ProductsTable({
  products,
  getStatusBadge,
  getCategoryName,
  setDeleteProductId,
  setIsDeleteDialogOpen,
}: {
  products: any[]
  getStatusBadge: (status: string) => React.ReactNode
  getCategoryName: (category: string) => string
  setDeleteProductId: (id: string) => void
  setIsDeleteDialogOpen: (open: boolean) => void
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>اسم المنتج</TableHead>
            <TableHead>الفئة</TableHead>
            <TableHead>السعر</TableHead>
            <TableHead>المخزون</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead className="text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{getCategoryName(product.category)}</TableCell>
                <TableCell>{product.price} ج.م</TableCell>
                <TableCell>{product.stock}</TableCell>
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
                    <Button variant="ghost" size="icon" asChild disabled={product.status === "pending"}>
                      <Link href={`/seller/products/edit/${product.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">تعديل</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeleteProductId(product.id)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">حذف</span>
                    </Button>

                    {product.status === "rejected" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <span className="sr-only">سبب الرفض</span>
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
  )
}

