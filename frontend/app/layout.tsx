import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FTCDisclosure from "@/components/compliance/FTCDisclosure";

const inter = Inter({ subsets: ["latin"] });

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const pinterestVerification = process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION;

export const metadata: Metadata = {
  title: "SmartDeskHQ | Tech Reviews, Guides & Comparisons",
  description: "Expert tech reviews, buying guides, and product comparisons for smart home, gaming, and work-from-home tech.",
  ...(googleVerification || pinterestVerification
    ? {
        verification: {
          ...(googleVerification ? { google: googleVerification } : {}),
          ...(pinterestVerification
            ? {
                other: {
                  "pinterest-site-verification": pinterestVerification,
                },
              }
            : {}),
        },
      }
    : {}),
  other: {
    "pinterest-rich-pin": "true",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-10">
                <div className="container mx-auto flex justify-between items-center">
                    <a href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Smart<span className="text-slate-900 dark:text-white">DeskHQ</span>
                    </a>
                    <nav>
                        <ul className="flex space-x-4 text-sm font-medium">
                            <li><a href="/blog" className="hover:text-blue-600">Blog</a></li>
                            <li><a href="/compare" className="hover:text-blue-600">Compare</a></li>
                            <li><a href="/products" className="hover:text-blue-600">Products</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
            <main className="flex-grow container mx-auto p-4 md:p-8">
                {children}
            </main>
            <footer className="bg-white dark:bg-slate-900 mt-auto">
               <FTCDisclosure />
            </footer>
        </div>
      </body>
    </html>
  );
}
