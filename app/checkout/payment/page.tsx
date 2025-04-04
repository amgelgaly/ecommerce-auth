"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

export default function PaymentPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    // TODO: Implement payment processing logic
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Payment Information</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input id="cardNumber" {...register("cardNumber", { required: true })} />
          {errors.cardNumber && <p className="text-red-500">Card number is required</p>}
        </div>
        <div>
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input id="expiryDate" {...register("expiryDate", { required: true })} />
          {errors.expiryDate && <p className="text-red-500">Expiry date is required</p>}
        </div>
        <div>
          <Label htmlFor="cvv">CVV</Label>
          <Input id="cvv" {...register("cvv", { required: true })} />
          {errors.cvv && <p className="text-red-500">CVV is required</p>}
        </div>
        <Button type="submit">Review Order</Button>
      </form>
      <Link href="/checkout/shipping" passHref>
        <Button variant="link" className="mt-4">Back to Shipping</Button>
      </Link>
    </div>
  );
}