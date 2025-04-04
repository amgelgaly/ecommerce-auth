"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"

export default function TrackOrderPage() {
  const router = useRouter()
  const [orderId, setOrderId] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderId.trim()) {
      setError("يرجى إدخال رقم الطلب")
      return
    }

    // Redirect to the order tracking page
    router.push(`/track-order/${orderId}`)
  }

  return (
    <div className="container py-10">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">تتبع الطلب</CardTitle>
            <CardDescription>أدخل رقم الطلب الخاص بك لمعرفة حالة الشحن</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="order-id" className="text-sm font-medium">
                    رقم الطلب
                  </label>
                  <Input
                    id="order-id"
                    placeholder="مثال: 123456"
                    value={orderId}
                    onChange={(e) => {
                      setOrderId(e.target.value)
                      setError("")
                    }}
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  تتبع الطلب
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            <p>يمكنك العثور على رقم الطلب في رسالة تأكيد الطلب المرسلة إلى بريدك الإلكتروني</p>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">للتجربة، يمكنك استخدام رقم الطلب التالي:</p>
          <Button
            variant="outline"
            onClick={() => setOrderId("123456")}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            123456
          </Button>
        </div>
      </div>
    </div>
  )
}

