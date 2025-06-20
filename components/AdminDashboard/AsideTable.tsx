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
    <div className="h-screen flex overflow-hidden"> 
      {/* Sidebar */}
      <aside className="w-[200px] h-full border-r p-4 flex-shrink-0 bg-white">
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li
              key={item}
              className={`cursor-pointer ${
                item === activeTab ? "text-black font-bold" : "text-gray-500"
              } hover:text-black transition font-medium`}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </aside>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto pl-5">
        {activeTab === "Home Content" && (
          <div>
            <p className="text-gray-600">Welcome to Home Content</p>
          </div>
        )}
        {activeTab === "Plant" && <PlantTable plants={plants} pots={pots} />}
        {activeTab === "Pot" && <PotTable pots={pots} />}
        {activeTab === "Port" && (
          <div>
            <p className="text-gray-600">Port section coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}
