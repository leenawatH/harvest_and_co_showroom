'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { SinglePortInCard } from '@/lib/types/types';
import { getAllSinglePortInCard } from "@/lib/service/portService";

export default function PortfolioPage() {
    const [current, setCurrent] = useState(0);
    const [allPorts, setPorts] = useState<SinglePortInCard[]>([]);
    const [loading, setLoading] = useState(true);

    // โหลดข้อมูล
    useEffect(() => {
        let mounted = true;
        const fetchData = async () => {
            setLoading(true);
            try {
                const fetchedPorts = await getAllSinglePortInCard();
                if (!mounted) return;
                setPorts(fetchedPorts || []);
                setCurrent(0); // รีเซ็ต index เมื่อข้อมูลมาใหม่
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchData();
        return () => { mounted = false; };
    }, []);

    // ป้องกัน current เกินขอบเขต เมื่อความยาว array เปลี่ยน
    useEffect(() => {
        if (allPorts.length === 0) return;
        if (current >= allPorts.length) setCurrent(0);
    }, [allPorts.length, current]);

    // สไลด์อัตโนมัติ: ผูกกับความยาวข้อมูล (ไม่รันถ้าไม่มีข้อมูล)
    useEffect(() => {
        if (allPorts.length === 0) return;
        const len = allPorts.length;
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % len);
        }, 3500);
        return () => clearInterval(timer);
    }, [allPorts.length]);

    if (loading) {
        return <div className="text-center py-20">Loading...</div>;
    }

    if (allPorts.length === 0) {
        return <div className="text-center py-20">No Portfolio Data</div>;
    }

    // ใช้ safeIndex ป้องกัน out-of-range
    const safeIndex = Math.min(current, allPorts.length - 1);
    const hero = allPorts[safeIndex];

    return (
        <main>
            {/* Slideshow Section */}
            <section className="relative w-full h-[60vw] max-h-[600px] min-h-[320px] overflow-hidden">
                <img
                    src={hero.image_cover || ""}
                    alt={hero.title || "portfolio"}
                    className="w-full h-full object-cover transition-all duration-700"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />
                {/* Project Name bottom-left */}
                <div className="absolute left-8 bottom-[10%] md:left-16 md:bottom-[10%]">
                    <h1 className="text-white text-xl md:text-3xl font-semibold">
                        {hero.title}
                    </h1>
                    <h1 className="text-white text-m md:text-xl mt-2">
                        {hero.location}
                    </h1>
                </div>
            </section>

            {/* Portfolio Grid */}
            <div className="max-w-6xl mx-auto py-12 px-4 mt-10 mb-20">
                <div className="grid gap-20 md:grid-cols-2">
                    {allPorts.map((item) => (
                        <Link
                            key={item.id}
                            href={`/port/${item.id}`}  // ✅ ใช้ id จะปลอดภัยกว่า title
                            className="flex flex-col items-center hover:opacity-90 transition"
                        >
                            <div className="w-full aspect-[8/5] max-w-[500px]">
                                <img
                                    src={item.image_cover || ""}
                                    alt={item.title || "portfolio item"}
                                    className="w-full h-full object-cover shadow-md"
                                />
                            </div>
                            <h2 className="text-center text-l mt-5">{item.title}</h2>
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
