import { getBaseUrl } from '@/lib/helpers/getBaseUrl';

export interface Pot {
  id?: string;
  name: string;
  color?: Image[]; 
  height?: number;
  circumference?: number;
  price?: number;
}

export interface Image {
    url? : string;
    color?: string;
}

// ✅ ดึงข้อมูลทั้งหมด
export async function getAllPots(): Promise<Pot[]> {
  const res = await fetch(`${getBaseUrl()}/api/pot`);
  if (!res.ok) throw new Error('Failed to fetch pot data');
  return res.json();
}

// ✅ ดึงข้อมูล รูปเเรกทุกรายการ
export async function getAllFirstUrlPotPic() {
    const plants = await getAllPots();

    console.log('plants', plants);

    const filteredPlant = (plants || []).filter((item) => {
        const colorArray = Array.isArray(item.color) ? item.color : [];
        return (
            colorArray.length > 0 &&
            colorArray[0].url
        );
    }).sort((a, b) => a.name.localeCompare(b.name, 'th', { sensitivity: 'base' }));

    return filteredPlant;
}

// ✅ เพิ่มใหม่
export async function addPot(data: Pot): Promise<Pot> {
  const res = await fetch('/api/pot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add pot');
  return res.json();
}

// ✅ แก้ไข 1 รายการ
export async function updatePot(data: Pot): Promise<Pot> {
  if (!data.id) throw new Error('Missing id for update');
  const res = await fetch('/api/pot', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update pot');
  return res.json();
}

// ✅ ลบ 1 รายการ
export async function deletePot(id: string): Promise<void> {
  const res = await fetch('/api/pot', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Failed to delete pot');
}

