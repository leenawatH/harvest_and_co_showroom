import { getBaseUrl } from '@/lib/helpers/getBaseUrl';
import { Plant, SinglePlantWithPotInCard } from '@/lib/types/types';

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
      id: item.plant_id,
      name: item.name,
      height: item.height,
      price: item.price,
      url: item.cover_image_url,
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

// ✅ เพิ่มใหม่
export async function addPlant(data: Plant): Promise<Plant> {
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
  const res = await fetch(`${getBaseUrl()}/api/plant/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update plant');
  return res.json();
}

// ✅ DELETE
export async function deletePlant(id: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/plant/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete plant');
}
