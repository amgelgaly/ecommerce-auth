"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image if you use it for the logo
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, User, Search, Moon, Sun, Bell, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { useTheme } from "next-themes";
import { useCart } from "@/context/cart-context";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; // Import Input for search

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const { theme, setTheme } = useTheme();
  const { cartCount, isCartLoading } = useCart();
  const { data: session, status } = useSession();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(e.currentTarget.value);
    if (searchQuery.trim()) {
      try {
        await router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      } catch (error) {
        console.error("Failed to navigate to search page:", error);
        toast.error("حدث خطأ أثناء البحث.");
      }
    }
  };

  // Placeholder for notifications logic
  const hasNotifications = false; // Replace with actual logic

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        {/* --- Left Side --- */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            {/* <Image src="/logo.png" alt="Logo" width={32} height={32} /> */}
             <span className="text-lg">متجري</span> {/* Placeholder Logo/Brand Name */}
          </Link>

          {/* Navigation Links (Hidden on small screens, shown on md+) */}
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link
              href="/products"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/products" ? "text-foreground" : "text-foreground/60"
              )}
            >
              المنتجات
            </Link>
            <Link
              href="/categories"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/categories" ? "text-foreground" : "text-foreground/60"
              )}
            >
              الأصناف
            </Link>
             {/* Add more links as needed */}
          </nav>
        </div>

        {/* --- Middle: Search bar (Hidden on small screens, shown on md+) --- */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <form onSubmit={handleSearch} className="w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ابحث عن منتجات..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
                 aria-label="Search products"
              />
            </div>
          </form>
        </div>

        {/* --- Right Side --- */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
             aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications (Optional) */}
          {/*
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                {hasNotifications && (
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>الإشعارات</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>لا توجد إشعارات جديدة</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          */}

          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" aria-label="Shopping Cart">
              <ShoppingCart className="h-5 w-5" />
              {isCartLoading ? (
                 <span className="ml-1 text-xs animate-pulse">...</span>
              ) : cartCount > 0 ? (
                 <Badge variant="secondary" className="absolute -top-1 -right-1 h-4 w-4 justify-center rounded-full p-0 text-xs">
                   {cartCount}
                 </Badge>
              ) : null}
              <span className="sr-only">Shopping Cart</span>
            </Button>
          </Link>

          {/* Auth Section */}
          {status === "loading" && (
             <Button variant="ghost" size="icon" disabled>
               <User className="h-5 w-5 animate-pulse" />
             </Button>
          )}

          {status === "unauthenticated" && (
            <>
              {/* Show User Icon only on smaller screens maybe */}
              <Link href="/auth/login" className="hidden sm:inline-flex">
                <Button variant="ghost" size="icon" aria-label="Login">
                  <User className="h-5 w-5" />
                  <span className="sr-only">تسجيل الدخول</span>
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">تسجيل الدخول</Button> {/* Added text-white */}
              </Link>
              {/* Optionally add Register button */}
              {/*
              <Link href="/auth/register">
                 <Button variant="outline">إنشاء حساب</Button>
              </Link>
               */}
            </>
          )}

          {status === "authenticated" && session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="My Account">
                   {/* Optional: Display user avatar */}
                   {/*
                   <Avatar className="h-8 w-8">
                     <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                     <AvatarFallback>{session.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                   </Avatar>
                   */}
                   <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-medium">{session.user.name}</div>
                  <div className="text-xs text-muted-foreground">{session.user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                   <Link href="/account" className="flex items-center w-full">
                      <Settings className="ml-2 h-4 w-4" /> {/* Adjusted margin for RTL */}
                      <span>إعدادات الحساب</span>
                   </Link>
                </DropdownMenuItem>
                 {/* Add link to dashboard based on role */}
                 {(session.user as any).role === 'admin' && (
                   <DropdownMenuItem asChild>
                     <Link href="/admin/dashboard" className="flex items-center w-full">
                        <LayoutDashboard className="ml-2 h-4 w-4" /> {/* Adjusted margin for RTL */}
                        <span>لوحة التحكم</span>
                     </Link>
                   </DropdownMenuItem>
                 )}
                 {(session.user as any).role === 'seller' && (
                   <DropdownMenuItem asChild>
                     <Link href="/seller/dashboard" className="flex items-center w-full">
                        <LayoutDashboard className="ml-2 h-4 w-4" /> {/* Adjusted margin for RTL */}
                        <span>لوحة البائع</span>
                     </Link>
                   </DropdownMenuItem>
                 )}
                 {/* Add Orders Link */}
                <DropdownMenuItem asChild>
                   <Link href="/account/orders" className="flex items-center w-full">
                     <ShoppingCart className="ml-2 h-4 w-4" /> {/* Re-using cart icon, consider another */}
                     <span>طلباتي</span>
                   </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center text-destructive hover:text-destructive"
                  >
                    <LogOut className="ml-2 h-4 w-4" /> {/* Adjusted margin for RTL */}
                    <span>تسجيل الخروج</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

        </div>
      </div>

      {/* --- Search bar (for sm screens) --- */}
      <div className="md:hidden border-t px-4 py-2">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ابحث..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10 w-full h-9" // Smaller height for mobile
                 aria-label="Search products"
              />
            </div>
          </form>
      </div>
    </header>
  );
}
