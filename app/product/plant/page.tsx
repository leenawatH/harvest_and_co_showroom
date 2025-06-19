import { getAllFirstUrlPlantPic } from '@/lib/service/plantService';
import PlantFilterClient from '@/components/FilterClient/PlantFilterClient';

export default async function Plant() {
  const plant = await getAllFirstUrlPlantPic();

  return <PlantFilterClient plants={plant} />;
}