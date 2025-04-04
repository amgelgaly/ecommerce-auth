"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="container mx-auto py-12 text-center">
      <h1 className="text-2xl font-bold mb-4">Thank you for your order!</h1>
      <p className="mb-4">Your order has been placed successfully.</p>
      {/* Display order details or confirmation number here */}
      <Link href="/products" passHref>
        <Button>Continue Shopping</Button>
      </Link>
    </div>
  );
}
