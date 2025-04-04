"use client";

import React from 'react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface CartItemWithPrice {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export default function ReviewOrderPage() {
  const { cart } = useCart();
  const [cartItemsWithPrice, setCartItemsWithPrice] = useState<CartItemWithPrice[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!cart || cart.length === 0) {
        setCartItemsWithPrice([]);
        setTotal(0);
        return;
      }

      const itemsWithPrice: CartItemWithPrice[] = await Promise.all(
        cart.map(async (item) => {
          try {
            const response = await fetch(`/api/products/${item.productId}`);
            if (!response.ok) {
              console.error(`Failed to fetch product ${item.productId}`);
              return { ...item, price: 0, name: 'Product Not Found' } as CartItemWithPrice; // Or handle the error appropriately
            }
            const product = await response.json();
            return { ...item, price: product.price, name: product.name } as CartItemWithPrice;
          } catch (error) {
            console.error(`Error fetching product ${item.productId}:`, error);
            return { ...item, price: 0, name: 'Product Not Found' } as CartItemWithPrice; // Or handle the error appropriately
          }
        })
      );
      setCartItemsWithPrice(itemsWithPrice);
    };

    fetchProductDetails();
  }, [cart]);

  useEffect(() => {
    const newTotal = cartItemsWithPrice.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, [cartItemsWithPrice]);

  // TODO: Fetch shipping and payment details from context or state

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="mb-4">Browse our products and add items to your cart.</p>
        <Link href="/products" passHref>
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Review Your Order</h1>
      {/* Display cart items, shipping, and payment details here */}
      <div>
        {cartItemsWithPrice.map((item) => (
          <div key={item.productId} className="flex items-center justify-between py-2 border-b">
            <span>{item.name} x {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-right">
        <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
        {/* Display shipping and payment details */}
        <Button>Place Order</Button>
      </div>
      <Link href="/checkout/payment" passHref>
        <Button variant="link" className="mt-4">Back to Payment</Button>
      </Link>
    </div>
  );
}