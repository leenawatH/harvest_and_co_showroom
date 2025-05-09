
import { Anuphan } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

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
      <body className="bg-gray-300 text-foreground">
        <ThemeProvider>
          <main className="min-h-screen flex flex-col items-center">
           
                {children}
           
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
