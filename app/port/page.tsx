import React from "react";

const portfolioItems = [
    {
        title: "Community Garden Project",
        description:
            "Our team volunteered to design and build a sustainable community garden, promoting urban agriculture and healthy living.",
        image: "https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893617/04_60_rkrlcx.jpg",
    },
    {
        title: "Local Art Exhibition",
        description:
            "We hosted an art exhibition featuring local artists, supporting creativity and cultural engagement in our neighborhood.",
        image: "https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893614/IMG_7820_vl1vlo.jpg",
    },
    {
        title: "Charity Bake Sale",
        description:
            "Organized a bake sale to raise funds for local charities, bringing together employees and the community for a good cause.",
        image: "https://res.cloudinary.com/dtppo2rxs/image/upload/v1747893614/IMG_2129_vzgqdk.jpg",
    },
];

export default function PortfolioPage() {
    return (
        <main className="max-w-4xl mx-auto py-12 px-4 mt-20 mb-20">
            <h1 className="text-3xl font-bold mb-8">
                Portfolio
            </h1>
            <div className="grid gap-8 md:grid-cols-2">
                {portfolioItems.map((item, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
                    >
                        <img
                            src={item.image}
                            alt={item.title}
                            className="h-48 w-full object-cover"
                        />
                        <div className="p-6 flex-1 flex flex-col">
                            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                            <p className="text-gray-700 flex-1">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}