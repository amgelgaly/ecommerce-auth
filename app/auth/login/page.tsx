// app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("الرجاء إدخال بريد إلكتروني صالح"),
  password: z.string().min(1, "الرجاء إدخال كلمة المرور"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(searchParams.get("error")); // Get error from URL
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      const result = await signIn("credentials", {
        redirect: false, // Handle redirect manually based on result
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError("فشل تسجيل الدخول. تأكد من البريد الإلكتروني وكلمة المرور."); // Set generic error
        console.error("SignIn Error:", result.error);
      } else if (result?.ok) {
         // Redirect to intended page or dashboard
         const callbackUrl = searchParams.get("callbackUrl") || "/";
        router.push(callbackUrl);
         router.refresh(); // Refresh server components potentially
      } else {
         setError("حدث خطأ غير متوقع أثناء تسجيل الدخول.");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      setError("حدث خطأ في الشبكة أو الخادم.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription>أدخل بريدك الإلكتروني وكلمة المرور للوصول لحسابك</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>خطأ في تسجيل الدخول</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                       <FormLabel>كلمة المرور</FormLabel>
                       {/* Add Forgot Password Link if needed */}
                       {/* <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                           هل نسيت كلمة المرور؟
                       </Link> */}
                    </div>
                    <FormControl>
                      <Input placeholder="********" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
              {/* Add links for other providers if configured */}
              {/* <Button variant="outline" className="w-full" type="button" onClick={() => signIn('google')}>
                  تسجيل الدخول باستخدام جوجل
              </Button> */}
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            ليس لديك حساب؟{" "}
            <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
              إنشاء حساب جديد
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
