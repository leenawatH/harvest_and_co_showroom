import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();
  const { data: plant } = await supabase.from("plant").select();

  return (
    <main className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {plant?.map((item) => {
        console.log(item.withpot_imgurl[0])
        const withpotArray = Array.isArray(item.withpot_imgurl) ? item.withpot_imgurl : [];
        const imageUrl = withpotArray[0]?.available_colors?.[0]?.url || null;

        const slug = encodeURIComponent(item.name);
        const name = item.name.replace("-", " ");

        return (
          <Link key={item.id} href={`/${slug}`} className="block">
            <div className="rounded-xl p-4 shadow hover:shadow-lg transition transform hover:scale-105">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="w-full h-48 object-contain mb-2"
                />
              )}
              <h2 className="text-lg font-bold">{name}</h2>
            </div>
          </Link>
        );
      })}
    </main>
  );
}
