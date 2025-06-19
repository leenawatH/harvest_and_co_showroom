// app/api/pot/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET all pots
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('pot').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: add new pot
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const { data, error } = await supabase.from('pot').insert(body).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data[0]);
}

// PUT: update pot
export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { id, ...updateData } = body;

  const { data, error } = await supabase.from('pot').update(updateData).eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data[0]);
}

// DELETE: delete pot
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { id } = await req.json();

  const { error } = await supabase.from('pot').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
