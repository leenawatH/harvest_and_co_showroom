'use client';
import Link from "next/link";
import { useState, useEffect } from "react";

const portfolioItems = [
    {
        title: "Community Garden Project",
        location: "Bangkok",
        description:
            "Our team volunteered to design and build a sustainable community garden, promoting urban agriculture and healthy living.",
        image: "https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg",
    },
    {
        title: "Local Art Exhibition",
        location: "ICON SIAM, Bangkok",
        description:
            "We hosted an art exhibition featuring local artists, supporting creativity and cultural engagement in our neighborhood.",
        image: "https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893614/IMG_7820_vl1vlo.jpg",
    },
    {
        title: "Charity Bake Sale",
        location: "Bangkok, Thailand",
        description:
            "Organized a bake sale to raise funds for local charities, bringing together employees and the community for a good cause.",
        image: "https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893614/IMG_2129_vzgqdk.jpg",
    },
];

export default function PortfolioPage() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % portfolioItems.length);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    return (
        <main>
            {/* Slideshow Section */}
            <section className="relative w-full h-[60vw] max-h-[600px] min-h-[320px] overflow-hidden">
                <img
                    src={portfolioItems[current].image}
                    alt={portfolioItems[current].title}
                    className="w-full h-full object-cover transition-all duration-700"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />
          
        
                {/* Project Name bottom-left */}
                <div className="absolute left-8 bottom-[10%] md:left-16 md:bottom-[10%]">
                    <h1 className="text-white text-xl md:text-3xl font-semibold">
                        {portfolioItems[current].title}
                    </h1>
                    <h1 className="text-white text-m md:text-xl mt-2">
                        {portfolioItems[current].location}
                    </h1>
                </div>
            </section>

            {/* Portfolio Grid */}
            <div className="max-w-6xl mx-auto py-12 px-4 mt-10 mb-20">
                <div className="grid gap-20 md:grid-cols-2">
                    {portfolioItems.map((item, idx) => (
                        <Link key={idx} href={`/port/${item.title}`} className="flex flex-col items-center hover:opacity-90 transition">
                            <div className="w-full aspect-[8/5] max-w-[500px]">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover shadow-md"
                                />
                            </div>
                            <h2 className="text-center text-l mt-5">{item.title}</h2>
                            <p className="text-center text-sm text-gray-600 mt-1 mb-2">{item.location}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}