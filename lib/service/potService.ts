import { getBaseUrl } from '@/lib/helpers/getBaseUrl';

export interface Pot {
  id?: string;
  name: string;
  color?: PotImageEachColor[]; 
  height?: number;
  circumference?: number;
  price?: number;
}

export interface PotImageEachColor {
    url? : string;
    color?: string;
}

// ✅ ดึงข้อมูลทั้งหมด
export async function getAllPots(): Promise<Pot[]> {
  const res = await fetch(`${getBaseUrl()}/api/pot`);
  if (!res.ok) throw new Error('Failed to fetch pot data');
  return res.json();
}

// ✅ ดึงข้อมูล ชื่อทุกรายการ
export async function getAllNamePotPic() {
    const pots = await getAllPots();

    const filteredPot = (pots || []).filter((item) => {
        const colorArray = Array.isArray(item.color) ? item.color : [];
        return (
            colorArray.length > 0 &&
            colorArray[0].url
        );
    }).sort((a, b) => a.name.localeCompare(b.name, 'th', { sensitivity: 'base' }));

    return filteredPot;
}

// ✅ ดึงข้อมูล รูปเเรกทุกรายการ
export async function getAllFirstUrlPotPic() {
    const pots = await getAllPots();

    const filteredPot = (pots || []).filter((item) => {
        const colorArray = Array.isArray(item.color) ? item.color : [];
        return (
            colorArray.length > 0 &&
            colorArray[0].url
        );
    }).sort((a, b) => a.name.localeCompare(b.name, 'th', { sensitivity: 'base' }));

    return filteredPot;
}

// ✅ ดึงข้อมูล 1 รายการ
export async function getPotById(id: string): Promise<Pot> {
  const res = await fetch(`${getBaseUrl()}/api/pot/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
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

