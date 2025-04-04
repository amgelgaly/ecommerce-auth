// components/search-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchFormProps {
  initialQuery?: string;
}

export function SearchForm({ initialQuery }: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery || "");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${query.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2" role="search">
      <label htmlFor="search-input" className="sr-only">Search products</label>
      <Input
        id="search-input"
        type="search"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-64"
      />
      <Button type="submit" aria-label="Search">Search</Button>
    </form>
  );
}