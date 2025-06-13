import React from "react";

const mockPots = [
    {
        id: 1,
        name: "Classic Terracotta Pot",
        size: "Medium",
        price: "$15",
        image: "/images/pots/terracotta.jpg",
    },
    {
        id: 2,
        name: "Modern Ceramic Planter",
        size: "Large",
        price: "$28",
        image: "/images/pots/ceramic.jpg",
    },
    {
        id: 3,
        name: "Minimalist Concrete Pot",
        size: "Small",
        price: "$12",
        image: "/images/pots/concrete.jpg",
    },
];

export default function PotCatalogPage() {
    return (
        <main className="max-w-4xl mx-auto p-8 mt-20 mb-20">
            <h1 className="text-3xl font-bold mb-6">Pot Catalog</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {mockPots.map((pot) => (
                    <div
                        key={pot.id}
                        className="border rounded-lg p-4 flex flex-col items-center shadow"
                    >
                        <img
                            src={pot.image}
                            alt={pot.name}
                            className="w-32 h-32 object-cover mb-4 rounded"
                        />
                        <h2 className="text-xl font-semibold">{pot.name}</h2>
                        <p className="text-gray-600">{pot.size}</p>
                        <p className="text-green-700 font-bold mt-2">{pot.price}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}