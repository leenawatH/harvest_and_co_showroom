export const dynamic = "force-dynamic";

import { getAllSinglePlantWithPotInCard } from '@/lib/service/plantService';
import PlantFilterClient from '@/components/FilterClient/PlantFilterClient';

export default async function Plant() {
  const plant = await getAllSinglePlantWithPotInCard();

  return <PlantFilterClient plants={plant} />;
}