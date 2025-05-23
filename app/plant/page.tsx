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

  const getTransformedImageUrl = (height: number, imageUrl: string): string => {
    if (!imageUrl || !plant) return imageUrl || "";

    //return imageUrl.replace("/upload/", "/upload/c_crop,w_1220,h_1300,y_100/c_crop,g_center,w_1000,h_1000/");

    if (height <= 100) {
      return imageUrl.replace("/upload/", "/upload/c_crop,h_650,g_south,y_200/");
    } else if (height <= 120 && height > 100) {
      return imageUrl.replace("/upload/", "/upload/c_crop,h_800,g_south,y_200/");
    } else if (height <= 140 && height > 120) {
      return imageUrl.replace("/upload/", "/upload/c_crop,h_900,g_south,y_200/");
    } else if (height <= 150 && height > 140) {
      return imageUrl.replace("/upload/", "/upload/c_crop,h_1000,g_south,y_200/");
    } else if (height <= 180 && height > 150) {
      return imageUrl.replace("/upload/", "/upload/c_crop,h_1100,g_south,y_200/");
    } else if (height <= 200 && height > 180) {
      return imageUrl.replace("/upload/", "/upload/c_crop,h_1200,g_south,y_200/");
    } else if (height <= 220 && height > 200) {
      return imageUrl.replace("/upload/", "/upload/c_crop,h_1300,g_south,y_200/");
    }else if (height <= 240 && height > 220) {
      return imageUrl.replace("/upload/", "/upload/c_crop,h_1400,g_south,y_200/");
    }else{
      return imageUrl;
    }
 
  }

  return (
    <main className="min-h-screen mt-20 mx-10 px-5 py-6 flex flex-col lg:flex-row gap-8">
      {/* Filter sidebar (left) */}
      <aside className="w-full lg:w-[250px] space-y-6 ml-4">
        <h2 className="text-lg font-bold mb-1">Filter –</h2>
        <div className="space-y-3">
          <p className="border-b pb-5 pl-5">Availability +</p>
          <p className="border-b pb-5 pl-5">Plant Collection +</p>
          <p className="border-b pb-5 pl-5">Plant Type +</p>
          <p className="border-b pb-5 pl-5">Size +</p>
          <p className="border-b pb-5 pl-5">Light +</p>
        </div>
      </aside>

      {/* Product grid */}
      <section className="flex-1">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPlant.map((item) => {
            const withpotArray = item.withpot_imgurl;
            const imageUrl = withpotArray[0].available_colors[0].url;
            const slug = encodeURIComponent(item.name);
            const name = item.name.replace("-", " ");

            return (
              <Link key={item.id} href={`/${slug}`} className="block h-full">
                <div className="p-4 hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                  <img
                    src={getTransformedImageUrl(item.height, imageUrl)}
                    alt={item.name}
                    className="w-full h-[260px] object-contain mb-4"
                  />
                  <h2 className="text-center font-medium">{name}</h2>
                  <p className="text-center text-sm text-gray-600">ราคา {item.price} บาท</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>

  );
}
