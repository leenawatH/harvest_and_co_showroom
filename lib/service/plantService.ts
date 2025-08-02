import { getBaseUrl } from '@/lib/helpers/getBaseUrl';
import { Plant, plant_pot_options, SinglePlantWithPotInCard } from '@/lib/types/types';

export async function getAllPlant(): Promise<Plant[]> {
  const res = await fetch(`${getBaseUrl()}/api/plant`);
  if (!res.ok) throw new Error('Failed to fetch plant data');
  return res.json();
}

// ✅ ดึงข้อมูลทั้งหมด
export async function getAllSinglePlantWithPotInCard(): Promise<SinglePlantWithPotInCard[]> {
  const res = await fetch(`${getBaseUrl()}/api/plant`);
  if (!res.ok) throw new Error('Failed to fetch plant data');

  const data = await res.json();

  const result: SinglePlantWithPotInCard[] = data
    .map((item: any) => ({
      id: item.id,
      name: item.name,
      height: item.height,
      price: item.price,
      is_suggested: item.is_suggested,
      url: item.url,
    }))
    .sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name)); // ✅ sort ชื่อ A-Z

  return result;
}

// ✅ ดึงข้อมูล 1 รายการ
export async function getPlantById(id: string): Promise<Plant> {
  const res = await fetch(`${getBaseUrl()}/api/plant/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
}

// ✅ ดึงข้อมูล ที่ is_suggested = true
export async function getSuggestedPlants() {
  try {
    const res = await fetch(`${getBaseUrl()}/api/plant?is_suggested=true`);

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const data = await res.json();

    const result: SinglePlantWithPotInCard[] = data
      .map((item: any) => ({
        id: item.id,
        name: item.name,
        height: item.height,
        price: item.price,
        is_suggested: item.is_suggested,
        url: item.url,
      }))
      .sort((a: { is_suggested: number; }, b: { is_suggested: number; }) => a.is_suggested - b.is_suggested); // ✅ sort by is_suggested numerically
    return result;
  } catch (error) {
    console.error('❌ Error fetching suggested plants:', error);
    return [];
  }
}


// ✅ เพิ่มใหม่
export async function addPlant(data: Plant): Promise<Plant> {
  console.log("data" + data.name);
  const res = await fetch(`${getBaseUrl()}/api/plant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add plant');
  return res.json();
}

// ✅ UPDATE
export async function updatePlant(id: string, data: Partial<Plant>): Promise<Plant> {

  console.log("data" + data);
  //Edit plant Info
  const res = await fetch(`${getBaseUrl()}/api/plant/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update plant');
  return res.json();
}

// ✅ UPDATE Suggested Plant
export async function updateSuggestedPlant(id: string, suggest_number: number) {
    try {
        const response = await fetch('/api/plant/updateSuggested', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, suggest_number }),  // ส่ง id และ suggest_number ไป
        });

        console.log('Updated successfully:');
    } catch (error) {
        console.error('Error:', error);
    }
}

// ✅ DELETE
export async function deletePlant(id: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/plant/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete plant');
}

//New Plant_with_Pot
export async function addNewPlantPotOption(data: plant_pot_options): Promise<plant_pot_options> {

  const newData = { 
    pot_id : data.pot_id,
    plant_id : data.plant_id,
    pot_color: data.pot_color,
    height_with_pot: data.height_with_pot,
    is_suggested: data.is_suggested,
    url: data.url,
  };
  console.log("newData");
  console.log(newData);
  console.log(JSON.stringify(newData));
  
  const res = await fetch(`${getBaseUrl()}/api/plant_pot_options`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newData),
  });
  if (!res.ok) throw new Error('Failed to add plant');
  return res.json();
}

// ✅ UPDATE Plant Pot Option
export async function updatePlantPotOption(data: plant_pot_options): Promise<plant_pot_options> {
  console.log("data" + data);
  //Edit plant Info
  const res = await fetch(`${getBaseUrl()}/api/plant_pot_options/${data.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update plant');
  return res.json();
}

// ✅ DELETE Plant Pot Option
export async function deletePlantPotOption(id: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/plant_pot_options/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete plant');
}
