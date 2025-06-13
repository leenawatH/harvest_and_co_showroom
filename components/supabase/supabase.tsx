import { createClient } from '@/utils/supabase/server';

async function getAllPlant() {
  const supabase = await createClient();
  const { data: plant, error } = await supabase
    .from("plant")
    .select()
    .order("name", { ascending: false });

  if (error) throw error;
  return plant;
}

async function getAllFirstUrlPlantPic() {
  const plants = await getAllPlant();

   const filteredPlant = (plants || []).filter((item) => {
    const withpotArray = Array.isArray(item.withpot_imgurl) ? item.withpot_imgurl : [];
    return (
      withpotArray.length > 0 &&
      withpotArray[0].available_colors &&
      withpotArray[0].available_colors.length > 0 &&
      withpotArray[0].available_colors[0].url
    );
  }).sort((a, b) => a.name.localeCompare(b.name, 'th', { sensitivity: 'base' }));

  return filteredPlant;
}


async function getAllPot() {
  const supabase = await createClient();
  const { data: pot, error } = await supabase
    .from("pot")
    .select()
    .order('name', { ascending: false });
    
  if (error) throw error;
  return pot;
}

export { getAllPlant , getAllPot , getAllFirstUrlPlantPic };
