'use client';
import Image from 'next/image';
import { useLoading } from '@/components/LoadingProvider/LoadingProvider';
import { useEffect, useState } from 'react';

export default function GlobalLoader() {
  const { isLoading } = useLoading();
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setFadeOut(false);
    } else if (visible) {
      setFadeOut(true);
      const timer = setTimeout(() => setVisible(false), 600); // รอ fadeOut 0.6s
      return () => clearTimeout(timer);
    }
  }, [isLoading, visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] grid place-items-center bg-white backdrop-blur-sm transition-opacity duration-700 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <Image
        src="/logo/Logo H_C-01.png"
        alt="Loading"
        width={300}
        height={300}
        className="animate-logo-scale"
        priority
      />

      {/* scale animation */}
      <style jsx global>{`
        @keyframes logo-scale {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .animate-logo-scale {
          animation: logo-scale 2.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}