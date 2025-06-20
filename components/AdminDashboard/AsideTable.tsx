"use client";

import { useState } from "react";

import { Plant } from "@/lib/service/plantService";
import { Pot } from "@/lib/service/potService";

import PlantTable from "@/components/AdminDashboard/Table/plantTable";
import PotTable from "@/components/AdminDashboard/Table/potTable";

const menuItems = ["Home Content", "Plant", "Pot", "Port"];

const dummyTableData = [
    { id: 1, name: "Seth Weber", status: "Completed", date: "2024-08-07", price: "$620.10" },
    { id: 2, name: "Connor Roberson", status: "Ongoing", date: "2024-05-11", price: "$120.10" },
    { id: 3, name: "Daniel Gibson", status: "Review", date: "2024-11-04", price: "$420.40" },
];

export default function AdminDashboard({ plants, pots }: { plants: Plant[], pots: Pot[] }) {
    const [activeTab, setActiveTab] = useState("Home Content");

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-[200px] border-r pr-4 mb-6">
                <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
                <ul className="space-y-4">
                    {menuItems.map((item) => (
                        <li
                            key={item}
                            className={`cursor-pointer ${item === activeTab ? "text-black font-bold" : "text-gray-500"
                                } hover:text-black transition font-medium`}
                            onClick={() => setActiveTab(item)}
                        >
                            {item}
                        </li>

                    ))}
                </ul>
            </aside>

            {/* Content Area */}
            <div className="flex-1 pl-10">

                {activeTab === "Home Content" && (
                    <div>
                        <p className="text-gray-600">Welcome to Home Content</p>
                    </div>
                )}

                {activeTab === "Plant" && <PlantTable plants={plants} />}
                {activeTab === "Pot" && <PotTable pots={pots} />}
                {activeTab === "Port" && (
                    <div>
                        <p className="text-gray-600">Port section coming soon...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
