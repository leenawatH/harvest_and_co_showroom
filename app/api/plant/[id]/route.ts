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
          eng_name,
          height,
          width,
          price,
          is_suggested,
          addition_img,
          similar_plant,
          plant_pot_options (
             id,
             url,
             is_suggested,
             pot_id,
             pot_color,
             height_with_pot,
             price_with_pot
          ),
          plant_more_image(
            id,
            url),
          plant_review_pic(
            id,
            url)
          `)
    .eq('id', id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = await params;
  const body = await req.json();

  console.log("🔧 Updating plant with ID:", id, "Raw Data:", body);

  // ✅ อนุญาตเฉพาะ field ที่ database มีจริง
  const allowedFields = [
    'name',
    'eng_name',
    'price',
    'height',
    'width',
    'similar_plant',
    'addition_img',
    'is_suggested'
  ];

  const cleanData = Object.fromEntries(
    Object.entries(body).filter(([key]) => allowedFields.includes(key))
  );

  // cleanData.similar_plant_ids = cleanData.similar_plant_ids ?? null;
  // cleanData.addition_img = cleanData.addition_img ?? null;

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

  const { error: error1 } = await supabase
    .from("plant_more_image")
    .delete()
    .eq("plant_id", id);

  const { error: error2 } = await supabase
    .from("plant_review_pic")
    .delete()
    .eq("plant_id", id);
  
  const { error: error3 } = await supabase
    .from("plant_pot_options")
    .delete()
    .eq("plant_id", id);

  // ลบจาก plant
  const { error: error4 } = await supabase
    .from("plant")
    .delete()
    .eq("id", id);

  // ตรวจสอบข้อผิดพลาดทั้งสอง
  if (error1 || error2 || error3 || error4) {
    return NextResponse.json({ error: error1?.message || error2?.message || error3?.message || error4?.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
