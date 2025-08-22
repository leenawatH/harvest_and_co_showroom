import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  const { id } = await params

  const { data, error } = await supabase
    .from('port')
    .select(`
          id,
          title,
          location,
          description,
          image_cover,
          is_suggested,
          port_middle_sections (
             id,
             port_id,
             title,
             detail,
             image_url,
             position
          ),
          port_bottom_groups(
             id,
             port_id,
             pattern,
             image_url_1,
             image_url_2,
             image_url_3
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

  console.log("🔧 Updating port with ID:", id, "Raw Data:", body);

  // ✅ อนุญาตเฉพาะ field ที่ database มีจริง
  const allowedFields = [
    'title',
    'location',
    'image_cover',
    'description',
    'is_suggested',
  ];

  const cleanData = Object.fromEntries(
    Object.entries(body).filter(([key]) => allowedFields.includes(key))
  );

  // cleanData.similar_plant_ids = cleanData.similar_plant_ids ?? null;
  // cleanData.addition_img = cleanData.addition_img ?? null;

  const { data, error } = await supabase
    .from('port')
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
    .from("port_middle_sections")
    .delete()
    .eq("port_id", id);

  const { error: error2 } = await supabase
    .from("port_bottom_groups")
    .delete()
    .eq("port_id", id);

  const { error: error3 } = await supabase
    .from("port")
    .delete()
    .eq("id", id);

  // ตรวจสอบข้อผิดพลาดทั้งสอง
  if (error1 || error2 || error3) {
    return NextResponse.json({ error: error1?.message || error2?.message || error3?.message}, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
