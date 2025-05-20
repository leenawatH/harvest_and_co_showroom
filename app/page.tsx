import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();
  const { data: plant } = await supabase.from("plant").select();


  return (
    <main>
      
    </main>
  );
}
