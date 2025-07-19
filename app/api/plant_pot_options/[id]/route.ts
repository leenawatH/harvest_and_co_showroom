import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    console.log('Fetching plant pot options for plant ID:', params.id);
    const supabase = await createClient();
    const { data, error } = await supabase.from('plant_pot_options').select('*').eq('plant_id', params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 404 });

    console.log('Fetched data:', data);

    return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { id_plant: string  , id_pot:  string} }) {
    const supabase = await createClient();
    const { id_plant , id_pot } = await params;
    const body = await req.json();
    console.log("🔧 Updating plant pot options with Plant ID : ", id_plant ,"and Pot id : ", id_pot , "Raw Data: ", body);

    // ✅ อนุญาตเฉพาะ field ที่ database มีจริง
    const allowedFields = [
        'url',
        'is_suggested',
        'pot_id',
        'pot_color',
        'height_with_pot'
    ];

    const cleanData = Object.fromEntries(
        Object.entries(body).filter(([key]) => allowedFields.includes(key))
    );

    const { data, error } = await supabase
        .from('plant_pot_options')
        .update(cleanData)
        .eq('plant_id', id_plant)
        .eq('pot_id', id_pot)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
}