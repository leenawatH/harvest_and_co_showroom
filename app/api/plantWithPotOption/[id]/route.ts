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