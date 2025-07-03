import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// ✅ GET: ดึงข้อมูลทั้งหมด
export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const onlySuggested = searchParams.get('is_suggested') === 'true';

  let query = (await supabase)
    .from('plant')
    .select(`
      id,
      name,
      height,
      price,
      is_suggested,
      plant_pot_options (
        url,
        is_suggested
      )
    `);

  if (onlySuggested) {
    query = query.eq('is_suggested', true);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // map ให้เหลือเฉพาะ cover_image ที่ is_suggested
  const result = data.map((plant: any) => {
    const cover = plant.plant_pot_options?.find((p: any) => p.is_suggested && p.url != null);
    return {
      plant_id: plant.id,
      name: plant.name,
      height: plant.height,
      price: plant.price,
      cover_image_url: cover?.url,
    };
  });

  return NextResponse.json(result);
}

// ✅ POST: เพิ่มข้อมูลใหม่
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const { data, error } = await supabase.from('plant').insert(body).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data[0]);
}
