import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { getAllSinglePlantWithPotInCard , getSuggestedPlants } from '@/lib/service/plantService';

import { getAllPots } from '@/lib/service/potService';

import AuthAutoSignOut from "@/components/AuthAutoSignOut/AuthAutoSignOut";
import AsideTable from "@/components/AdminDashboard/AsideTable";
import { SinglePlantWithPotInCard, Plant, Pot } from "@/lib/types/types";

export default async function Admin() {
  const supabase = await createClient();

  const plant: SinglePlantWithPotInCard[] = await getAllSinglePlantWithPotInCard();
  const suggest_plant: SinglePlantWithPotInCard[] = await getSuggestedPlants();
  const pot = await getAllPots();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="mt-20 px-[10%] py-6">
      <AuthAutoSignOut />
      <AsideTable plants={plant} suggest_plant={suggest_plant} pots={pot} />
      
    </div>
  );
}

