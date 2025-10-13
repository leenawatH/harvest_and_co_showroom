import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    console.log('Fetching plant review pic for plant ID:', params.id);
    const supabase = await createClient();
    const { data, error } = await supabase.from('plant_review_pic').select('*').eq('plant_id', params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 404 });

    console.log('Fetched data:', data);

    return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { id } = await params;
    const body = await req.json();
    console.log("🔧 Updating plant review pic with Plant ID : ", id , "Raw Data: ", body);

    // ✅ อนุญาตเฉพาะ field ที่ database มีจริง
    const allowedFields = [
        'url',
    ];

    const cleanData = Object.fromEntries(
        Object.entries(body).filter(([key]) => allowedFields.includes(key))
    );

    const { data, error } = await supabase
        .from('plant_review_pic')
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
    .from("plant_review_pic")
    .delete()
    .eq("id", id);

  // ตรวจสอบข้อผิดพลาดทั้งสอง
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}