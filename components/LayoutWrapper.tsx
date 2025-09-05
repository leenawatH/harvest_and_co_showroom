'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LoadingProvider } from '@/components/LoadingProvider/LoadingProvider';
import GlobalLoader from '@/components/LoadingProvider/GlobalLoader';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // บอกว่าโหลดฝั่ง client แล้วค่อย render
    setIsClient(true);
  }, []);

  if (!isClient) return null; // หรือ Skeleton ก็ได้

  const isAdminPath = pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      <LoadingProvider>
      <Navbar />
      <GlobalLoader />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      {!isAdminPath && <Footer />}
      </LoadingProvider>

    </div>
  );
}
