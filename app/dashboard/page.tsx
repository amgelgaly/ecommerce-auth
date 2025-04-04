"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to admin dashboard
    router.push("/admin/dashboard")
  }, [router])

  return (
    <div className="container py-10 text-center">
      <p>جاري التحويل إلى لوحة التحكم...</p>
    </div>
  )
}

