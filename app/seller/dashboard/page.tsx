// app/seller/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function SellerDashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated" || (session?.user as any)?.role !== "seller") {
    redirect("/"); // Redirect to home or login
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>
      {/* Add seller dashboard content here */}
    </div>
  );
}
