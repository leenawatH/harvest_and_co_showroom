
import { Anuphan } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar/index";
import Footer from "@/components/Footer/index";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const anuphan = Anuphan({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'], 
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={anuphan.className}>
  <body className="bg-white text-black">
    <Navbar />
      <main className="min-h-screen flex flex-col items-center">
        {children}
      </main>
    <Footer />
  </body>
</html>
  );
}
