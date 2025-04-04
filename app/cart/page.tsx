// app/cart/page.tsx
"use client";

import { useCart } from "@/context/cart-context";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CartPage() {
  const { cart, cartCount, clearCart, updateCartItemQuantity } = useCart();
  const { data: session, status } = useSession();

  // Calculate totals
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.productDetails!.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="container py-8 text-center">
        <p className="text-lg">سلة التسوق فارغة.</p>
        <Link href="/products" className="mt-4 inline-block text-blue-500 hover:underline">
          تسوق الآن
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">سلة التسوق</h1>

      {cart.map((item) => (
        <div key={item.productId} className="flex items-center justify-between border-b py-4">
          <div className="flex items-center space-x-4">
            {/* Product Image (Placeholder) */}
            {/* <img src={item.productDetails?.image || '/placeholder.svg'} alt={item.productDetails?.name} className="w-16 h-16 object-cover rounded" /> */}
            {item.productDetails && <ProductCard product={item.productDetails as any} />}
            <div>
              <p className="font-medium">{item.productDetails?.name}</p>
              <p className="text-gray-500">${item.productDetails?.price.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              -
            </Button>
            <span>{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              +
            </Button>
          </div>
        </div>
      ))}

      <div className="mt-6 flex justify-between items-center">
        <p className="text-lg font-semibold">المجموع: ${totalPrice.toFixed(2)}</p>
        <Button onClick={clearCart}>إفراغ السلة</Button>
      </div>

      {/* Checkout Button (Conditionally render based on authentication) */}
      {status === "authenticated" && session?.user ? (
        <Link href="/checkout">
          <Button className="mt-6 w-full bg-green-600 hover:bg-green-700">
            إتمام عملية الشراء
          </Button>
        </Link>
      ) : (
        <Link href="/auth/login?callbackUrl=/checkout">
          <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700">
            تسجيل الدخول لإتمام عملية الشراء
          </Button>
        </Link>
      )}
    </div>
  );
}
