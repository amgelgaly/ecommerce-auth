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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

const profileSchema = z.object({
  storeName: z.string().min(3, { message: "اسم المتجر يجب أن يكون على الأقل 3 أحرف" }),
  description: z.string().min(20, { message: "وصف المتجر يجب أن يكون على الأقل 20 حرف" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  phone: z.string().min(10, { message: "رقم الهاتف غير صالح" }),
  location: z.string().min(5, { message: "الموقع يجب أن يكون على الأقل 5 أحرف" }),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, { message: "كلمة المرور الحالية يجب أن تكون على الأقل 8 أحرف" }),
    newPassword: z.string().min(8, { message: "كلمة المرور الجديدة يجب أن تكون على الأقل 8 أحرف" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  })

export default function SellerProfilePage() {
  const router = useRouter()
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=200&width=200")
  const [coverImage, setCoverImage] = useState("/placeholder.svg?height=400&width=1200")
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  // Mock seller data - in a real app, this would come from your backend
  const sellerData = {
    id: "s1",
    storeName: "شركة الإلكترونيات",
    description:
      "متخصصون في بيع أحدث الأجهزة الإلكترونية والهواتف الذكية بأفضل الأسعار وجودة عالية. نوفر منتجات أصلية مع ضمان وخدمة ما بعد البيع.",
    email: "info@electronics-company.com",
    phone: "+20 123 456 7890",
    location: "القاهرة، مصر",
  }

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      storeName: sellerData.storeName,
      description: sellerData.description,
      email: sellerData.email,
      phone: sellerData.phone,
      location: sellerData.location,
    },
  })

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onProfileSubmit = (values: z.infer<typeof profileSchema>) => {
    // In a real app, you would send this data to your backend
    console.log({
      ...values,
      profileImage,
      coverImage,
    })

    // Show success message
    toast({
      title: "تم تحديث الملف الشخصي",
      description: "تم تحديث معلومات المتجر بنجاح",
    })
  }

  const onPasswordSubmit = (values: z.infer<typeof passwordSchema>) => {
    // In a real app, you would send this data to your backend
    console.log(values)

    // Show success message
    toast({
      title: "تم تغيير كلمة المرور",
      description: "تم تغيير كلمة المرور بنجاح",
    })

    // Reset form
    passwordForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    // In a real app, you would upload the file to your backend
    // For demo purposes, we'll just create an object URL
    const imageUrl = URL.createObjectURL(file)
    setProfileImage(imageUrl)

    setUploading(false)
    e.target.value = ""
  }

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    // In a real app, you would upload the file to your backend
    // For demo purposes, we'll just create an object URL
    const imageUrl = URL.createObjectURL(file)
    setCoverImage(imageUrl)

    setUploading(false)
    e.target.value = ""
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold">الملف الشخصي</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/seller/dashboard")}
          className="mt-4 md:mt-0 border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          العودة للوحة التحكم
        </Button>
      </div>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList>
          <TabsTrigger value="profile">معلومات المتجر</TabsTrigger>
          <TabsTrigger value="password">تغيير كلمة المرور</TabsTrigger>
        </TabsList>

        {activeTab === "profile" && (
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات المتجر</CardTitle>
                    <CardDescription>قم بتحديث معلومات متجرك التي ستظهر للعملاء</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <FormField
                          control={profileForm.control}
                          name="storeName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>اسم المتجر</FormLabel>
                              <FormControl>
                                <Input placeholder="أدخل اسم المتجر" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>وصف المتجر</FormLabel>
                              <FormControl>
                                <Textarea placeholder="أدخل وصفًا تفصيليًا للمتجر" className="min-h-32" {...field} />
                              </FormControl>
                              <FormDescription>هذا الوصف سيظهر في صفحة المتجر الخاصة بك</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>البريد الإلكتروني</FormLabel>
                                <FormControl>
                                  <Input placeholder="example@domain.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>رقم الهاتف</FormLabel>
                                <FormControl>
                                  <Input placeholder="+20 123 456 7890" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={profileForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>الموقع</FormLabel>
                              <FormControl>
                                <Input placeholder="المدينة، البلد" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                          حفظ التغييرات
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>صور المتجر</CardTitle>
                    <CardDescription>قم بتحديث صورة الملف الشخصي وصورة الغلاف</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <FormLabel>صورة الملف الشخصي</FormLabel>
                      <div className="mt-2 flex flex-col items-center">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border">
                          <img
                            src={profileImage || "/placeholder.svg"}
                            alt="صورة الملف الشخصي"
                            className="w-full h-full object-cover"
                          />
                          <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="h-6 w-6 text-white" />
                            <span className="sr-only">تغيير الصورة</span>
                            <Input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleProfileImageUpload}
                              disabled={uploading}
                            />
                          </label>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">اضغط على الصورة لتغييرها</p>
                      </div>
                    </div>

                    <div>
                      <FormLabel>صورة الغلاف</FormLabel>
                      <div className="mt-2">
                        <div className="relative h-40 rounded-md overflow-hidden border">
                          <img
                            src={coverImage || "/placeholder.svg"}
                            alt="صورة الغلاف"
                            className="w-full h-full object-cover"
                          />
                          <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="h-6 w-6 text-white" />
                            <span className="sr-only">تغيير الصورة</span>
                            <Input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleCoverImageUpload}
                              disabled={uploading}
                            />
                          </label>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          اضغط على الصورة لتغييرها (الحجم الموصى به: 1200×400)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        )}

        {activeTab === "password" && (
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>تغيير كلمة المرور</CardTitle>
                <CardDescription>قم بتغيير كلمة المرور الخاصة بك. يجب أن تكون كلمة المرور قوية وآمنة.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>كلمة المرور الحالية</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>كلمة المرور الجديدة</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormDescription>
                            يجب أن تكون كلمة المرور على الأقل 8 أحرف وتحتوي على أحرف وأرقام
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تأكيد كلمة المرور الجديدة</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      تغيير كلمة المرور
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

