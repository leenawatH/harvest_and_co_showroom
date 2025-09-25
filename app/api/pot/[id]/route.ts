import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  const { id } = await params

  const { data, error } = await supabase
    .from('pot')
    .select(`
          id,
          name,
          height,
          price,
          circumference,
          onShow_color,
          is_suggested,
          addition_img,
          similar_pot,
          color_available,
          pot_colors (
             id,
             url,
             pot_id,
             pot_color
          )
          `)
    .eq('id', id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = await params;
  const body = await req.json();

  console.log("🔧 Updating pot with ID:", id, "Raw Data:", body);

  // ✅ อนุญาตเฉพาะ field ที่ database มีจริง
  const allowedFields = [
    'name',
    'price',
    'height',
    'circumference',
    'onShow_color',
    'similar_plant',
    'addition_img',
    'is_suggested',
    'color_available',
  ];

  const cleanData = Object.fromEntries(
    Object.entries(body).filter(([key]) => allowedFields.includes(key))
  );

  // cleanData.similar_plant_ids = cleanData.similar_plant_ids ?? null;
  // cleanData.addition_img = cleanData.addition_img ?? null;

  const { data, error } = await supabase
    .from('pot')
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
  
  const { error: error1 } = await supabase
    .from("pot_colors")
    .delete()
    .eq("pot_id", id);

  // ลบจาก plant
  const { error: error2 } = await supabase
    .from("pot")
    .delete()
    .eq("id", id);

  // ตรวจสอบข้อผิดพลาดทั้งสอง
  if (error1 || error2) {
    return NextResponse.json({ error: error1?.message || error2?.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
