import { getBaseUrl } from '@/lib/helpers/getBaseUrl';
import { Pot , Pot_Img, SinglePotInCard } from '@/lib/types/types';

// ✅ ดึงข้อมูลทั้งหมด
export async function getAllPots(): Promise<Pot[]> {
  const res = await fetch(`${getBaseUrl()}/api/pot`);
  if (!res.ok) throw new Error('Failed to fetch pot data');
  return res.json();
}

// ✅ ดึงข้อมูล ชื่อทุกรายการ
export async function getAllSinglePotInCard(): Promise<SinglePotInCard[]> {
    const res = await fetch(`${getBaseUrl()}/api/pot`);
      if (!res.ok) throw new Error('Failed to fetch plant data');
    
      const data = await res.json();
    
      const result: SinglePotInCard[] = data
        .map((item: any) => ({
          id: item.id,
          name: item.name,
          height: item.height,
          price: item.price,
          circumference: item.circumference,
          url: item.url,
        }))
        .sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name)); // ✅ sort ชื่อ A-Z
    return result;
}

// ✅ ดึงข้อมูล 1 รายการ
export async function getPotById(id: string): Promise<Pot> {
  const res = await fetch(`${getBaseUrl()}/api/pot/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
}

// ✅ ดึงข้อมูล ที่ is_suggested = true
export async function getSuggestedPots() {
  try {
    const res = await fetch(`${getBaseUrl()}/api/pot?is_suggested=true`);

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const data = await res.json();

    const result: SinglePotInCard[] = data
      .map((item: any) => ({
        id: item.id,
        name: item.name,
        height: item.height,
        price: item.price,
        circumference: item.circumference,
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
export async function addPot(data: Pot): Promise<Pot> {
  const res = await fetch(`${getBaseUrl()}/api/pot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add pot');
  return res.json();
}

// ✅ UPDATE
export async function updatePot(id: string, data: Partial<Pot>): Promise<Pot> {
  const res = await fetch(`${getBaseUrl()}/api/pot/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update pot');
  return res.json();
}

// ✅ DELETE
export async function deletePot(id: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/pot/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete pot');
}

//New Pot_Color
export async function addNewPotColor(data: Pot_Img): Promise<Pot_Img> {

  const newData = { 
    pot_id : data.pot_id,
    pot_color: data.pot_color,
    url: data.url,
  };
  
  const res = await fetch(`${getBaseUrl()}/api/pot_colors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newData),
  });
  if (!res.ok) throw new Error('Failed to add pot color');
  return res.json();
}

// ✅ UPDATE Pot Color
export async function updatePotColor(data: Pot_Img): Promise<Pot_Img> {
  console.log("data" + data);
  //Edit plant Info
  const res = await fetch(`${getBaseUrl()}/api/pot_colors/${data.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update pot color');
  return res.json();
}

// ✅ DELETE Pot Color
export async function deletePotColor(id: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/pot_colors/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete plant');
}
