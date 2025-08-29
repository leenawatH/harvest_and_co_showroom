"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Box, Slider, Checkbox, FormControlLabel } from "@mui/material";
import { SinglePlantWithPotInCard , Bucket } from "@/lib/types/types";
import { getTransformedImage } from "@/components/ImageUrl_Transformed";

const HEIGHT_BUCKETS: Bucket[] = [
    { label: "40-100", min: 40, max: 100 },
    { label: "100-130", min: 100, max: 130 },
    { label: "130-150", min: 130, max: 150 },
    { label: "150-170", min: 150, max: 170 },
    { label: "170-200", min: 170, max: 200 },
    { label: "200+", min: 200, max: Infinity },
];

const WIDTH_BUCKETS: Bucket[] = [
    { label: "20-40", min: 20, max: 40 },
    { label: "40-60", min: 40, max: 60 },
    { label: "60-80", min: 60, max: 80 },
    { label: "80-100", min: 80, max: 100 },
    { label: "100-120", min: 100, max: 120 },
    { label: "120+", min: 120, max: Infinity },
];

export default function PlantFilterClient({ plants }: { plants: SinglePlantWithPotInCard[] }) {

    const [selectedHeightLabels, setSelectedHeightLabels] = useState<string[]>([]);
    const selectedHeightSet = useMemo(() => new Set(selectedHeightLabels), [selectedHeightLabels]);

    const [selectedWidthLabels, setSelectedWidthLabels] = useState<string[]>([]);
    const selectedWidthSet = useMemo(() => new Set(selectedWidthLabels), [selectedWidthLabels]);

    const [open, setOpen] = useState({
        height: false,
        width: false,
    });

    const toggleSection = (key: keyof typeof open) => {
        setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleHeightLabel = (label: string) => {
        setSelectedHeightLabels((prev) =>
            prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
        );
    };

    const toggleWidthLabel = (label: string) => {
        setSelectedWidthLabels((prev) =>
            prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
        );
    };

    const inBucket = (value: number, bucket: Bucket) => {
        if (bucket.max === Infinity) return value >= bucket.min;
        return value >= bucket.min && value <= bucket.max;
    };

    const matchesSelectedHeights = (h: number) => {
        if (selectedHeightSet.size === 0) return true;
        return HEIGHT_BUCKETS.some((b) => selectedHeightSet.has(b.label) && inBucket(h, b));
    };

    const matchesSelectedWidths = (w: number) => {
        if (selectedWidthSet.size === 0) return true;
        return WIDTH_BUCKETS.some((b) => selectedWidthSet.has(b.label) && inBucket(w, b));
    };

    const filteredPlants = useMemo(
        () => plants.filter((p) => {
            return matchesSelectedHeights(p.height) && matchesSelectedWidths(p.width);
        }),
        [plants, selectedHeightSet, selectedWidthSet]
    );

    const getTransformedImageUrl = (height: number, imageUrl: string): string => {
        if (!plants) return "";
        return getTransformedImage(height, imageUrl);
    }

    return (
        <main className="min-h-screen mt-20 mx-10 mb-10 px-5 py-6 flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-[180px] space-y-6 ml-4 mt-5">
                <h2 className="text-lg font-bold mb-1">Filter</h2>

                {/* Height */}
                <div>
                    <button
                        onClick={() => toggleSection("height")}
                        className="w-full text-left border-b pb-3 font-medium"
                    >
                        ความสูงต้นไม้ {open.height ? "−" : "+"}
                    </button>
                    {open.height && (
                        <div className="pl-2 pt-2 space-y-1">
                            {HEIGHT_BUCKETS.map((b) => (
                                <FormControlLabel
                                    key={b.label}
                                    control={
                                        <Checkbox
                                            sx={{ color: "gray", "&.Mui-checked": { color: "gray" } }}
                                            checked={selectedHeightSet.has(b.label)}
                                            onChange={() => toggleHeightLabel(b.label)}
                                        />
                                    }
                                    label={b.label}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Width */}
                <div>
                    <button
                        onClick={() => toggleSection("width")}
                        className="w-full text-left border-b pb-3 font-medium"
                    >
                        ความกว้างพุ่ม {open.width ? "−" : "+"}
                    </button>
                    {open.width && (
                        <div className="pl-2 pt-2 space-y-1">
                            {WIDTH_BUCKETS.map((b) => (
                                <FormControlLabel
                                    key={b.label}
                                    control={
                                        <Checkbox
                                            sx={{ color: "gray", "&.Mui-checked": { color: "gray" } }}
                                            checked={selectedWidthSet.has(b.label)}
                                            onChange={() => toggleWidthLabel(b.label)}
                                        />
                                    }
                                    label={b.label}
                                />
                            ))}
                        </div>
                    )}
                </div>


            </aside>
            {/* Product grid */}
            <section className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-10 ml-10">
                    {filteredPlants.map((item) => {
                        // ❌ ถ้าไม่มี URL ข้ามการ render ไปเลย

                        if (!item.url) return null;
                        console.log("Rendering plant item:", item);
                        const name = item.name.replace("-", " ");

                        return (
                            <Link key={item.id} href={`/product/plant/${item.id}`} className="h-full">
                                <div className="w_[150px] hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                                    <img
                                        src={getTransformedImageUrl(item.height, item.url)}
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