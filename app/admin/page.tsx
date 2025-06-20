import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { getAllPlants } from '@/lib/service/plantService';
import { getAllPots } from '@/lib/service/potService';

import AuthAutoSignOut from "@/components/AuthAutoSignOut/AuthAutoSignOut";
import AsideTable from "@/components/AdminDashboard/AsideTable";

export default async function Admin() {
  const supabase = await createClient();

  const plant = await getAllPlants();
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
      <AsideTable plants={plant} pots={pot} />
      
    </div>
  );
}

