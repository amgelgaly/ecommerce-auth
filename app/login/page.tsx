"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const loginSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  password: z.string().min(8, { message: "كلمة المرور يجب أن تكون على الأقل 8 أحرف" }),
})

const registerSchema = z
  .object({
    name: z.string().min(3, { message: "الاسم يجب أن يكون على الأقل 3 أحرف" }),
    email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
    password: z.string().min(8, { message: "كلمة المرور يجب أن تكون على الأقل 8 أحرف" }),
    confirmPassword: z.string(),
    role: z.enum(["customer", "seller"], { message: "يرجى اختيار نوع الحساب" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  })

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("login")

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "customer",
    },
  })

  function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    // Here you would normally call your authentication API
    console.log(values)
    // For demo purposes, we'll just redirect to home
    router.push("/")
  }

  function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    // Here you would normally call your registration API
    console.log(values)
    // For demo purposes, we'll just redirect to home
    router.push("/")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {activeTab === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {activeTab === "login"
              ? "أدخل بريدك الإلكتروني وكلمة المرور للدخول إلى حسابك"
              : "أدخل المعلومات التالية لإنشاء حساب جديد"}
          </p>
        </div>
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
            <TabsTrigger value="register">حساب جديد</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  تسجيل الدخول
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              <Link href="/forgot-password" className="text-primary hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>
          </TabsContent>
          <TabsContent value="register" className="mt-4">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم</FormLabel>
                      <FormControl>
                        <Input placeholder="الاسم الكامل" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تأكيد كلمة المرور</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع الحساب</FormLabel>
                      <FormControl>
                        <div className="flex gap-4">
                          <Button
                            type="button"
                            variant={field.value === "customer" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => field.onChange("customer")}
                          >
                            عميل
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "seller" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => field.onChange("seller")}
                          >
                            بائع
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  إنشاء حساب
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

