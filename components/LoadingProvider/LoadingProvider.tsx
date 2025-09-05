
'use client';
import { createContext, useContext, useMemo, useState, ReactNode } from 'react';

type Ctx = { isLoading: boolean; setLoading: (v: boolean) => void };
const LoadingCtx = createContext<Ctx | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const value = useMemo(() => ({ isLoading, setLoading: setIsLoading }), [isLoading]);
  return <LoadingCtx.Provider value={value}>{children}</LoadingCtx.Provider>;
}

export const useLoading = () => {
  const ctx = useContext(LoadingCtx);
  if (!ctx) throw new Error('useLoading must be used within LoadingProvider');
  return ctx;
};
