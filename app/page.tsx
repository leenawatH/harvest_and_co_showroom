"use client";
import Image from 'next/image';
import Link from 'next/link';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { useRef, useEffect, useState } from 'react';

export default function HomePage() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
        }
    };

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        container.addEventListener('scroll', checkScroll);
        checkScroll();
        return () => container.removeEventListener('scroll', checkScroll);
    }, []);


    const ITEM_WIDTH = 400 + 24;

    const scrollLeftByOne = () => {
        if (!scrollRef.current) return;

        const { scrollLeft } = scrollRef.current;

        if (scrollLeft <= ITEM_WIDTH + 100) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            scrollRef.current.scrollBy({ left: -ITEM_WIDTH, behavior: 'smooth' });
        }
    };

    const scrollRightByOne = () => {
        if (!scrollRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;

        if (scrollLeft + ITEM_WIDTH >= maxScrollLeft - 100) {
            scrollRef.current.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
        } else {
            scrollRef.current.scrollBy({ left: ITEM_WIDTH, behavior: 'smooth' });
        }
    };

    const potRef = useRef<HTMLDivElement>(null);
    const [canPotLeft, setCanPotLeft] = useState(false);
    const [canPotRight, setCanPotRight] = useState(true);

    const checkPotScroll = () => {
        if (potRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = potRef.current;
            setCanPotLeft(scrollLeft > 0);
            setCanPotRight(scrollLeft + clientWidth < scrollWidth - 1);
        }
    };

    useEffect(() => {
        const container = potRef.current;
        if (!container) return;
        container.addEventListener('scroll', checkPotScroll);
        checkPotScroll();
        return () => container.removeEventListener('scroll', checkPotScroll);
    }, []);

    const POT_ITEM_WIDTH = 400 + 24;

    const scrollPotLeft = () => {
        if (!potRef.current) return;
        const { scrollLeft } = potRef.current;
        if (scrollLeft <= POT_ITEM_WIDTH + 100) {
            potRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            potRef.current.scrollBy({ left: -POT_ITEM_WIDTH, behavior: 'smooth' });
        }
    };

    const scrollPotRight = () => {
        if (!potRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = potRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;
        if (scrollLeft + POT_ITEM_WIDTH >= maxScrollLeft - 100) {
            potRef.current.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
        } else {
            potRef.current.scrollBy({ left: POT_ITEM_WIDTH, behavior: 'smooth' });
        }
    };

    const portfolioRef = useRef<HTMLDivElement>(null);
    const [canPortfolioLeft, setCanPortfolioLeft] = useState(false);
    const [canPortfolioRight, setCanPortfolioRight] = useState(true);

    const checkPortfolioScroll = () => {
        if (portfolioRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = portfolioRef.current;
            setCanPortfolioLeft(scrollLeft > 0);
            setCanPortfolioRight(scrollLeft + clientWidth < scrollWidth - 1);
        }
    };

    useEffect(() => {
        const container = portfolioRef.current;
        if (!container) return;
        container.addEventListener('scroll', checkPortfolioScroll);
        checkPortfolioScroll();
        return () => container.removeEventListener('scroll', checkPortfolioScroll);
    }, []);

    const PORTFOLIO_ITEM_WIDTH = 420 + 24;

    const scrollPortfolioLeft = () => {
        if (!portfolioRef.current) return;
        const { scrollLeft } = portfolioRef.current;
        if (scrollLeft <= PORTFOLIO_ITEM_WIDTH + 100) {
            portfolioRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            portfolioRef.current.scrollBy({ left: -PORTFOLIO_ITEM_WIDTH, behavior: 'smooth' });
        }
    };

    const scrollPortfolioRight = () => {
        if (!portfolioRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = portfolioRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;
        if (scrollLeft + PORTFOLIO_ITEM_WIDTH >= maxScrollLeft - 100) {
            portfolioRef.current.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
        } else {
            portfolioRef.current.scrollBy({ left: PORTFOLIO_ITEM_WIDTH, behavior: 'smooth' });
        }
    };

    return (
        <div>
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
                        <div ref={scrollRef} className="overflow-x-auto overflow-y-hidden scroll-smooth">
                            <div className="flex gap-6 min-w-max px-1 sm:px-2 md:px-0">
                                {[
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,h_1350,g_south/c_crop,g_center,w_1200,h_1200/v1747462203/27_ndpr7c.png", "ยุคคา%20กลอริโอซา%2001", "160"],
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702299/18_bhgr6n.png", "ฟิโลมะละกอ%2001", "105"],
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702286/4.2_bavldh.png", "ยุคคา%20ทอมสัน", "80"],
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,h_1350,g_south/c_crop,g_center,w_1200,h_1200/v1747462203/27_ndpr7c.png", "ยุคคา%20กลอริโอซา%2001", "160"],
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702299/18_bhgr6n.png", "ฟิโลมะละกอ%2001", "105"],
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702286/4.2_bavldh.png", "ยุคคา%20ทอมสัน", "80"],
                                ].map(([url, name, height], index) => (
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
                            onClick={scrollLeftByOne}
                            disabled={!canScrollLeft}
                            className={`absolute -left-1 top-1/2 -translate-y-1/2 z-10 
                                text-black transition-transform duration-200 ease-in-out
                                ${canScrollLeft ? 'opacity-100' : 'opacity-30 cursor-default'}
                                scale-70 hover:scale-125 active:scale-125
                            `}
                        >
                            <ArrowBackIosNewIcon fontSize="small" />
                        </button>

                        <button
                            onClick={scrollRightByOne}
                            disabled={!canScrollRight}
                            className={`absolute -right-1 top-1/2 -translate-y-1/2 z-10 
                                text-black transition-transform duration-200 ease-in-out
                                ${canScrollRight ? 'opacity-100' : 'opacity-30 cursor-default'}
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
                        <div ref={potRef} className="overflow-x-auto overflow-y-hidden scroll-smooth">
                            <div className="flex gap-6 min-w-max px-1 sm:px-2 md:px-0">
                                {[
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,h_1350,g_south/c_crop,g_center,w_1200,h_1200/v1747462203/27_ndpr7c.png", "ยุคคา%20กลอริโอซา%2001", "160"],
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702299/18_bhgr6n.png", "ฟิโลมะละกอ%2001", "105"],
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702286/4.2_bavldh.png", "ยุคคา%20ทอมสัน", "80"],
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,h_1350,g_south/c_crop,g_center,w_1200,h_1200/v1747462203/27_ndpr7c.png", "ยุคคา%20กลอริโอซา%2001", "160"],
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702299/18_bhgr6n.png", "ฟิโลมะละกอ%2001", "105"],
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/c_crop,w_1220,h_1300,y_600/c_crop,g_center,w_600,h_700/v1746702286/4.2_bavldh.png", "ยุคคา%20ทอมสัน", "80"],
                                ].map(([url, name, height], index) => (
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
                            onClick={scrollPotLeft}
                            disabled={!canPotLeft}
                            className={`absolute -left-8 top-1/2 -translate-y-1/2 z-10 
                    text-black transition-transform duration-200 ease-in-out
                    ${canPotLeft ? 'opacity-100' : 'opacity-30 cursor-default'}
                    scale-70 hover:scale-125 active:scale-125
                `}
                        >
                            <ArrowBackIosNewIcon fontSize="small" />
                        </button>
                        <button
                            onClick={scrollPotRight}
                            disabled={!canPotRight}
                            className={`absolute -right-8 top-1/2 -translate-y-1/2 z-10 
                    text-black transition-transform duration-200 ease-in-out
                    ${canPotRight ? 'opacity-100' : 'opacity-30 cursor-default'}
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
            <section className="relative w-full h-[700px]">
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
                    {/* Scrollable wrapper */}
                    <div className="relative">
                        <div
                            ref={portfolioRef}
                            className="overflow-x-auto overflow-y-hidden scroll-smooth"
                        >
                            <div className="flex gap-6 min-w-max">
                                {[
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg", "project%2001", "Description for project 1"],
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893614/IMG_7820_vl1vlo.jpg", "project%2002", "Description for project 2"],
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893614/IMG_2129_vzgqdk.jpg", "project%2003", "Description for project 3"],
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg", "project%2004", "Description for project 4"],
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg", "project%2005", "Description for project 5"],
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893614/IMG_7820_vl1vlo.jpg", "project%2006", "Description for project 2"],
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893614/IMG_2129_vzgqdk.jpg", "project%2007", "Description for project 3"],
                                    ["https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg", "project%2008", "Description for project 4"],
                                ].map(([url, name, describe]) => (
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
                            onClick={scrollPortfolioLeft}
                            disabled={!canPortfolioLeft}
                            className={`absolute -left-8 top-1/2 -translate-y-1/2 z-10 
                                text-black transition-transform duration-200 ease-in-out
                                ${canPortfolioLeft ? 'opacity-100' : 'opacity-30 cursor-default'}
                                scale-70 hover:scale-125 active:scale-125
                            `}
                        >
                            <ArrowBackIosNewIcon fontSize="small" />
                        </button>
                        <button
                            onClick={scrollPortfolioRight}
                            disabled={!canPortfolioRight}
                            className={`absolute -right-8 top-1/2 -translate-y-1/2 z-10 
                                text-black transition-transform duration-200 ease-in-out
                                ${canPortfolioRight ? 'opacity-100' : 'opacity-30 cursor-default'}
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

            {/* Banner */}
            <section className="relative w-full h-[700px]">
                <Image
                    src="/banner/banner.jpg"
                    alt="Pot Banner"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h2 className="text-3xl text-white font-bold">Big Tree</h2>
                </div>
            </section>
        </div>
    );
}
