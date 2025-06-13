import { getAllFirstUrlPlantPic, getAllPlant } from '@/components/supabase/supabase';
import PlantFilterClient from './PotFilterClient';

export default async function Pot() {
  const plant = await getAllFirstUrlPlantPic();

  return <PlantFilterClient plants={plant} />;
}