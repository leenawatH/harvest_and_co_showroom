import { getBaseUrl } from '@/lib/helpers/getBaseUrl';
import { Port , Port_Middle_Sections, Port_Bottom_Groups , SinglePortInCard } from '@/lib/types/types';
import { Description } from '@mui/icons-material';

export async function getAllPort(): Promise<Port[]> {
  const res = await fetch(`${getBaseUrl()}/api/port`);
  if (!res.ok) throw new Error('Failed to fetch port data');
  return res.json();
}

// ✅ ดึงข้อมูลทั้งหมด
export async function getAllSinglePortInCard(): Promise<SinglePortInCard[]> {
  const res = await fetch(`${getBaseUrl()}/api/port`);
  if (!res.ok) throw new Error('Failed to fetch port data');

  const data = await res.json();

  const result: SinglePortInCard[] = data
    .map((item: any) => ({
      id: item.id,
      title: item.title,
      location: item.location,
      image_cover: item.image_cover,
      is_suggested: item.is_suggested,
    }))
    .sort((a: { title: string; }, b: { title: string; }) => a.title.localeCompare(b.title)); // ✅ sort ชื่อ A-Z

  return result;
}

// ✅ ดึงข้อมูล 1 รายการ
export async function getPortById(id: string): Promise<Port> {
  const res = await fetch(`${getBaseUrl()}/api/port/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
}

// ✅ ดึงข้อมูล ที่ is_suggested = true
export async function getSuggestedPorts() {
  try {
    const res = await fetch(`${getBaseUrl()}/api/port?is_suggested=true`);

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const data = await res.json();

    const result: Port[] = data
      .map((item: any) => ({
        id: item.id,
        title: item.title,
        location: item.location,
        image_cover: item.image_cover,
        description: item.description,
        is_suggested: item.is_suggested,
      }))
      .sort((a: { is_suggested: number; }, b: { is_suggested: number; }) => a.is_suggested - b.is_suggested); // ✅ sort by is_suggested numerically
    return result;
  } catch (error) {
    console.error('❌ Error fetching suggested ports:', error);
    return [];
  }
}


// ✅ เพิ่มใหม่
export async function addNewPort(data: Port): Promise<Port> {
  const newData = { 
    //id : data.id,
    title : data.title,
    location: data.location,
    image_cover: data.image_cover,
    description: data.description,
    similar_port: data.similar_port,
  };
  const res = await fetch(`${getBaseUrl()}/api/port`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newData),
  });
  if (!res.ok) throw new Error('Failed to add port');
  return res.json();
}

// ✅ UPDATE
export async function updatePort(id: string, data: Partial<Port>): Promise<Port> {

  console.log("data" + data);
  //Edit port Info
  const res = await fetch(`${getBaseUrl()}/api/port/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update port');
  return res.json();
}

// ✅ UPDATE Suggested port
export async function updateSuggestedPort(id: string, suggest_number: number) {
    try {
        const response = await fetch('/api/port/updateSuggested', {
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
export async function deletePort(id: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/port/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete port');
}
//New Middle Section
export async function addNewPortMiddleSections(data: Port_Middle_Sections): Promise<Port_Middle_Sections> {

  const newData = { 
    //id : data.id,
    port_id : data.port_id,
    title : data.title,
    detail: data.detail,
    image_url: data.image_url,
    position: data.position,
  };
  
  const res = await fetch(`${getBaseUrl()}/api/port_middle_sections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newData),
  });
  if (!res.ok) throw new Error('Failed to add port');
  return res.json();
}

// ✅ UPDATE Middle Section
export async function updatePortMiddleSections(data: Port_Middle_Sections): Promise<Port_Middle_Sections> {
  //Edit port Info
  const res = await fetch(`${getBaseUrl()}/api/port_middle_sections/${data.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update port');
  return res.json();
}

// ✅ DELETE Middle Section
export async function deletePortMiddleSections(id: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/port_middle_sections/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete port');
}

//New Bottom Group
export async function addNewPortBottomGroups(data: Port_Bottom_Groups): Promise<Port_Bottom_Groups> {

  const newData = { 
    //id : data.id,
    pattern : data.pattern,
    port_id : data.port_id,
    image_url_1: data.image_url_1,
    image_url_2: data.image_url_2,
    image_url_3: data.image_url_3,
  };
  
  const res = await fetch(`${getBaseUrl()}/api/port_bottom_groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newData),
  });
  if (!res.ok) throw new Error('Failed to add port');
  return res.json();
}

// ✅ UPDATE Bottom Group
export async function updatePortBottomGroups(data: Port_Bottom_Groups): Promise<Port_Bottom_Groups> {
  console.log("data" + data);
  //Edit port Info
  const res = await fetch(`${getBaseUrl()}/api/port_bottom_groups/${data.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update port');
  return res.json();
}

// ✅ DELETE Bottom Group
export async function deletePortBottomGroups(id: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/port_bottom_groups/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete port');
}

