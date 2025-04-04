// components/ui/pagination.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface PaginationItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
  href: string; // Add href prop
}

const PaginationItem = React.forwardRef<
  HTMLAnchorElement,
  PaginationItemProps
>(({ className, isActive, children, href, ...props }, ref) => { // Add href to props
  return (
    <Link
      ref={ref}
      href={href} // Use href prop
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive && "bg-primary text-primary-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
});
PaginationItem.displayName = "PaginationItem";

interface PaginationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string; // Add href prop
}

const PaginationLink = React.forwardRef<
  HTMLAnchorElement,
  PaginationLinkProps
>(({ className, children, href, ...props }, ref) => { // Add href to props
  return (
    <Link
      ref={ref}
      href={href} // Use href prop
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
});
PaginationLink.displayName = "PaginationLink";

const PaginationEllipsis = () => (
  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm">
    ...
  </span>
);

interface PaginationContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const PaginationContent = React.forwardRef<
  HTMLDivElement,
  PaginationContentProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
});
PaginationContent.displayName = "PaginationContent";

interface PaginationPreviousProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string; // Add href prop
}

const PaginationPrevious = React.forwardRef<
  HTMLAnchorElement,
  PaginationPreviousProps
>(({ className, children, href, ...props }, ref) => { // Add href to props
  return (
    <Link
      ref={ref}
      href={href} // Use href prop
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous</span>
    </Link>
  );
});
PaginationPrevious.displayName = "PaginationPrevious";

interface PaginationNextProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string; // Add href prop
}

const PaginationNext = React.forwardRef<
  HTMLAnchorElement,
  PaginationNextProps
>(({ className, children, href, ...props }, ref) => { // Add href to props
  return (
    <Link
      ref={ref}
      href={href} // Use href prop
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="sr-only">Next</span>
      <ChevronRight className="h-4 w-4" />
    </Link>
  );
});
PaginationNext.displayName = "PaginationNext";

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn("flex items-center justify-center", className)}
        {...props}
      />
    );
  }
);
Pagination.displayName = "Pagination";

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
};
