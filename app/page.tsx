"use client";

import Image from 'next/image';
import Link from 'next/link';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import HorizontalScroll from '@/components/HorizontalScroll';
import { getTransformedImage } from '@/components/ImageUrl_Transformed';

import { topPickItems, potItems, bigTreeItems, portfolioItems } from '@/components/Homepage_data/data';
import { getSuggestedPlants } from '@/lib/service/plantService';
import { getSuggestedPots } from '@/lib/service/potService';
import { getSuggestedPorts } from '@/lib/service/portService';

import { SinglePlantWithPotInCard, SinglePortInCard, SinglePotInCard } from '@/lib/types/types';
import { useEffect, useState } from 'react';


export default function HomePage() {
    const [suggestedPlant, setSuggestedPlant] = useState<SinglePlantWithPotInCard[]>([]);
    const [suggestedPot, setSuggestedPot] = useState<SinglePotInCard[]>([]);
    const [suggestedPort, setSuggestedPort] = useState<SinglePortInCard[]>([]);


    const topPickScroll = HorizontalScroll(450);
    const potScroll = HorizontalScroll(450);
    const bigTreeScroll = HorizontalScroll(450);
    const portfolioScroll = HorizontalScroll(420 + 24);

    useEffect(() => {
        const fetchData = async () => {
            const plant = await getSuggestedPlants();
            const pot = await getSuggestedPots();
            const port = await getSuggestedPorts();
            setSuggestedPot(pot);
            setSuggestedPlant(plant);
            setSuggestedPort(port);
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen w-full items-center">
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
                <div className="container mx-auto px-10">
                    <h1 className="text-[27px] font-semibold mt-10 text-left">ต้นไม้ประดิษฐ์ พร้อมกระถาง</h1>
                    <p className="text-[17px] mt-1 mb-4 text-left">Artificial potted plants</p>

                    <div className="relative">
                        <div ref={topPickScroll.ref} className=" overflow-y-hidden scroll-smooth">
                            <div className="flex md:gap-10 w-max max-w-full sm:px-2 md:px-1">
                                {suggestedPlant
                                    .filter((plant) => !!plant.url)
                                    .map((plant) => (
                                        <Link
                                            key={plant.id}
                                            href={`/product/plant/${plant.name}`}
                                            className="flex-shrink-0 w-[50%] sm:w-1/2 md:w-[400px] block md:h-full md:mx-1.5"
                                        >
                                            <div className="rounded-3xl p-4 hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                                                <div className="w-full h-[250px] md:h-[380px] flex items-center justify-center">
                                                    <img
                                                        src={getTransformedImage(plant.height, plant.url ?? "")}
                                                        alt={decodeURIComponent(plant.name)}
                                                        className="object-contain max-h-full max-w-full h-auto"
                                                    />
                                                </div>
                                                <h2 className="flex items-center justify-center text-center mt-2">{decodeURIComponent(plant.name)}</h2>
                                                <p className="text-sm text-center text-gray-600">ความสูง {plant.height} cm</p>
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
                            href="/product/plant"
                            className="px-6 py-2 border-2 border-green-900 text-green-900 rounded-full text-lg hover:bg-green-900 hover:text-white transition flex items-center justify-center"
                        >
                            See More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Banner */}
            <section className="py-10">
                <div className="container mx-auto px-10">
                    <div className="relative h-[700px] w-full overflow-hidden">
                        <Image
                            src="/banner/banner.jpg"
                            alt="Pot Banner"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <h2 className="text-3xl text-white font-bold">กระถางต้นไม้</h2>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pot Section */}
            <section className="py-4 flex justify-center relative">
                <div className="container mx-auto px-10">
                    <h1 className="text-[27px] font-semibold mt-10 text-left">กระถางต้นไม้</h1>
                    <p className="text-[17px] mt-1 mb-4 text-left">Planters</p>
                    <div className="relative">
                        <div ref={potScroll.ref} className=" overflow-y-hidden scroll-smooth">
                            <div className="flex md:gap-10 w-max max-w-full sm:px-2 md:px-1">
                                 {suggestedPot
                                    .filter((pot) => !!pot.url)
                                    .map((pot) => (
                                    <Link key={pot.id} href={`/product/plant/${pot.name}`} className="flex-shrink-0 w-[50%] sm:w-1/2 md:w-[400px] block md:h-full md:mx-1.5">
                                        <div className="rounded-3xl p-4 hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                                            <div className="w-full h-[250px] md:h-[380px] flex items-center justify-center">
                                                <img
                                                    src={getTransformedImage(pot.height, pot.url ?? "")}
                                                    alt={decodeURIComponent(pot.name)}
                                                    className="object-contain max-h-full max-w-full h-auto"
                                                />
                                            </div>
                                            <h2 className="flex items-center justify-center text-center mt-2">{decodeURIComponent(pot.name)}</h2>
                                            <p className="text-sm text-center text-gray-600">ความสูง {pot.height} cm</p>
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
                        <Link
                            href="/product/pot"
                            className="px-6 py-2 border-2 border-green-900 text-green-900 rounded-full text-lg hover:bg-green-900 hover:text-white transition flex items-center justify-center"
                        >
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

            {/* Big Tree Section */}
            <section className="py-4 flex justify-center relative">
                <div className="container mx-auto px-10">
                    <h1 className="text-[27px] font-semibold mt-10 text-left">ต้นไม้ใหญ่</h1>
                    <p className="text-[17px] mt-1 mb-4 text-left">Big Tree</p>
                    <div className="relative">
                        <div ref={bigTreeScroll.ref} className=" overflow-y-hidden scroll-smooth">
                            <div className="flex md:gap-10 w-max max-w-full sm:px-2 md:px-1">
                                {bigTreeItems.map(([url, name, height], index) => (
                                    <Link key={index} href={`/plant/${name}`} className="flex-shrink-0 w-[50%] sm:w-1/2 md:w-[400px] block md:h-full md:mx-1.5">
                                        <div className="rounded-3xl p-4 hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                                            <div className="w-full h-[250px] md:h-[380px] flex items-center justify-center">
                                                <img
                                                    src={url}
                                                    alt={decodeURIComponent(name)}
                                                    className="object-contain max-h-full max-w-full h-auto"
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
                        <Link
                            href="/product/bigtree"
                            className="px-6 py-2 border-2 border-green-900 text-green-900 rounded-full text-lg hover:bg-green-900 hover:text-white transition flex items-center justify-center"
                        >
                            See More
                        </Link>
                    </div>
                </div>
            </section>

            {/* จัดสวน section */}
            <section className="w-full flex flex-col md:flex-row h-auto md:h-[500px] mb-10">
                {/* LEFT: TEXT (40%) */}
                <div className="w-full md:w-[45%] bg-black text-white flex items-center justify-center p-6 md:p-12 text-center md:text-left">
                    <div>
                        <h2 className="text-xl md:text-2xl tracking-widest mb-2">VERTICAL GARDEN</h2>
                        <h3 className="text-md md:text-xl mb-6">บริการจัดสวนแนวตั้งตกแต่งสถานที่</h3>
                        <p className="mb-3">
                            เพิ่มสีเขียวให้มุมโปรดของคุณ <br />
                            ทั้งภายในบ้าน และ นอกบ้าน
                        </p>
                        <p className="mb-3">
                            ด้วยสวนแนวตั้งในแบบฉบับของ Livingstyle
                        </p>
                        <p className="mb-6">
                            ในราคาเริ่มต้นเพียง 6,500 บาท ต่อ ตร.ม.
                        </p>
                        <Link href="/product/garden" className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition flex items-center justify-center">
                            SEE MORE
                        </Link>
                    </div>
                </div>

                {/* RIGHT: IMAGE (60%) */}
                <div className="w-full md:w-[55%] h-[350px] md:h-full relative">
                    <img
                        src="https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg"
                        alt="Vertical Garden"
                        className="object-cover w-full h-full"
                    />
                </div>
            </section>

            {/* Banner */}
            <section className="py-10">
                <div className="container mx-auto px-10">
                    <div className="relative h-[700px] w-full overflow-hidden">
                        <Image
                            src="/banner/banner.jpg"
                            alt="Pot Banner"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <h2 className="text-3xl text-white font-bold">Portfolio</h2>
                        </div>
                    </div>
                </div>
            </section>

            {/* Portfolio Section */}
            <section className="py-10 relative">
                <div className="container mx-auto px-10 mt-10">
                    <h2 className="text-3xl font-semibold mb-6 text-left">Portfolio</h2>
                    <div className="relative">
                        <div
                            ref={portfolioScroll.ref}
                            className="overflow-y-hidden scroll-smooth"
                        >
                            <div className="flex gap-6 min-w-max">
                                {suggestedPort.map((port , index) => (
                                    <Link key={decodeURIComponent(port.title)} href={`/port/${port.id}`} className="flex-shrink-0 w-[0px] md:w-[420px]">
                                        <div className="overflow-hidden hover:shadow-lg transition-transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                                            <div className="w-full aspect-[3/2] overflow-hidden mb-2">
                                                <img
                                                    src={port.image_cover}
                                                    alt={decodeURIComponent(port.title)}
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>
                                            <h2 className="text-lg font-semibold px-4">{decodeURIComponent(port.title)}</h2>
                                            <p className="text-sm text-gray-600 px-4 mb-2">{port.location}</p>
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