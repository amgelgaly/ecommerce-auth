"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

export default function ShippingPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    // TODO: Implement shipping logic
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Shipping Information</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" {...register("name", { required: true })} />
          {errors.name && <p className="text-red-500">Name is required</p>}
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" {...register("address", { required: true })} />
          {errors.address && <p className="text-red-500">Address is required</p>}
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city", { required: true })} />
          {errors.city && <p className="text-red-500">City is required</p>}
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" {...register("state", { required: true })} />
          {errors.state && <p className="text-red-500">State is required</p>}
        </div>
        <div>
          <Label htmlFor="zip">Zip Code</Label>
          <Input id="zip" {...register("zip", { required: true })} />
          {errors.zip && <p className="text-red-500">Zip code is required</p>}
        </div>
        <Button type="submit">Continue to Payment</Button>
      </form>
      <Link href="/checkout" passHref>
        <Button variant="link" className="mt-4">Back to Cart</Button>
      </Link>
    </div>
  );
}