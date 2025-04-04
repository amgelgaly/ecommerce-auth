"use client"

import type React from "react"

import { useState } from "react"
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

export default function AddProductPage() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      category: "",
      stock: undefined,
    },
  })

  const onSubmit = (values: z.infer<typeof productSchema>) => {
    if (images.length === 0) {
      toast({
        title: "خطأ في إضافة المنتج",
        description: "يرجى إضافة صورة واحدة على الأقل للمنتج",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Here you would normally call your API to add the product
    console.log({ ...values, images })

    // Simulate API call
    setTimeout(() => {
      // Show success message
      toast({
        title: "تم إرسال المنتج للمراجعة",
        description: "سيتم مراجعة المنتج من قبل الإدارة قبل نشره",
      })

      // Redirect to products page
      router.push("/seller/products")

      setIsSubmitting(false)
    }, 1500)
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

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">إضافة منتج جديد</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات المنتج</CardTitle>
          <CardDescription>
            أدخل معلومات المنتج الذي ترغب في إضافته. سيتم مراجعة المنتج من قبل الإدارة قبل نشره.
          </CardDescription>
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
                      disabled={uploading || isSubmitting}
                    />
                  </label>
                </div>
                <FormDescription className="mt-2">
                  يمكنك إضافة حتى 5 صور للمنتج. الصورة الأولى ستكون الصورة الرئيسية.
                </FormDescription>
                {images.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">يجب إضافة صورة واحدة على الأقل للمنتج</p>
                )}
              </div>

              <div className="mt-6">
                <Button type="submit" disabled={uploading || isSubmitting}>
                  {isSubmitting ? "إرسال..." : "إضافة المنتج"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

