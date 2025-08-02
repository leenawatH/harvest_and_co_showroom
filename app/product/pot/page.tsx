import { getAllSinglePotInCard } from '@/lib/service/potService';
import PlantFilterClient from '@/components/FilterClient/PotFilterClient';

export default async function Pot() {
  const pot = await getAllSinglePotInCard();

  return <PlantFilterClient pots={pot} />;
}