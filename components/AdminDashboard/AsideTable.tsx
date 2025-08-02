"use client";

import { useEffect, useState } from "react";

import { SinglePlantWithPotInCard, Pot, SinglePotInCard } from "@/lib/types/types";
import { getSuggestedPots, getAllSinglePotInCard } from "@/lib/service/potService";
import { getAllSinglePlantWithPotInCard, getSuggestedPlants } from "@/lib/service/plantService";

import PlantTable from "@/components/AdminDashboard/Table/plantTable";
import PotTable from "@/components/AdminDashboard/Table/potTable";
import HomeContent from "@/components/AdminDashboard/Table/homeContent";

import { CircularProgress } from '@mui/material';


const menuItems = ["Home Content", "Plant", "Pot", "Port"];

export default function AdminDashboard() {

  const [activeTab, setActiveTab] = useState("Home Content");
  const [plants, setPlants] = useState<SinglePlantWithPotInCard[]>([]);
  const [pots, setPots] = useState<SinglePotInCard[]>([]);
  const [suggest_plant, setSuggestPlant] = useState<SinglePlantWithPotInCard[]>([]);
  const [suggest_pot, setSuggestPot] = useState<SinglePotInCard[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true); // เริ่มการโหลดข้อมูล
    try {
      const fetchedPlants = await getAllSinglePlantWithPotInCard();
      const fetchedSuggestPlant = await getSuggestedPlants();
      const fetchedSuggestPot = await getSuggestedPots();
      const fetchedPots = await getAllSinglePotInCard();

      setPlants(fetchedPlants);
      setSuggestPlant(fetchedSuggestPlant);
      setSuggestPot(fetchedSuggestPot);
      setPots(fetchedPots);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);  // ข้อมูลโหลดเสร็จ
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[200px] h-full border-r p-4 flex-shrink-0 bg-white">
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

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto pl-5">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <CircularProgress />
          </div>
        ) : (
          <>
            {activeTab === "Home Content" && (
              <HomeContent
                suggest_plant={suggest_plant}
                plants={plants}
                suggest_pot={suggest_pot}
                pots={pots}
                refreshData={fetchData}
              />
            )}

            {activeTab === "Plant" && (
              <PlantTable
                plants={plants}
                refreshData={fetchData}
              />
            )}
            {activeTab === "Pot" && <PotTable pots={pots} setPots={setPots} />}
            {activeTab === "Port" && (
              <div>
                <p className="text-gray-600">Port section coming soon...</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}