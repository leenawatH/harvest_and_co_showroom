import { getAllFirstUrlPlantPic, getAllPlant } from '@/components/supabase/supabase';
import PlantFilterClient from './PlantFilterClient';

export default async function Plant() {
  const plant = await getAllFirstUrlPlantPic();

  return <PlantFilterClient plants={plant} />;
}