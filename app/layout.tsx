// app/layout.tsx
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster"; // Use the one from ui
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/context/cart-context";
import "./globals.css"; // Assuming styles/globals.css was moved or renamed
import type { Metadata } from 'next';

function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  if (!items || items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://yourstore.com${item.url}` // Use absolute URL
    }))
  };
}

export const metadata: Metadata = {
  title: {
    template: '%s | متجري - اسم متجرك',
    default: 'متجري - اسم متجرك | تسوق أفضل المنتجات',
  },
  description: 'اكتشف مجموعة واسعة من المنتجات عالية الجودة بأسعار تنافسية في متجري. تسوق الآن!',
  keywords: 'متجر إلكتروني، تسوق أونلاين، منتجات عالية الجودة، أسعار تنافسية',
  authors: [{ name: 'متجري' }],
  creator: 'متجري',
  publisher: 'متجري',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'متجري - اسم متجرك',
    description: 'اكتشف مجموعة واسعة من المنتجات عالية الجودة بأسعار تنافسية.',
    type: 'website',
    locale: 'ar_SA',
    url: 'https://yourstore.com',
    siteName: 'متجري',
    images: [{
      url: 'https://yourstore.com/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'متجري - اسم متجرك',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'متجري - اسم متجرك',
    description: 'اكتشف مجموعة واسعة من المنتجات عالية الجودة بأسعار تنافسية.',
    images: ['https://yourstore.com/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://yourstore.com',
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization", // أو "Store" إذا كان مناسباً أكثر
                "name": "متجري - اسم متجرك",
                "url": "https://yourstore.com", // رابط موقعك
                "logo": "https://yourstore.com/logo.png", // رابط شعار الموقع
                // "contactPoint": { ... } // معلومات الاتصال
                // "sameAs": [ // روابط الشبكات الاجتماعية
                //   "https://www.facebook.com/yourpage",
                //   "https://www.twitter.com/yourprofile"
                // ]
            }) }}
        />
        <Providers> {/* Wrap with combined providers */}
          <ThemeProvider>
             <CartProvider> {/* CartProvider inside ThemeProvider maybe, or vice-versa */}
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <Toaster />
              {/* Breadcrumb Schema */}
              {/*
              const breadcrumbItems = [ { name: "الرئيسية", url: "/" }, { name: "الأصناف", url: "/categories" },  ];
              const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
              */}
              {/* {breadcrumbSchema && (
                 <script
                     type="application/ld+json"
                     dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
                 />
              )} */}
             </CartProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}