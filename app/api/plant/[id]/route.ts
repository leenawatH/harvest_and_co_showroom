import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  const { id } = await params

  const { data, error } = await supabase
    .from('plant')
    .select(`
          id,
          name,
          height,
          price,
          is_suggested,
          addition_img,
          similar_plant_ids,
          plant_pot_options (
             id,
             url,
             is_suggested,
             pot_id,
             pot_color,
             height_with_pot
          )
          `)
    .eq('id', id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = context.params;
  const body = await req.json();

  console.log("🔧 Updating plant with ID:", id, "Raw Data:", body);

  // ✅ อนุญาตเฉพาะ field ที่ database มีจริง
  const allowedFields = [
    'name',
    'price',
    'height',
    'similar_plant_ids',
    'addition_img',
    'is_suggested'
  ];

  const cleanData = Object.fromEntries(
    Object.entries(body).filter(([key]) => allowedFields.includes(key))
  );

  cleanData.similar_plant_ids = cleanData.similar_plant_ids ?? null;
  cleanData.addition_img = cleanData.addition_img ?? null;

  const { data, error } = await supabase
    .from('plant')
    .update(cleanData)
    .eq('id', id)
    .select();

  if (error) {
    console.error("🔥 Supabase error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  try {
    return NextResponse.json(data?.[0] ?? {});
  } catch (e) {
    console.error("❌ Failed to serialize:", e);
    return NextResponse.json({ error: "Serialization error" }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  const supabase = await createClient();
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("👉 Logged in user:", user); // ถ้าได้ null แสดงว่า cookie ไม่มา
  const { error } = await supabase
    .from("plant")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
