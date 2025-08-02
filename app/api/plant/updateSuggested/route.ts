import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
 
  const { id, suggest_number } = await req.json();

  console.log("🔧 Update suggested plant with ID:", id, "to suggest number:", suggest_number);

  const { data: selectOldData, error: errSelectOldData } = await supabase
    .from('plant')
    .select('id')
    .eq('is_suggested', suggest_number)
    .single();

  if (errSelectOldData && errSelectOldData.code !== "PGRST116") {
    // ปล่อยผ่านเฉพาะกรณี "no rows found"
    console.error("Error selecting old data:", errSelectOldData);
    return NextResponse.json({ error: errSelectOldData.message }, { status: 400 });
  }

  // ✅ ถ้ามีต้นไม้อยู่ตำแหน่งนี้ก่อนหน้า → เคลียร์ก่อน
  if (selectOldData) {
    const { data: updateOldData, error: errUpdateOldData } = await supabase
      .from('plant')
      .update({ is_suggested: 0 })
      .eq('id', selectOldData.id)
      .single();

    if (errUpdateOldData) {
      console.error("Error updating old data:", errUpdateOldData);
      return NextResponse.json({ error: errUpdateOldData.message }, { status: 400 });
    }
  }

  // ✅ อัปเดต plant ใหม่ให้เข้าตำแหน่ง
  const { data, error } = await supabase
    .from('plant')
    .update({ is_suggested: suggest_number })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating plant data:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  console.log("🔧 Updated plant data:", data);
  return NextResponse.json(data);
}
