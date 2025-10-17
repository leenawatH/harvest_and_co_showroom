"use client";

import Image from 'next/image';
import Link from 'next/link';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useEffect, useState } from 'react';

import HorizontalScroll from '@/components/HorizontalScroll';
import { getTransformedImage } from '@/components/ImageUrl_Transformed';

import { getSuggestedPlants } from '@/lib/service/plantService';
import { getSuggestedPots } from '@/lib/service/potService';
import { getSuggestedPorts } from '@/lib/service/portService';
import { useLoading } from '@/components/LoadingProvider/LoadingProvider';

import { SinglePlantWithPotInCard, SinglePortInCard, SinglePotInCard } from '@/lib/types/types';

export default function HomePage() {
    const [suggestedPlant, setSuggestedPlant] = useState<SinglePlantWithPotInCard[]>([]);
    const [suggestedPot, setSuggestedPot] = useState<SinglePotInCard[]>([]);
    const [suggestedPort, setSuggestedPort] = useState<SinglePortInCard[]>([]);

    const { setLoading } = useLoading();

    const topPickScroll = HorizontalScroll(450, 3);
    const potScroll = HorizontalScroll(450, 3);
    const portfolioScroll = HorizontalScroll(450, 3);

    useEffect(() => {
        setLoading(true);
        let cancelled = false;
        (async () => {
            try {
                const [plants, pots, ports] = await Promise.all([
                    getSuggestedPlants(),
                    getSuggestedPots(),
                    getSuggestedPorts(),
                ]);
                if (cancelled) return;
                setSuggestedPlant(plants ?? []);
                setSuggestedPot(pots ?? []);
                setSuggestedPort(ports ?? []);
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="min-h-screen w-full items-center">
            {/* Banner */}
            <section className="relative w-full h-[600px] sm:h-[800px] mt-0">
                <Image
                    src="/banner/banner.jpg"
                    alt="Pot Banner"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h2 className="text-2xl sm:text-3xl text-white font-bold">Welcome</h2>
                </div>
            </section>

            {/* 🌿 Top Pick Section */}
            <HomeSection
                title="ต้นไม้ประดิษฐ์ พร้อมกระถาง"
                subtitle="Artificial potted plants"
                items={suggestedPlant}
                linkPrefix="/product/plant"
                scrollRef={topPickScroll.ref}
                leftClick={topPickScroll.scrollLeftByOne}
                rightClick={topPickScroll.scrollRightByOne}
                canLeft={topPickScroll.canLeft}
                canRight={topPickScroll.canRight}
            />

            {/* Banner */} <section className="py-10"> <div className="container mx-auto px-10"> <div className="relative h-[700px] w-full overflow-hidden"> <Image src="/banner/banner.jpg" alt="Pot Banner" fill className="object-cover" /> <div className="absolute inset-0 bg-black/30 flex items-center justify-center"> <h2 className="text-3xl text-white font-bold">กระถางต้นไม้</h2> </div> </div> </div> </section>

            {/* 🪴 Pot Section */}
            <HomeSection
                title="กระถางต้นไม้"
                subtitle="Planters"
                items={suggestedPot}
                linkPrefix="/product/pot"
                scrollRef={potScroll.ref}
                leftClick={potScroll.scrollLeftByOne}
                rightClick={potScroll.scrollRightByOne}
                canLeft={potScroll.canLeft}
                canRight={potScroll.canRight}
            />

            {/* จัดสวน section */} <section className="w-full flex flex-col md:flex-row h-auto md:h-[500px]"> {/* LEFT: TEXT (40%) */} <div className="w-full md:w-[45%] bg-black text-white flex items-center justify-center p-6 md:p-12 text-center md:text-left"> <div> <h2 className="text-xl md:text-2xl tracking-widest mb-2">VERTICAL GARDEN</h2> <h3 className="text-md md:text-xl mb-6">บริการจัดสวนแนวตั้งตกแต่งสถานที่</h3> <p className="mb-3"> เพิ่มสีเขียวให้มุมโปรดของคุณ <br /> ทั้งภายในบ้าน และ นอกบ้าน </p> <p className="mb-3"> ด้วยสวนแนวตั้งในแบบฉบับของ Livingstyle </p> <p className="mb-6"> ในราคาเริ่มต้นเพียง 6,500 บาท ต่อ ตร.ม. </p> <Link href="/product/garden" className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition flex items-center justify-center"> SEE MORE </Link> </div> </div> {/* RIGHT: IMAGE (60%) */} <div className="w-full md:w-[55%] h-[350px] md:h-full relative"> <img src="/banner/banner.jpg" alt="Vertical Garden" className="object-cover w-full h-full" /> </div> </section> {/* bigtree section */} <section className="w-full flex flex-col md:flex-row h-auto md:h-[500px]"> {/* RIGHT: IMAGE (60%) */} <div className="w-full md:w-[55%] h-[350px] md:h-full relative"> <img src="/banner/banner.jpg" alt="Vertical Garden" className="object-cover w-full h-full" /> </div> {/* LEFT: TEXT (40%) */} <div className="w-full md:w-[45%] bg-black text-white flex items-center justify-center p-6 md:p-12 text-center md:text-left"> <div> <h2 className="text-xl md:text-2xl tracking-widest mb-2">BIG TREE</h2> <h3 className="text-md md:text-xl mb-6">บริการจัดสวนแนวตั้งตกแต่งสถานที่</h3> <p className="mb-3"> เพิ่มสีเขียวให้มุมโปรดของคุณ <br /> ทั้งภายในบ้าน และ นอกบ้าน </p> <p className="mb-3"> ด้วยสวนแนวตั้งในแบบฉบับของ Livingstyle </p> <p className="mb-6"> ในราคาเริ่มต้นเพียง 6,500 บาท ต่อ ตร.ม. </p> <Link href="/product/garden" className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition flex items-center justify-center"> SEE MORE </Link> </div> </div> </section> {/* จัดสวน section */} <section className="w-full flex flex-col md:flex-row h-auto md:h-[500px] mb-10"> {/* LEFT: TEXT (40%) */} <div className="w-full md:w-[45%] bg-black text-white flex items-center justify-center p-6 md:p-12 text-center md:text-left"> <div> <h2 className="text-xl md:text-2xl tracking-widest mb-2">จัดสวน</h2> <h3 className="text-md md:text-xl mb-6">บริการจัดสวนแนวตั้งตกแต่งสถานที่</h3> <p className="mb-3"> เพิ่มสีเขียวให้มุมโปรดของคุณ <br /> ทั้งภายในบ้าน และ นอกบ้าน </p> <p className="mb-3"> ด้วยสวนแนวตั้งในแบบฉบับของ Livingstyle </p> <p className="mb-6"> ในราคาเริ่มต้นเพียง 6,500 บาท ต่อ ตร.ม. </p> <Link href="/product/garden" className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition flex items-center justify-center"> SEE MORE </Link> </div> </div> {/* RIGHT: IMAGE (60%) */} <div className="w-full md:w-[55%] h-[350px] md:h-full relative"> <img src="/banner/banner.jpg" alt="Vertical Garden" className="object-cover w-full h-full" /> </div> </section>

            {/* Banner */} <section className="py-10"> <div className="container mx-auto px-10"> <div className="relative h-[700px] w-full overflow-hidden"> <Image src="/banner/banner.jpg" alt="Pot Banner" fill className="object-cover" /> <div className="absolute inset-0 bg-black/30 flex items-center justify-center"> <h2 className="text-3xl text-white font-bold">Portfolio</h2> </div> </div> </div> </section>
            
            {/* 🖼️ Portfolio Section */}
            <PortfolioSection
                title="Portfolio"
                items={suggestedPort}
                linkPrefix="/port"
                scrollRef={portfolioScroll.ref}
                leftClick={portfolioScroll.scrollLeftByOne}
                rightClick={portfolioScroll.scrollRightByOne}
                canLeft={portfolioScroll.canLeft}
                canRight={portfolioScroll.canRight}
            />
        </div>
    );
}

/* 🌿 Reusable Section (Plants / Pots) */
function HomeSection({ title, subtitle, items, linkPrefix, scrollRef, leftClick, rightClick, canLeft, canRight }: any) {
    return (
        <section className="py-4 flex justify-center relative">
            <div className="container mx-auto px-4 sm:px-10">
                <h1 className="text-[22px] sm:text-[27px] font-semibold mt-10 text-left">{title}</h1>
                <p className="text-[15px] sm:text-[17px] mt-1 mb-4 text-left">{subtitle}</p>

                <div className="relative">
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto overflow-y-hidden scroll-smooth gap-3 sm:gap-10 snap-x snap-mandatory scrollbar-hide"
                    >
                        {items
                            .filter((i: any) => !!i.url)
                            .map((item: any) => (
                                <Link
                                    key={item.id}
                                    href={`${linkPrefix}/${item.id}`}
                                    className="snap-center flex-shrink-0 w-[calc(50%-0.5rem)] sm:w-[400px]"
                                >
                                    <div className="p-4 hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                                        <div className="w-full h-[200px] sm:h-[380px] flex items-center justify-center">
                                            <img
                                                src={getTransformedImage(item.height, item.url ?? '')}
                                                alt={decodeURIComponent(item.name)}
                                                className="object-contain max-h-full max-w-full h-auto"
                                            />
                                        </div>
                                        <h2 className="text-center mt-2 text-[15px] sm:text-[17px] font-medium">
                                            {decodeURIComponent(item.name)}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-center text-gray-600">
                                            ความสูง {item.height} cm
                                        </p>
                                    </div>
                                </Link>
                            ))}
                    </div>

                    {/* Arrows (ซ่อนบนมือถือ) */}
                    <div className="hidden sm:block">
                        <ArrowButtonGroup
                            leftClick={leftClick}
                            rightClick={rightClick}
                            canLeft={canLeft}
                            canRight={canRight}
                        />
                    </div>
                </div>

                <div className="flex justify-center mt-8 mb-8">
                    <Link
                        href={linkPrefix}
                        className="px-6 py-2 border-2 border-green-900 text-green-900 rounded-full text-base sm:text-lg hover:bg-green-900 hover:text-white transition flex items-center justify-center"
                    >
                        See More
                    </Link>
                </div>
            </div>
        </section>
    );
}

/* 🖼️ Portfolio Section */
function PortfolioSection({ title, items, linkPrefix, scrollRef, leftClick, rightClick, canLeft, canRight }: any) {
    return (
        <section className="py-10 relative">
            <div className="container mx-auto px-4 sm:px-10 mt-10">
                <h2 className="text-[22px] sm:text-3xl font-semibold mb-6 text-left">{title}</h2>
                <div className="relative">
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto overflow-y-hidden scroll-smooth gap-3 sm:gap-6 snap-x snap-mandatory scrollbar-hide"
                    >
                        {items.map((port: any) => (
                            <Link
                                key={port.id}
                                href={`${linkPrefix}/${port.id}`}
                                className="snap-center flex-shrink-0 w-[calc(50%-0.5rem)] sm:w-[420px]"
                            >
                                <div className="overflow-hidden hover:shadow-lg transition-transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                                    <div className="w-full aspect-[4/3] overflow-hidden mb-2">
                                        <img
                                            src={port.image_cover}
                                            alt={decodeURIComponent(port.title)}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h2 className="text-base sm:text-lg font-semibold px-4">
                                        {decodeURIComponent(port.title)}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-gray-600 px-4 mb-2">
                                        {port.location}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Arrows (เฉพาะ Desktop) */}
                    <div className="hidden sm:block">
                        <ArrowButtonGroup
                            leftClick={leftClick}
                            rightClick={rightClick}
                            canLeft={canLeft}
                            canRight={canRight}
                        />
                    </div>
                </div>

                <div className="flex justify-center mt-12 mb-10">
                    <Link
                        href={linkPrefix}
                        className="px-6 py-2 border-2 border-green-900 text-green-900 rounded-full text-base sm:text-lg hover:bg-green-900 hover:text-white transition flex items-center justify-center"
                    >
                        See More
                    </Link>
                </div>
            </div>
        </section>
    );
}

/* 🔘 Arrow button group (Desktop only) */
function ArrowButtonGroup({ leftClick, rightClick, canLeft, canRight }: any) {
    return (
        <>
            <button
                onClick={leftClick}
                disabled={!canLeft}
                className={`absolute -left-1 sm:-left-3 top-1/2 -translate-y-1/2 z-10 
                    text-black transition-transform duration-200 ease-in-out
                    ${canLeft ? 'opacity-100' : 'opacity-30 cursor-default'}
                    scale-75 sm:scale-90 hover:scale-110 active:scale-110`}
            >
                <ArrowBackIosNewIcon fontSize="small" />
            </button>
            <button
                onClick={rightClick}
                disabled={!canRight}
                className={`absolute -right-1 sm:-right-3 top-1/2 -translate-y-1/2 z-10 
                    text-black transition-transform duration-200 ease-in-out
                    ${canRight ? 'opacity-100' : 'opacity-30 cursor-default'}
                    scale-75 sm:scale-90 hover:scale-110 active:scale-110`}
            >
                <ArrowForwardIosIcon fontSize="small" />
            </button>
        </>
    );
}
