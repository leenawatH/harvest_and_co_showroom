"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Checkbox, FormControlLabel } from "@mui/material";
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
  const [selectedCircumferenceLabels, setSelectedCircumferenceLabels] = useState<string[]>([]);
  const [open, setOpen] = useState({ height: false, circumference: false });
  const [showFilterMobile, setShowFilterMobile] = useState(false);

  const selectedHeightSet = useMemo(() => new Set(selectedHeightLabels), [selectedHeightLabels]);
  const selectedCircumferenceSet = useMemo(() => new Set(selectedCircumferenceLabels), [selectedCircumferenceLabels]);

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
    () =>
      pots.filter(
        (p) => matchesSelectedHeights(p.height) && matchesSelectedCircumference(p.circumference)
      ),
    [pots, selectedHeightSet, selectedCircumferenceSet]
  );

  const getTransformedImageUrl = (height: number, imageUrl: string): string => {
    if (!pots) return "";
    return getTransformedImage(height, imageUrl);
  };

  return (
    <main className="min-h-screen mt-20 mx-4 sm:mx-10 mb-10 px-2 sm:px-5 py-6 flex flex-col lg:flex-row gap-8">
      {/* 🔹 Mobile Filter Toggle */}
      <div className="lg:hidden flex justify-between items-center mb-4 border-b pb-3">
        <h2 className="text-lg font-semibold">Filter</h2>
        <button
          onClick={() => setShowFilterMobile((prev) => !prev)}
          className="text-sm text-green-800 border border-green-800 px-3 py-1 rounded-full"
        >
          {showFilterMobile ? "Hide" : "Show"}
        </button>
      </div>

      {/* 🔹 Filter Section */}
      <aside
        className={`${
          showFilterMobile ? "block" : "hidden"
        } lg:block w-full lg:w-[200px] space-y-6 p-4 lg:p-0 lg:bg-transparent`}
      >
        <h2 className="text-lg font-bold mb-1 hidden lg:block">Filter</h2>

        {/* Height Filter */}
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

        {/* Circumference Filter */}
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

      {/* 🔹 Product Grid */}
      <section className="flex-1">
        {filteredPots.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            ไม่มีสินค้าที่ตรงกับเงื่อนไข
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10">
            {filteredPots.map((item) => {
              if (!item.url) return null;
              const imageUrl = item.url;
              const name = decodeURIComponent(item.name).replace("-", " ");
              return (
                <Link key={item.id} href={`/product/pot/${item.id}`} className="h-full">
                  <div className="rounded-2xl hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white p-2 sm:p-4">
                    <img
                      src={getTransformedImageUrl(item.height, imageUrl)}
                      alt={item.name}
                      className="w-full h-[220px] sm:h-[380px] object-contain mb-3 sm:mb-4"
                    />
                    <h2 className="text-center font-medium text-sm sm:text-base">{name}</h2>
                    <p className="text-center text-xs sm:text-sm text-gray-600 mt-1 mb-2">
                      ความสูง {item.height} cm • เส้นรอบวง {item.circumference} cm
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
