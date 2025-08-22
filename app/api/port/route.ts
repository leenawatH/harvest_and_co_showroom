import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// ✅ GET: ดึงข้อมูลทั้งหมด
export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const onlySuggested = searchParams.get('is_suggested') === 'true';

  let query = (await supabase)
    .from('port')
    .select(`
      id,
      title,
      location,
      description,
      image_cover,
      is_suggested
    `);

  if (onlySuggested) {
    query = query.neq('is_suggested', 0);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// ✅ POST: เพิ่มข้อมูลใหม่
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  console.log("🔧 body : " + body);
  const { data, error } = await supabase.from('port').insert(body).select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data[0]);
}
