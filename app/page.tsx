import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();
  const { data: plant } = await supabase
    .from("plant")
    .select()

  return (
    <main className="grid grid-cols-2 gap-4 p-4">
      {plant?.map((item) => {
        const imageUrl = Array.isArray(item.withpot_imgurl)
          ? item.withpot_imgurl[0]?.available_colors[0]?.url
          : item.withpot_imgurl?.available_colors?.[0]?.url;

          const slug = encodeURIComponent(item.name.replace(/\s+/g, '-'));
          
        return (
          <Link key={item.id} href={`/${slug}`} className="block">
            <div className="bg-[#bebebd] rounded-xl p-4 shadow hover:shadow-md transition">
              <img src={imageUrl} alt={item.name} className="w-full h-48 object-contain mb-2" />
              <h2 className="text-lg font-bold">{item.name}</h2>
            </div>
          </Link>
        );
      })}
    </main>
  );
}
