import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// 🟢 GET: ดึงข้อมูลทั้งหมด
export async function GET() {
  const supabase = await createClient();
  const { data: plant, error } = await supabase
    .from("plant")
    .select()
    .order("name", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(plant);
}

// 🟡 POST: เพิ่ม plant ใหม่
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const { data, error } = await supabase.from('plant').insert(body).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data[0]);
}


// 🔵 PUT: แก้ไขข้อมูล plant เดียว
export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { id, ...updateData } = body;

  const { data, error } = await supabase.from('plant').update(updateData).eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data[0]);
}

// 🔴 DELETE: ลบ plant เดียว
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { id } = await req.json();

  const { error } = await supabase.from('plant').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
