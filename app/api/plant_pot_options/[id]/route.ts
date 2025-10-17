import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest, { params }: any) {
    console.log('Fetching plant pot options for plant ID:', params.id);
    const supabase = await createClient();
    const { data, error } = await supabase.from('plant_pot_options').select('*').eq('plant_id', params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 404 });

    console.log('Fetched data:', data);

    return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: any) {
    const supabase = await createClient();
    const { id } = await params;
    const body = await req.json();
    console.log("🔧 Updating plant pot options with Plant ID : ", id , "Raw Data: ", body);

    // ✅ อนุญาตเฉพาะ field ที่ database มีจริง
    const allowedFields = [
        'url',
        'is_suggested',
        'pot_id',
        'pot_color',
        'height_with_pot',
        'price_with_pot'
    ];

    const cleanData = Object.fromEntries(
        Object.entries(body).filter(([key]) => allowedFields.includes(key))
    );

    const { data, error } = await supabase
        .from('plant_pot_options')
        .update(cleanData)
        .eq('id', id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }
  
  const { error } = await supabase
    .from("plant_pot_options")
    .delete()
    .eq("id", id);

  // ตรวจสอบข้อผิดพลาดทั้งสอง
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}