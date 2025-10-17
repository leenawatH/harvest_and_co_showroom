'use client';

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useState, useEffect } from "react";
import { SinglePortInCard } from '@/lib/types/types';
import { getAllSinglePortInCard } from "@/lib/service/portService";
import { useLoading } from '@/components/LoadingProvider/LoadingProvider';

export default function PortfolioPage() {
  const [current, setCurrent] = useState(0);
  const [allPorts, setPorts] = useState<SinglePortInCard[]>([]);

  const { setLoading } = useLoading();

  // โหลดข้อมูล
  useEffect(() => {
    setLoading(true);
    let mounted = true;
    const fetchData = async () => {
      try {
        const fetchedPorts = await getAllSinglePortInCard();
        if (!mounted) return;
        setPorts(fetchedPorts || []);
        setCurrent(0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  // ป้องกัน current เกินขอบเขต
  useEffect(() => {
    if (allPorts.length === 0) return;
    if (current >= allPorts.length) setCurrent(0);
  }, [allPorts.length, current]);

  // สไลด์อัตโนมัติ
  useEffect(() => {
    if (allPorts.length === 0) return;
    const len = allPorts.length;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % len);
    }, 3500);
    return () => clearInterval(timer);
  }, [allPorts.length]);

  if (allPorts.length === 0) return <main className="min-h-screen flex items-center justify-center">No Portfolio Data</main>;

  const safeIndex = Math.min(current, allPorts.length - 1);
  const hero = allPorts[safeIndex];

  return (
    <main>
      {/* Slideshow Section (Clickable) */}
      <Link
        href={`/port/${hero.id}`}
        aria-label={`Open portfolio: ${hero.title ?? ''}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <section className="relative w-full h-[60vw] max-h-[600px] min-h-[320px] overflow-hidden cursor-pointer group">
          <img
            src={hero.image_cover || ""}
            alt={hero.title || "portfolio"}
            className="w-full h-full object-cover transition-transform duration-700"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 transition-opacity duration-300" />
          {/* Project Name bottom-left */}
          <div className="absolute left-8 bottom-[10%] md:left-16 md:bottom-[10%]">
            <h1 className="text-white text-xl md:text-3xl font-semibold">
              {hero.title}
            </h1>
            <h2 className="text-white text-m md:text-xl mt-2">
              {hero.location}
            </h2>
          </div>
        </section>
      </Link>

      {/* Portfolio Grid */}
      <div className="max-w-6xl mx-auto py-12 px-4 mt-10 mb-20">
        <div className="grid gap-20 md:grid-cols-2">
          {allPorts.map((item) => (
            <Link
              key={item.id}
              href={`/port/${item.id}`}
              className="flex flex-col items-center hover:opacity-90 transition"
            >
              <div className="w-full aspect-[8/5] max-w-[500px]">
                <img
                  src={item.image_cover || ""}
                  alt={item.title || "portfolio item"}
                  className="w-full h-full object-cover shadow-md"
                />
              </div>
              <h3 className="text-center text-l mt-5">{item.title}</h3>
              <p className="text-center text-sm text-gray-600 mt-1 mb-2">
                {item.location}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
