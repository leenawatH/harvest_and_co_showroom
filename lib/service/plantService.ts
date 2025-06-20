import { getBaseUrl } from '@/lib/helpers/getBaseUrl';

export interface Plant {
    id: string; 
    name: string;
    height?: number;
    price?: number;
    withpot_imgurl?: PotAvailable[];
}

export interface PotAvailable {
    pot_id: string;
    height_with_pot?: string;
    available_colors?: Available_colors[];
}

export interface Available_colors {
    url: string;
    color: string;
}

// ✅ ดึงข้อมูลทั้งหมด
export async function getAllPlants(): Promise<Plant[]> {
    const res = await fetch(`${getBaseUrl()}/api/plant`);
    if (!res.ok) throw new Error('Failed to fetch plant data');
    return res.json();
}

// ✅ ดึงข้อมูล รูปเเรกทุกรายการ
export async function getAllFirstUrlPlantPic() {
    const plants = await getAllPlants();

    console.log('plants', plants);

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
