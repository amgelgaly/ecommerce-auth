"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

const productSchema = z.object({
  name: z.string().min(3, { message: "اسم المنتج يجب أن يكون على الأقل 3 أحرف" }),
  description: z.string().min(10, { message: "وصف المنتج يجب أن يكون على الأقل 10 أحرف" }),
  price: z.coerce.number().positive({ message: "السعر يجب أن يكون رقمًا موجبًا" }),
  category: z.string({ required_error: "يرجى اختيار فئة" }),
  stock: z.coerce.number().int().positive({ message: "الكمية يجب أن تكون رقمًا صحيحًا موجبًا" }),
})

// Mock products data
const products = {
  "1": {
    id: "1",
    name: "هاتف ذكي جديد",
    description:
      "هاتف ذكي متطور بمواصفات عالية وأداء ممتاز. يأتي بشاشة AMOLED مقاس 6.5 بوصة، وكاميرا بدقة 108 ميجابيكسل، ومعالج ثماني النواة، وبطارية 5000 مللي أمبير. مثالي للاستخدام اليومي والألعاب.",
    price: 2500,
    category: "electronics",
    stock: 50,
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
  },
  "2": {
    id: "2",
    name: "لابتوب احترافي",
    description:
      "لابتوب للألعاب والتصميم بمواصفات عالية وأداء ممتاز. يأتي بشاشة 15.6 بوصة، ومعالج قوي، وذاكرة وصول عشوائي 16 جيجابايت، وبطاقة رسومات متطورة.",
    price: 5000,
    category: "electronics",
    stock: 20,
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
  },
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const productId = params.id
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Get product data
  const product = products[productId as keyof typeof products]

  useEffect(() => {
    if (product) {
      setImages(product.images || [])
      setIsLoading(false)
    } else {
      // Product not found, redirect to products page
      toast({
        title: "المنتج غير موجود",
        description: "لم يتم العثور على المنتج المطلوب",
        variant: "destructive",
      })
      router.push("/seller/products")
    }
  }, [product, router])

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price,
      category: product?.category || "",
      stock: product?.stock,
    },
  })

  const onSubmit = (values: z.infer<typeof productSchema>) => {
    // Here you would normally call your API to update the product
    console.log({ ...values, images, id: productId })

    // Show success message
    toast({
      title: "تم تحديث المنتج",
      description: "تم تحديث المنتج بنجاح",
    })

    // Redirect to products page
    router.push("/seller/products")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    // In a real app, you would upload the files to a server
    // For demo purposes, we'll just create object URLs
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
    setImages([...images, ...newImages])

    setUploading(false)
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  if (isLoading) {
    return (
      <div className="container py-10 text-center">
        <p>جاري تحميل بيانات المنتج...</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">تعديل المنتج</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات المنتج</CardTitle>
          <CardDescription>قم بتعديل معلومات المنتج. سيتم مراجعة التعديلات من قبل الإدارة قبل نشرها.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المنتج</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل اسم المنتج" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الفئة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر فئة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="electronics">الإلكترونيات</SelectItem>
                          <SelectItem value="fashion">الموضة</SelectItem>
                          <SelectItem value="home">المنزل</SelectItem>
                          <SelectItem value="sports">الرياضة</SelectItem>
                          <SelectItem value="kids">الأطفال</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>السعر (ج.م)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="أدخل السعر" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الكمية المتوفرة</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="أدخل الكمية" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وصف المنتج</FormLabel>
                    <FormControl>
                      <Textarea placeholder="أدخل وصفًا تفصيليًا للمنتج" className="min-h-32" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>صور المنتج</FormLabel>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden border h-40">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`صورة المنتج ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <label className="flex flex-col items-center justify-center h-40 border border-dashed rounded-md cursor-pointer hover:bg-muted/50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">اضغط لإضافة صور</p>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
                <FormDescription className="mt-2">
                  يمكنك إضافة حتى 5 صور للمنتج. الصورة الأولى ستكون الصورة الرئيسية.
                </FormDescription>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  إلغاء
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  حفظ التغييرات
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

