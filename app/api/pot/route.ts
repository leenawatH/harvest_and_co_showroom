import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// ✅ GET: ดึงข้อมูลทั้งหมด
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('pot').select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
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
