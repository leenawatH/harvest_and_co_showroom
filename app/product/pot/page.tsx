import { getAllSinglePotInCard } from '@/lib/service/potService';
import PotFilterClient from '@/components/FilterClient/PotFilterClient';

export default async function Pot() {
  const pot = await getAllSinglePotInCard();

  return <PotFilterClient pots={pot} />;
}