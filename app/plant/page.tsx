import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function Plant() {
  const supabase = await createClient();
  const { data: plant } = await supabase.from("plant").select();


  const filteredPlant = (plant || []).filter((item) => {
    const withpotArray = Array.isArray(item.withpot_imgurl) ? item.withpot_imgurl : [];
    return (
      withpotArray.length > 0 &&
      withpotArray[0].available_colors &&
      withpotArray[0].available_colors.length > 0 &&
      withpotArray[0].available_colors[0].url
    );
  }).sort((a, b) => a.name.localeCompare(b.name, 'th', { sensitivity: 'base' }));

  const getTransformedImageUrl = (height: number , imageUrl: string): string => {
    if (!imageUrl || !plant) return imageUrl || "";
  
  
    if (height <= 150 && height >= 100) {
      return imageUrl.replace("/upload/", "/upload/c_crop,h_1100,g_south/");
    }else if(height < 100){
      return imageUrl.replace("/upload/", "/upload/c_crop,h_800,g_south/");
    }else if(height <= 200 && height >= 150){
      return imageUrl.replace("/upload/", "/upload/c_crop,h_1500,g_south/");
    }else if(height > 200){
      return imageUrl.replace("/upload/", "/upload/c_crop,h_1600,g_south/");
    }
    return imageUrl;
  };

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
      {filteredPlant.map((item) => {
        const withpotArray = item.withpot_imgurl;
        const imageUrl = withpotArray[0].available_colors[0].url;
        const slug = encodeURIComponent(item.name);
        const name = item.name.replace("-", " ");

        return (
          <Link key={item.id} href={`/${slug}`} className="block h-full">
            <div className="rounded-xl p-4 shadow hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between">
              <img
                src={getTransformedImageUrl(item.height , imageUrl)}
                alt={item.name}
                className="w-full h-48 object-contain mb-2"
              />
              <h2 className="flex items-center justify-center text-center">{name}</h2> {/* สำคัญ */}
            </div>
          </Link>

        );
      })}
      </div>
    </main>
  );
}
