import { getAllFirstUrlPotPic } from '@/lib/service/potService';
import PlantFilterClient from '@/components/FilterClient/PotFilterClient';

export default async function Pot() {
  const pot = await getAllFirstUrlPotPic();

  return <PlantFilterClient pots={pot} />;
}