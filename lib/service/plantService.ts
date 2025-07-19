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

// ✅ DELETE
export async function deletePlant(id: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/plant/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete plant');
}

//Plant_with_Pot
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



//Upload file to cloudinary
export async function uploadImage(file: File, path: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('path', path);

  const res = await fetch(`${getBaseUrl()}/api/cloudinary/upload-image`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  return data;
}

// Delete image from cloudinary
export async function deleteImage(publicId: string) {
  const res = await fetch(`${getBaseUrl()}/api/cloudinary/delete-image?public_id=${publicId}`, {
    method: 'DELETE',
  });

  const data = await res.json();
  if (res.ok) {
    console.log('Image deleted successfully:', data);
  } else {
    console.error('Error deleting image:', data.error);
  }
}

//Delete folder from cloudinary
export async function deleteFolder(folderName: string) {
  console.log('Deleting folder:', folderName);
  const res = await fetch(`${getBaseUrl()}/api/cloudinary/delete-folder?folderName=${folderName}`, {
    method: 'DELETE',
  });
  const data = await res.json();
if (res.ok) {
    console.log('Folder deleted successfully:', data);
  } else {
    console.error('Error deleting folder:', data.error);
  }
}
//Plant_with_Pot


