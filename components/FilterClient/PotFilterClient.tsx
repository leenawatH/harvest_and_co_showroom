"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Box, Checkbox, FormControlLabel, Slider } from "@mui/material";
import { SinglePotInCard, Bucket } from "@/lib/types/types";
import { getTransformedImage } from "@/components/ImageUrl_Transformed";

const HEIGHT_BUCKETS: Bucket[] = [
    { label: "40-100", min: 40, max: 100 },
    { label: "100-130", min: 100, max: 130 },
    { label: "130-150", min: 130, max: 150 },
    { label: "150-170", min: 150, max: 170 },
    { label: "170-200", min: 170, max: 200 },
    { label: "200+", min: 200, max: Infinity },
];

const CIRCUMFERENCE_BUCKETS: Bucket[] = [
    { label: "20-40", min: 20, max: 40 },
    { label: "40-60", min: 40, max: 60 },
    { label: "60-80", min: 60, max: 80 },
    { label: "80-100", min: 80, max: 100 },
    { label: "100-120", min: 100, max: 120 },
    { label: "120+", min: 120, max: Infinity },
];

export default function PotFilterClient({ pots }: { pots: SinglePotInCard[] }) {


    const [selectedHeightLabels, setSelectedHeightLabels] = useState<string[]>([]);
    const selectedHeightSet = useMemo(() => new Set(selectedHeightLabels), [selectedHeightLabels]);

    const [selectedCircumferenceLabels, setSelectedCircumferenceLabels] = useState<string[]>([]);
    const selectedCircumferenceSet = useMemo(() => new Set(selectedCircumferenceLabels), [selectedCircumferenceLabels]);

    const [open, setOpen] = useState({
        height: false,
        circumference: false,
    });

    const toggleSection = (key: keyof typeof open) => {
        setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleHeightLabel = (label: string) => {
        setSelectedHeightLabels((prev) =>
            prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
        );
    };

    const toggleCircumferenceLabel = (label: string) => {
        setSelectedCircumferenceLabels((prev) =>
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

    const matchesSelectedCircumference = (w: number) => {
        if (selectedCircumferenceSet.size === 0) return true;
        return CIRCUMFERENCE_BUCKETS.some((b) => selectedCircumferenceSet.has(b.label) && inBucket(w, b));
    };

    const filteredPots = useMemo(
        () => pots.filter((p) => {
            return matchesSelectedHeights(p.height) && matchesSelectedCircumference(p.circumference);
        }),
        [pots, selectedHeightSet, selectedCircumferenceSet]
    );

    const getTransformedImageUrl = (height: number, imageUrl: string): string => {
        if (!pots) return "";
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
                        ความสูงกระถาง {open.height ? "−" : "+"}
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
                        onClick={() => toggleSection("circumference")}
                        className="w-full text-left border-b pb-3 font-medium"
                    >
                        เส้นรอบวงปากกระถาง {open.circumference ? "−" : "+"}
                    </button>
                    {open.circumference && (
                        <div className="pl-2 pt-2 space-y-1">
                            {CIRCUMFERENCE_BUCKETS.map((b) => (
                                <FormControlLabel
                                    key={b.label}
                                    control={
                                        <Checkbox
                                            sx={{ color: "gray", "&.Mui-checked": { color: "gray" } }}
                                            checked={selectedCircumferenceSet.has(b.label)}
                                            onChange={() => toggleCircumferenceLabel(b.label)}
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
                    {filteredPots.map((item) => {
                        if (!item.url) return null;
                        const imageUrl = item.url;
                        const name = item.name.replace("-", " ");
                        return (
                            <Link key={item.id} href={`/product/pot/${item.id}`} className="h-full">
                                <div className="w_[150px] hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                                    <img
                                        src={getTransformedImageUrl(item.height, imageUrl)}
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