"use client";
import Image from 'next/image';
import Link from 'next/link';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRef, useEffect, useState } from 'react';

// ฟังก์ชัน Hook สำหรับ scrollable section
function useHorizontalScroll(itemWidth: number) {
    const ref = useRef<HTMLDivElement>(null);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(true);

    const checkScroll = () => {
        if (ref.current) {
            const { scrollLeft, scrollWidth, clientWidth } = ref.current;
            setCanLeft(scrollLeft > 0);
            setCanRight(scrollLeft + clientWidth < scrollWidth - 1);
        }
    };

    useEffect(() => {
        const container = ref.current;
        if (!container) return;
        container.addEventListener('scroll', checkScroll);
        checkScroll();
        return () => container.removeEventListener('scroll', checkScroll);
    }, []);

    const scrollLeftByOne = () => {
        if (!ref.current) return;
        const { scrollLeft } = ref.current;
        if (scrollLeft <= itemWidth + 100) {
            ref.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            ref.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        }
    };

    const scrollRightByOne = () => {
        if (!ref.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = ref.current;
        const maxScrollLeft = scrollWidth - clientWidth;
        if (scrollLeft + itemWidth >= maxScrollLeft - 100) {
            ref.current.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
        } else {
            ref.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
    };

    return { ref, canLeft, canRight, scrollLeftByOne, scrollRightByOne };
}

export default function HomePage() {
    // ข้อมูลแต่ละ section
    const topPickItems = [
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,h_1350,g_south/c_crop,g_center,w_1200,h_1200/v1747462203/27_ndpr7c.png", "ยุคคา%20กลอริโอซา%2001", "160"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702299/18_bhgr6n.png", "ฟิโลมะละกอ%2001", "105"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702286/4.2_bavldh.png", "ยุคคา%20ทอมสัน", "80"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,h_1350,g_south/c_crop,g_center,w_1200,h_1200/v1747462203/27_ndpr7c.png", "ยุคคา%20กลอริโอซา%2001", "160"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702299/18_bhgr6n.png", "ฟิโลมะละกอ%2001", "105"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702286/4.2_bavldh.png", "ยุคคา%20ทอมสัน", "80"],
    ];
    const potItems = [
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,h_1350,g_south/c_crop,g_center,w_1200,h_1200/v1747462203/27_ndpr7c.png", "ยุคคา%20กลอริโอซา%2001", "160"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702299/18_bhgr6n.png", "ฟิโลมะละกอ%2001", "105"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702286/4.2_bavldh.png", "ยุคคา%20ทอมสัน", "80"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,h_1350,g_south/c_crop,g_center,w_1200,h_1200/v1747462203/27_ndpr7c.png", "ยุคคา%20กลอริโอซา%2001", "160"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702299/18_bhgr6n.png", "ฟิโลมะละกอ%2001", "105"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702286/4.2_bavldh.png", "ยุคคา%20ทอมสัน", "80"],
    ];
    const bigTreeItems = [
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,h_1350,g_south/c_crop,g_center,w_1200,h_1200/v1747462203/27_ndpr7c.png", "ยุคคา%20กลอริโอซา%2001", "160"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702299/18_bhgr6n.png", "ฟิโลมะละกอ%2001", "105"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702286/4.2_bavldh.png", "ยุคคา%20ทอมสัน", "80"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,h_1350,g_south/c_crop,g_center,w_1200,h_1200/v1747462203/27_ndpr7c.png", "ยุคคา%20กลอริโอซา%2001", "160"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702299/18_bhgr6n.png", "ฟิโลมะละกอ%2001", "105"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702286/4.2_bavldh.png", "ยุคคา%20ทอมสัน", "80"],
    ];
    const portfolioItems = [
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg", "project%2001", "Description for project 1"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893614/IMG_7820_vl1vlo.jpg", "project%2002", "Description for project 2"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893614/IMG_2129_vzgqdk.jpg", "project%2003", "Description for project 3"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg", "project%2004", "Description for project 4"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg", "project%2005", "Description for project 5"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893614/IMG_7820_vl1vlo.jpg", "project%2006", "Description for project 2"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893614/IMG_2129_vzgqdk.jpg", "project%2007", "Description for project 3"],
        ["https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg", "project%2008", "Description for project 4"],
    ];

    // ใช้ Hook สำหรับแต่ละ section
    const topPickScroll = useHorizontalScroll(400 + 24);
    const potScroll = useHorizontalScroll(400 + 24);
    const bigTreeScroll = useHorizontalScroll(400 + 24);
    const portfolioScroll = useHorizontalScroll(420 + 24);

    return (
        <div>
            {/* Banner */}
            <section className="relative w-full h-[800px] mt-0">
                <Image
                    src="/banner/banner.jpg"
                    alt="Pot Banner"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h2 className="text-3xl text-white font-bold">Welcome</h2>
                </div>
            </section>

            {/* Top Pick Section */}
            <section className="py-4 flex justify-center relative">
                <div className="w-full max-w-7xl">
                    <h1 className="text-[27px] font-semibold mt-10 text-left">ต้นไม้ประดิษฐ์ พร้อมกระถาง</h1>
                    <p className="text-[17px] mt-1 mb-4 text-left">Artificial potted plants</p>
                    <div className="relative">
                        <div ref={topPickScroll.ref} className="overflow-x-auto overflow-y-hidden scroll-smooth">
                            <div className="flex gap-6 min-w-max px-1 sm:px-2 md:px-0">
                                {topPickItems.map(([url, name, height], index) => (
                                    <Link
                                        key={index}
                                        href={`/plant/${name}`}
                                        className="flex-shrink-0 w-[400px] block h-full mx-1.5"
                                    >
                                        <div className="rounded-3xl p-4 hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                                            <div className="w-full h-[380px] flex items-center justify-center">
                                                <img
                                                    src={url}
                                                    alt={decodeURIComponent(name)}
                                                    className="object-contain max-h-full"
                                                />
                                            </div>
                                            <h2 className="flex items-center justify-center text-center mt-2">{decodeURIComponent(name)}</h2>
                                            <p className="text-sm text-center text-gray-600">ความสูง {height} cm</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        {/* Arrow buttons */}
                        <button
                            onClick={topPickScroll.scrollLeftByOne}
                            disabled={!topPickScroll.canLeft}
                            className={`absolute -left-1 top-1/2 -translate-y-1/2 z-10 
                                text-black transition-transform duration-200 ease-in-out
                                ${topPickScroll.canLeft ? 'opacity-100' : 'opacity-30 cursor-default'}
                                scale-70 hover:scale-125 active:scale-125
                            `}
                        >
                            <ArrowBackIosNewIcon fontSize="small" />
                        </button>
                        <button
                            onClick={topPickScroll.scrollRightByOne}
                            disabled={!topPickScroll.canRight}
                            className={`absolute -right-1 top-1/2 -translate-y-1/2 z-10 
                                text-black transition-transform duration-200 ease-in-out
                                ${topPickScroll.canRight ? 'opacity-100' : 'opacity-30 cursor-default'}
                                scale-70 hover:scale-125 active:scale-125
                            `}
                        >
                            <ArrowForwardIosIcon fontSize="small" />
                        </button>
                    </div>
                    <div className="flex justify-center mt-10 mb-10">
                        <Link
                            href="/plant"
                            className="px-6 py-2 border-2 border-green-900 text-green-900 rounded-full text-lg hover:bg-green-900 hover:text-white transition flex items-center justify-center"
                        >
                            See More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Banner */}
            <section className="relative h-[700px] mx-10">
                <Image
                    src="/banner/banner.jpg"
                    alt="Pot Banner"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h2 className="text-3xl text-white font-bold">กระถาง</h2>
                </div>
            </section>

            {/* Pot Section */}
            <section className="py-4 flex justify-center relative">
                <div className="w-full max-w-7xl">
                    <h1 className="text-[27px] font-semibold mt-10 text-left">กระถาง</h1>
                    <p className="text-[17px] mt-1 mb-4 text-left">Planters</p>
                    <div className="relative">
                        <div ref={potScroll.ref} className="overflow-x-auto overflow-y-hidden scroll-smooth">
                            <div className="flex gap-6 min-w-max px-1 sm:px-2 md:px-0">
                                {potItems.map(([url, name, height], index) => (
                                    <Link
                                        key={index}
                                        href={`/plant/${name}`}
                                        className="flex-shrink-0 w-[400px] block h-full mx-1.5"
                                    >
                                        <div className="rounded-3xl p-4 hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                                            <div className="w-full h-[380px] flex items-center justify-center">
                                                <img
                                                    src={url}
                                                    alt={decodeURIComponent(name)}
                                                    className="object-contain max-h-full"
                                                />
                                            </div>
                                            <h2 className="flex items-center justify-center text-center mt-2">{decodeURIComponent(name)}</h2>
                                            <p className="text-sm text-center text-gray-600">ความสูง {height} cm</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        {/* Arrow buttons */}
                        <button
                            onClick={potScroll.scrollLeftByOne}
                            disabled={!potScroll.canLeft}
                            className={`absolute -left-1 top-1/2 -translate-y-1/2 z-10 
                                text-black transition-transform duration-200 ease-in-out
                                ${potScroll.canLeft ? 'opacity-100' : 'opacity-30 cursor-default'}
                                scale-70 hover:scale-125 active:scale-125
                            `}
                        >
                            <ArrowBackIosNewIcon fontSize="small" />
                        </button>
                        <button
                            onClick={potScroll.scrollRightByOne}
                            disabled={!potScroll.canRight}
                            className={`absolute -right-1 top-1/2 -translate-y-1/2 z-10 
                                text-black transition-transform duration-200 ease-in-out
                                ${potScroll.canRight ? 'opacity-100' : 'opacity-30 cursor-default'}
                                scale-70 hover:scale-125 active:scale-125
                            `}
                        >
                            <ArrowForwardIosIcon fontSize="small" />
                        </button>
                    </div>
                    <div className="flex justify-center mt-10 mb-10">
                        <Link href="/pot" className="px-6 py-2 border-2 border-green-900 text-green-900 rounded-full text-lg hover:bg-green-900 hover:text-white transition flex items-center justify-center">
                            See More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Banner */}
            <section className="relative h-[700px]">
                <Image
                    src="/banner/banner.jpg"
                    alt="Pot Banner"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h2 className="text-3xl text-white font-bold">ต้นไม้ใหญ่</h2>
                </div>
            </section>

            {/* Pot Section */}
            <section className="py-4 flex justify-center relative">
                <div className="w-full max-w-7xl">
                    <h1 className="text-[27px] font-semibold mt-10 text-left">ต้นไม้ใหญ่</h1>
                    <p className="text-[17px] mt-1 mb-4 text-left">Big Tree</p>
                    <div className="relative">
                        <div ref={bigTreeScroll.ref} className="overflow-x-auto overflow-y-hidden scroll-smooth">
                            <div className="flex gap-6 min-w-max px-1 sm:px-2 md:px-0">
                                {bigTreeItems.map(([url, name, height], index) => (
                                    <Link
                                        key={index}
                                        href={`/bigtree/${name}`}
                                        className="flex-shrink-0 w-[400px] block h-full mx-1.5"
                                    >
                                        <div className="rounded-3xl p-4 hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                                            <div className="w-full h-[380px] flex items-center justify-center">
                                                <img
                                                    src={url}
                                                    alt={decodeURIComponent(name)}
                                                    className="object-contain max-h-full"
                                                />
                                            </div>
                                            <h2 className="flex items-center justify-center text-center mt-2">{decodeURIComponent(name)}</h2>
                                            <p className="text-sm text-center text-gray-600">ความสูง {height} cm</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        {/* Arrow buttons */}
                        <button
                            onClick={bigTreeScroll.scrollLeftByOne}
                            disabled={!bigTreeScroll.canLeft}
                            className={`absolute -left-1 top-1/2 -translate-y-1/2 z-10 
                                text-black transition-transform duration-200 ease-in-out
                                ${bigTreeScroll.canLeft ? 'opacity-100' : 'opacity-30 cursor-default'}
                                scale-70 hover:scale-125 active:scale-125
                            `}
                        >
                            <ArrowBackIosNewIcon fontSize="small" />
                        </button>
                        <button
                            onClick={bigTreeScroll.scrollRightByOne}
                            disabled={!bigTreeScroll.canRight}
                            className={`absolute -right-1 top-1/2 -translate-y-1/2 z-10 
                                text-black transition-transform duration-200 ease-in-out
                                ${bigTreeScroll.canRight ? 'opacity-100' : 'opacity-30 cursor-default'}
                                scale-70 hover:scale-125 active:scale-125
                            `}
                        >
                            <ArrowForwardIosIcon fontSize="small" />
                        </button>
                    </div>
                    <div className="flex justify-center mt-10 mb-10">
                        <Link href="/bigtree" className="px-6 py-2 border-2 border-green-900 text-green-900 rounded-full text-lg hover:bg-green-900 hover:text-white transition flex items-center justify-center">
                            See More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Banner */}
            <section className="relative h-[700px] mx-10">
                <Image
                    src="/banner/banner.jpg"
                    alt="Pot Banner"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h2 className="text-3xl text-white font-bold">Portfolio</h2>
                </div>
            </section>

            {/* Portfolio Section */}
            <section className="py-10 relative">
                <div className="container mx-auto px-10 mt-10">
                    <h2 className="text-3xl font-semibold mb-6 text-left">Portfolio</h2>
                    <div className="relative">
                        <div
                            ref={portfolioScroll.ref}
                            className="overflow-x-auto overflow-y-hidden scroll-smooth"
                        >
                            <div className="flex gap-6 min-w-max">
                                {portfolioItems.map(([url, name, describe]) => (
                                    <Link key={decodeURIComponent(name)} href={`/port/${name}`} className="flex-shrink-0 w-[420px]">
                                        <div className="overflow-hidden hover:shadow-lg transition-transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                                            <div className="w-full aspect-[3/2] overflow-hidden mb-2">
                                                <img
                                                    src={url}
                                                    alt={decodeURIComponent(name)}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <h2 className="text-lg font-semibold px-4">{decodeURIComponent(name)}</h2>
                                            <p className="text-sm text-gray-600 px-4 mb-2">{describe}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        {/* Arrow buttons */}
                        <button
                            onClick={portfolioScroll.scrollLeftByOne}
                            disabled={!portfolioScroll.canLeft}
                            className={`absolute -left-8 top-1/2 -translate-y-1/2 z-10 
                                text-black transition-transform duration-200 ease-in-out
                                ${portfolioScroll.canLeft ? 'opacity-100' : 'opacity-30 cursor-default'}
                                scale-70 hover:scale-125 active:scale-125
                            `}
                        >
                            <ArrowBackIosNewIcon fontSize="small" />
                        </button>
                        <button
                            onClick={portfolioScroll.scrollRightByOne}
                            disabled={!portfolioScroll.canRight}
                            className={`absolute -right-8 top-1/2 -translate-y-1/2 z-10 
                                text-black transition-transform duration-200 ease-in-out
                                ${portfolioScroll.canRight ? 'opacity-100' : 'opacity-30 cursor-default'}
                                scale-70 hover:scale-125 active:scale-125
                            `}
                        >
                            <ArrowForwardIosIcon fontSize="small" />
                        </button>
                    </div>
                    <div className="flex justify-center mt-20 mb-10">
                        <Link href="/port" className="px-6 py-2 border-2 border-green-900 text-green-900 rounded-full text-lg hover:bg-green-900 hover:text-white transition flex items-center justify-center">
                            See More
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}