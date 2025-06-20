
import { Anuphan } from "next/font/google";
import "./globals.css";

import ThemeRegistry from "@/components/ThemeRegistry";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";



export const metadata = {
  title: "Harvest and Co",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const anuphan = Anuphan({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'], 
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const noFooter = (children as any).type?.noFooter;
  return (
    <html lang="en" className={anuphan.className}>
      <body className="bg-white text-black overflow-x-hidden">
        <ThemeRegistry>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 overflow-x-hidden">{children}</main>
            {!noFooter && <Footer />}
          </div>
        </ThemeRegistry>
      </body>
    </html>
  );
}
