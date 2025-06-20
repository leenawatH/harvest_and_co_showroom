"use client";
import { useState } from "react";
import Link from "next/link";
import { Box, Slider } from "@mui/material";

export default function PotFilterClient({ pots }: { pots: any[] }) {

    const [open, setOpen] = useState({
        availability: false,
        collection: false,
        type: false,
        size: false,
        light: false,
    });

    const toggleSection = (key: keyof typeof open) => {
        setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    function valuetext(value: number, index: number): string {
        return `${value}"`;
    }

    const [valueSilde, setValueSilde] = useState<number[]>([20, 37]);

    function handleSlideChange(event: Event, newValue: number | number[], activeThumb: number): void {
        setValueSilde(Array.isArray(newValue) ? newValue : [newValue]);
    }

  


    return (
        <main className="min-h-screen mt-20 mx-10 mb-10 px-5 py-6 flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-[180px] space-y-6 ml-4 mt-5">
                <h2 className="text-lg font-bold mb-1">Filter</h2>

                {/* Availability */}
                <div>
                    <button
                        onClick={() => toggleSection('availability')}
                        className="w-full text-left border-b pb-3 font-medium"
                    >
                        Availability {open.availability ? '−' : '+'}
                    </button>
                    {open.availability && (
                        <div className="pl-2 pt-2 space-y-1">
                            <label className="block">
                                <input type="checkbox" className="mr-2" />
                                In stock
                            </label>
                            <label className="block">
                                <input type="checkbox" className="mr-2" />
                                Out of stock
                            </label>
                        </div>
                    )}
                </div>

                {/* pot Collection */}
                <div>
                    <button
                        onClick={() => toggleSection('collection')}
                        className="w-full text-left border-b pb-3 font-medium"
                    >
                        pot Collection {open.collection ? '−' : '+'}
                    </button>
                    {open.collection && (
                        <div className="pl-2 pt-2 space-y-1">
                            <label className="block">
                                <input type="checkbox" className="mr-2" />
                                Collection 1
                            </label>
                            <label className="block">
                                <input type="checkbox" className="mr-2" />
                                Collection 2
                            </label>
                        </div>
                    )}
                </div>

                {/* Size */}
                <div>
                    <button
                        onClick={() => toggleSection('size')}
                        className="w-full text-left border-b pb-3 font-medium"
                    >
                        Size {open.size ? '−' : '+'}
                    </button>
                    {open.size && (

                        <Box sx={{ width: 180, mr: 2 }}>
                            <Slider
                                getAriaLabel={() => 'Size range'}
                                value={valueSilde}
                                onChange={handleSlideChange}
                                valueLabelDisplay="auto"
                                getAriaValueText={valuetext}
                                sx={{
                                    color: 'black',
                                    '& .MuiSlider-thumb': {
                                        backgroundColor: 'black',
                                    },
                                    '& .MuiSlider-track': {
                                        backgroundColor: 'black',
                                    },
                                    '& .MuiSlider-rail': {
                                        backgroundColor: '#ccc',
                                    },
                                }}
                            />
                        </Box>
                    )}
                </div>
            </aside>
            {/* Product grid */}
            <section className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-10 ml-10">
                    {pots.map((item) => {
                        const potColorArray = item.color;
                        const imageUrl = potColorArray[0].url;
                        const slug = encodeURIComponent(item.name);
                        const name = item.name.replace("-", " ");
                        return (
                            <Link key={item.id} href={`/product/plant/${slug}`} className="h-full">
                                <div className="w_[150px] hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                                    <img
                                        src={imageUrl}
                                        alt={item.name}
                                        className="w-full h-[400px] object-contain mb-4"
                                    />
                                    <h2 className="text-center font-medium">{name}</h2>
                                    <p className="text-center text-sm text-gray-600 mt-1 mb-2">ความสูง {item.height} cm เส้นรอบวง {item.circumference} cm</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}