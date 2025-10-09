import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// ✅ POST: เพิ่มข้อมูลใหม่
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const { data, error } = await supabase.from('plant_more_image').insert(body).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data[0]);
}