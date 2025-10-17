"use client";

import { useEffect, useState } from "react";
import { 
  SinglePlantWithPotInCard, 
  SinglePotInCard, 
  SinglePortInCard 
} from "@/lib/types/types";

import { getSuggestedPots, getAllSinglePotInCard } from "@/lib/service/potService";
import { getAllSinglePlantWithPotInCard, getSuggestedPlants } from "@/lib/service/plantService";
import { getAllSinglePortInCard, getSuggestedPorts } from "@/lib/service/portService";

import PlantTable from "@/components/AdminDashboard/Table/plantTable";
import PotTable from "@/components/AdminDashboard/Table/potTable";
import PortTable from "@/components/AdminDashboard/Table/portTable";
import HomeContent from "@/components/AdminDashboard/Table/homeContent";

import { CircularProgress } from '@mui/material';

const menuItems = ["Home Content", "Plant", "Pot", "Port"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Home Content");
  const [plants, setPlants] = useState<SinglePlantWithPotInCard[]>([]);
  const [pots, setPots] = useState<SinglePotInCard[]>([]);
  const [ports, setPorts] = useState<SinglePortInCard[]>([]);
  const [suggest_plant, setSuggestPlant] = useState<SinglePlantWithPotInCard[]>([]);
  const [suggest_pot, setSuggestPot] = useState<SinglePotInCard[]>([]);
  const [suggest_port, setSuggestPort] = useState<SinglePortInCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [fetchedPlants, fetchedSuggestPlant, fetchedPots, fetchedSuggestPot, fetchedPorts, fetchedSuggestPort] =
        await Promise.all([
          getAllSinglePlantWithPotInCard(),
          getSuggestedPlants(),
          getAllSinglePotInCard(),
          getSuggestedPots(),
          getAllSinglePortInCard(),
          getSuggestedPorts()
        ]);

      setPlants(fetchedPlants);
      setSuggestPlant(fetchedSuggestPlant);
      setPots(fetchedPots);
      setSuggestPot(fetchedSuggestPot);
      setPorts(fetchedPorts);
      setSuggestPort(fetchedSuggestPort);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 🧭 Sidebar (Desktop Only) */}
      <aside className="hidden md:flex md:flex-col w-[200px] h-full border-r p-4 bg-white">
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li
              key={item}
              className={`cursor-pointer ${
                item === activeTab
                  ? "text-black font-bold"
                  : "text-gray-500"
              } hover:text-black transition font-medium`}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </aside>

      {/* 📱 Topbar (Mobile Only) */}
      <div className="md:hidden bg-white border-b shadow-sm sticky top-0 z-20">
        <div className="flex justify-between items-center px-4 py-3">
          <h2 className="text-lg font-bold">Admin Dashboard</h2>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {menuItems.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 📄 Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:pl-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-[60vh]">
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
                suggest_port={suggest_port}
                ports={ports}
                refreshData={fetchData}
              />
            )}

            {activeTab === "Plant" && (
              <PlantTable plants={plants} refreshData={fetchData} />
            )}

            {activeTab === "Pot" && (
              <PotTable pots={pots} refreshData={fetchData} />
            )}

            {activeTab === "Port" && (
              <PortTable ports={ports} refreshData={fetchData} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
