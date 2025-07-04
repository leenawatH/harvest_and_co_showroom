"use client";
import { useState } from "react";
import Link from "next/link";
import { Box, Slider, Checkbox, FormControlLabel } from "@mui/material";
import { SinglePlantWithPotInCard } from "@/lib/types/types";

export default function PlantFilterClient({ plants }: { plants: SinglePlantWithPotInCard[] }) {

    const [open, setOpen] = useState({
        availability: false,
        collection: false,
        type: false,
        price: false,
        height: false,
        light: false,
    });

    const toggleSection = (key: keyof typeof open) => {
        setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    function valuetext(value: number, index: number): string {
        return `${value}"`;
    }
    const [valuePriceSilde, setPriceValueSilde] = useState<number[]>([500, 15000]);

    function handlePriceSlideChange(event: Event, newValue: number | number[]) {
        setPriceValueSilde(Array.isArray(newValue) ? newValue : [newValue]);
    }

    const [valueHeightSilde, setHeightValueSilde] = useState<number[]>([20, 37]);

    function handleHeightSlideChange(event: Event, newValue: number | number[], activeThumb: number): void {
        setHeightValueSilde(Array.isArray(newValue) ? newValue : [newValue]);
    }

    const getTransformedImageUrl = (height: number, imageUrl: string): string => {
        if (!imageUrl || !plants) return imageUrl || "";

        //return imageUrl.replace("/upload/", "/upload/c_crop,w_1220,h_1300,y_100/c_crop,g_center,w_1000,h_1000/");

        if (height <= 100) {
            return imageUrl.replace("/upload/", "/upload/c_crop,h_650,g_south,y_200/");
        } else if (height <= 120 && height > 100) {
            return imageUrl.replace("/upload/", "/upload/c_crop,h_800,g_south,y_200/");
        } else if (height <= 140 && height > 120) {
            return imageUrl.replace("/upload/", "/upload/c_crop,h_900,g_south,y_200/");
        } else if (height <= 150 && height > 140) {
            return imageUrl.replace("/upload/", "/upload/c_crop,h_1000,g_south,y_200/");
        } else if (height <= 180 && height > 150) {
            return imageUrl.replace("/upload/", "/upload/c_crop,h_1100,g_south,y_200/");
        } else if (height <= 200 && height > 180) {
            return imageUrl.replace("/upload/", "/upload/c_crop,h_1200,g_south,y_200/");
        } else if (height <= 220 && height > 200) {
            return imageUrl.replace("/upload/", "/upload/c_crop,h_1300,g_south,y_200/");
        } else if (height <= 240 && height > 220) {
            return imageUrl.replace("/upload/", "/upload/c_crop,h_1400,g_south,y_200/");
        } else {
            return imageUrl;
        }

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
                            <FormControlLabel
                                control={<Checkbox sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />}
                                label="In stock"
                            />
                            <FormControlLabel
                                control={<Checkbox sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />}
                                label="Out of stock"
                            />
                        </div>
                    )}
                </div>

                {/* Price */}
                <div>
                    <button
                        onClick={() => toggleSection('price')}
                        className="w-full text-left border-b pb-3 font-medium"
                    >
                        Price {open.price ? '−' : '+'}
                    </button>
                    {open.price && (
                        <Box
                            sx={{
                                p: 2,
                                mt: 2,
                                width: '100%',
                                maxWidth: 220,
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <span>{valuePriceSilde[0]} ฿</span>
                                <span>{valuePriceSilde[1]} ฿</span>
                            </Box>
                            <Slider
                                getAriaLabel={() => 'Price range'}
                                value={valuePriceSilde}
                                onChange={handlePriceSlideChange}
                                valueLabelDisplay="auto"
                                min={500}
                                max={15000}
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


                {/* Plant Collection */}
                <div>
                    <button
                        onClick={() => toggleSection('collection')}
                        className="w-full text-left border-b pb-3 font-medium"
                    >
                        Plant Collection {open.collection ? '−' : '+'}
                    </button>
                    {open.collection && (
                        <div className="pl-2 pt-2 space-y-1">
                            <FormControlLabel
                                control={<Checkbox sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />}
                                label="Collection 1"
                            />
                            <FormControlLabel
                                control={<Checkbox sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />}
                                label="Collection 2"
                            />
                        </div>
                    )}
                </div>

                {/* Height */}
                <div>
                    <button
                        onClick={() => toggleSection('height')}
                        className="w-full text-left border-b pb-3 font-medium"
                    >
                        Height {open.height ? '−' : '+'}
                    </button>
                    {open.height && (
                        <Box
                            sx={{
                                p: 2,
                                mt: 2,
                                width: '100%',
                                maxWidth: 220,
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <span>{valueHeightSilde[0]} cm</span>
                                <span>{valueHeightSilde[1]} cm</span>
                            </Box>
                            <Slider
                                getAriaLabel={() => 'Size range'}
                                value={valueHeightSilde}
                                onChange={handleHeightSlideChange}
                                valueLabelDisplay="auto"
                                min={20}
                                max={250}
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
                    {plants.map((item) => {
                        // ❌ ถ้าไม่มี URL ข้ามการ render ไปเลย
                        if (!item.url) return null;

                        const imageUrl = item.url;
                        const slug = encodeURIComponent(item.name);
                        const name = item.name.replace("-", " ");

                        return (
                            <Link key={item.id} href={`/product/plant/${slug}`} className="h-full">
                                <div className="w_[150px] hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                                    <img
                                        src={getTransformedImageUrl(item.height, imageUrl)}
                                        alt={item.name}
                                        className="w-full h-[400px] object-contain mb-4"
                                    />
                                    <h2 className="text-center font-medium">{name}</h2>
                                    <p className="text-center text-sm text-gray-600 mt-1 mb-2">
                                        ความสูง {item.height} cm
                                    </p>
                                </div>
                            </Link>
                        );
                    })}

                </div>
            </section>
        </main>
    );
}