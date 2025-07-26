import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// ✅ GET: ดึงข้อมูลทั้งหมด
export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const onlySuggested = searchParams.get('is_suggested') === 'true';

  let query = (await supabase)
    .from('pot')
    .select(`
      id,
      name,
      height,
      price,
      circumference,
      is_suggested,
      onShow_color,
      pot_colors (
        id,
        url,
        pot_color
      )
    `);

  if (onlySuggested) {
    query = query.neq('is_suggested', 0);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

 // map ให้เหลือเฉพาะ cover_image ที่ is_suggested
  const result = data.map((pot: any) => {
    const cover = pot.pot_colors?.find((p: any) => p.pot_color == pot.onShow_color && p.url != null);
    return {
      id: pot.id,
      name: pot.name,
      height: pot.height,
      price: pot.price,
      circumference: pot.circumference,
      onShow_color: pot.onShow_color,
      is_suggested: pot.is_suggested,
      url: cover?.url,
    };
  });

  return NextResponse.json(result);
}

// ✅ POST: เพิ่มข้อมูลใหม่
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { data, error } = await supabase.from('pot').insert(body).select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data[0]);
}
