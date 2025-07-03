import { getBaseUrl } from '@/lib/helpers/getBaseUrl';
import { plant_pot_options } from '@/lib/types/types';

export async function getPlantPotOptionById(id: string): Promise<plant_pot_options[]> {
    
    const res = await fetch(`${getBaseUrl()}/api/plantWithPotOption/${id}`);
    if (!res.ok) throw new Error('Not found');
    return res.json();
}

