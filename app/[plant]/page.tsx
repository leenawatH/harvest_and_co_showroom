import { createClient } from '@/utils/supabase/server';

export default async function Plant() {
  const supabase = await createClient();
  const { data: plant } = await supabase.from("plant").select();

  return <pre>{JSON.stringify(plant, null, 2)}</pre>
}