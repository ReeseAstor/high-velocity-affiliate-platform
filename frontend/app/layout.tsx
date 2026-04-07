import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FTCDisclosure from "@/components/compliance/FTCDisclosure";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Affiliate Automation Platform",
  description: "High-Velocity Affiliate content & tracking",
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
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Affiliate<span className="text-slate-900 dark:text-white">Auto</span>
                    </h1>
                    <nav>
                        <ul className="flex space-x-4 text-sm font-medium">
                            <li><a href="/" className="hover:text-blue-600">Dashboard</a></li>
                            <li><a href="/products" className="hover:text-blue-600">Products</a></li>
                            <li><a href="/compare" className="hover:text-blue-600">Compare</a></li>
                            <li><a href="/content" className="hover:text-blue-600">Content</a></li>
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
