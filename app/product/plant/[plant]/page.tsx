'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
interface AvailableColor {
  url: string;
  color: string;
}

interface WithPotImage {
  pot_id: string;
  height_with_pot: string;
  available_colors: AvailableColor[];
}

interface Plant {
  id: string;
  name: string;
  height: number;
  price: number;
  withpot_imgurl: WithPotImage[];
}

interface Color {
  color: string;
  url: string;
}

interface Pot {
  id: string;
  name: string;
  color: Color[];
  height: number;
  circumference: number;
  price: number;
}

export default function PlantDetail() {
  const params = useParams();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedPotId, setSelectedPotId] = useState<string | null>(null);
  const [heightWithSelectedPot, setheightWithSelectedPot] = useState<string | null>(null);
  const [availableColors, setAvailableColors] = useState<AvailableColor[] | null>(null);
  const [activeColor, setActiveColor] = useState<string | null>(null);

  const [plant, setPlant] = useState<Plant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pot, setPot] = useState<Pot[] | null>(null);


  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fetchDataPot = async (plantData: Plant) => {
      const potIds = plantData.withpot_imgurl.map((item) => item.pot_id);

      const { data: potData, error: potError } = await supabase
        .from('pot')
        .select()
        .in('id', potIds);

      if (potError) {
        setError(potError.message);
      } else {

        const orderedPot = potIds.map(id => potData.find(p => p.id === id)).filter(Boolean);
        setPot(orderedPot);

        const selectedPotImage = plantData.withpot_imgurl[0];
        setSelectedPotId(selectedPotImage.pot_id);
        setAvailableColors(selectedPotImage.available_colors);
        setImageUrl(selectedPotImage.available_colors?.[0]?.url || null);
        setheightWithSelectedPot(plantData.withpot_imgurl[0].height_with_pot);
      }

    };

    const fetchDataPlant = async () => {
      const slug = params?.plant as string;
      if (!slug) {
        setError('No Data');
        return;
      }

      const decodedName = decodeURIComponent(slug);

      const { data: plantData, error: plantError } = await supabase
        .from('plant')
        .select()
        .eq('name', decodedName)
        .single();

      if (plantError) setError(plantError.message);
      else {
        setPlant(plantData);
        console.log(plant);
        setImageUrl(plantData.withpot_imgurl?.[0]?.available_colors?.[0]?.url || null);
        fetchDataPot(plantData);


      }
    };

    fetchDataPlant();
  }, [params]);

  const handlePotClick = (potId: string) => {
    const selectedPot = pot?.find((item) => item.id === potId);
    setSelectedPotId(potId);

    if (selectedPot) {
      const selectedPotImage = plant?.withpot_imgurl.find(item => item.pot_id === potId);
      if (selectedPotImage) {
        setAvailableColors(selectedPotImage.available_colors);
        setImageUrl(selectedPotImage.available_colors?.[0]?.url || null);
        setheightWithSelectedPot(selectedPotImage.height_with_pot);
      }
    }
  };

  const handleColorChange = (colorUrl: string) => {
    setImageUrl(colorUrl);
    setActiveColor(colorUrl);
  };

  const getTransformedImageUrl = (): string => {
    if (!imageUrl || !plant) return imageUrl || "";


    if (plant.height <= 150 && plant.height >= 100) {
      return imageUrl.replace("/upload/", "/upload/c_crop,h_1000,g_south/");
    } else if (plant.height < 100) {
      return imageUrl.replace("/upload/", "/upload/c_crop,h_900,g_south/c_crop,w_600,h_600/");
    } else if (plant.height <= 200 && plant.height >= 150) {
      return imageUrl.replace("/upload/", "/upload/c_crop,h_1500,g_south/");
    }

    return imageUrl;
  };

  if (error) return <div className="p-6">No data</div>;
  if (!plant) return <div className="p-6">Loading...</div>;

  return (
    <main className="min-h-screen flex flex-col items-center mt-15 mb-20 px-10">
      <div className="w-full max-w-6xl flex flex-col px-5 md:flex-row gap-10 bg-white rounded-xl p-6">
        {/* LEFT: Product Info */}
        <div className="flex-1 flex flex-col justify-start mt-20 pt-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 mt-10">{plant.name.replace("-", " ")}</h1>
          <p className="text-lg font-semibold mb-4">
            ราคา: {plant.price?.toLocaleString()} บาท
          </p>
          <div className="mb-2">
            <span className="font-semibold">รายละเอียด:</span>
            <span className="ml-2 text-gray-700"> {/* เพิ่มรายละเอียดจริงตรงนี้ถ้ามี field */} - </span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">ขนาดต้นไม้:</span>
            <span className="ml-2 text-gray-700">H: {plant.height} cm</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">ขนาดรวมกระถาง:</span>
            <span className="ml-2 text-gray-700">H: {heightWithSelectedPot} cm</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">แบบกระถาง:</span>
            <span className="ml-2 text-gray-700">
              {pot?.find(p => p.id === selectedPotId)?.name || "-"}
            </span>
          </div>
          <div className="mb-4">
            <span className="font-semibold">สี:</span>
            <span className="ml-2 text-gray-700">
              {availableColors?.find(c => c.url === imageUrl)?.color || "-"}
            </span>
          </div>
          {/* เลือกกระถาง */}
          <div className="mb-4">
            <div className="font-semibold mb-1">เลือกแบบกระถาง:</div>
            <div className="flex gap-2 overflow-x-auto">
              {pot?.map((potItem) => (
                <div
                  key={potItem.id}
                  className={`flex flex-col items-center cursor-pointer border rounded-lg p-2 min-w-[60px] ${selectedPotId === potItem.id ? 'border-green-700 bg-green-50' : 'border-gray-200'}`}
                  onClick={() => handlePotClick(potItem.id)}
                >
                  {potItem.color?.[0]?.url ? (
                    <img src={potItem.color[0].url} alt={potItem.name} className="h-8 w-8 object-contain mb-1" />
                  ) : (
                    <div className="text-xs">No image</div>
                  )}
                  <span className="text-xs">{potItem.name}</span>
                </div>
              ))}
            </div>
          </div>
          {/* เลือกสี */}
          <div>
            <div className="font-semibold mb-1">เลือกสี:</div>
            <div className="flex gap-2">
              {availableColors?.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => handleColorChange(color.url)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${imageUrl === color.url ? 'border-green-700' : 'border-gray-300'} hover:opacity-70`}
                  style={{ backgroundColor: color.color.toLowerCase() }}
                  title={color.color}
                />
              ))}
            </div>
          </div>
        </div>
        {/* RIGHT: Product Image */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] aspect-[3/4] rounded-lg flex items-center justify-center mb-4 overflow-hidden">
            {imageUrl ? (
              <img
                src={getTransformedImageUrl()}
                alt={plant.name}
                className="w-full h-full object-contain object-bottom transition-transform duration-300"
              />
            ) : (
              <div className="text-gray-400">No image available</div>
            )}
          </div>
          {/* เลือกสีซ้ำตรงนี้ถ้าต้องการ */}
          <div className="flex gap-2 mt-2">
            {availableColors?.map((color, idx) => (
              <button
                key={idx}
                onClick={() => handleColorChange(color.url)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${imageUrl === color.url ? 'border-green-700' : 'border-gray-300'} hover:opacity-70`}
                style={{ backgroundColor: color.color.toLowerCase() }}
                title={color.color}
              />
            ))}
          </div>
        </div>
      </div>
      <section className="w-full max-w-6xl mx-auto mt-10 px-5">
        <h2 className="text-xl font-bold mb-4">Tips</h2>
        <ol className="list-decimal ml-6 space-y-2 text-gray-700">
          <li>ควรวางต้นไม้ในที่มีแสงรำไรหรือแสงธรรมชาติ เพื่อยืดอายุการใช้งานของต้นไม้ประดิษฐ์</li>
          <li>หมั่นเช็ดฝุ่นที่ใบและกระถางด้วยผ้าแห้งหรือผ้าชุบน้ำหมาดๆ เพื่อความสวยงาม</li>
          <li>หลีกเลี่ยงการวางใกล้เปลวไฟหรือความร้อนสูง</li>
          <li>สามารถเปลี่ยนกระถางหรือจัดวางใหม่ได้ตามสไตล์ที่ต้องการ</li>
        </ol>
      </section>
      <div className="w-full max-w-6xl flex flex-col px-5 md:flex-row gap-10 bg-white rounded-xl p-6">
        <div className="flex-1 flex flex-col items-center">
          <div className="flex flex-row gap-4 w-full justify-center">
            <div className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] aspect-[3/4] rounded-lg flex items-center justify-center mb-4 overflow-hidden">
              {imageUrl ? (
                <img
                  src={getTransformedImageUrl()}
                  alt={plant.name}
                  className="w-full h-full object-contain object-bottom transition-transform duration-300"
                />
              ) : (
                <div className="text-gray-400">No image available</div>
              )}
            </div>
            <div className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] aspect-[3/4] rounded-lg flex items-center justify-center mb-4 overflow-hidden">
              {imageUrl ? (
                <img
                  src={getTransformedImageUrl()}
                  alt={plant.name}
                  className="w-full h-full object-contain object-bottom transition-transform duration-300"
                />
              ) : (
                <div className="text-gray-400">No image available</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <section className="py-4 flex justify-center relative">
        <div className="container mx-auto px-10">
          <h1 className="text-[27px] font-semibold mt-10 text-left">Similar potted plants</h1>

          <div className="relative">
            <div className=" overflow-y-hidden scroll-smooth">
              <div className="flex md:gap-10 w-max max-w-full sm:px-2 md:px-1">

                <Link href={`/product/plant/`} className="flex-shrink-0 w-[50%] sm:w-1/2 md:w-[400px] block md:h-full md:mx-1.5">
                  <div className="rounded-3xl p-4 hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                    <div className="w-full max-w-[280px] sm:max-w-[360px] md:max-w-[460px] aspect-[3/4] rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={getTransformedImageUrl()}
                          alt={plant.name}
                          className="w-full h-full object-contain object-bottom transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-gray-400">No image available</div>
                      )}
                    </div>
                    <h2 className="flex items-center justify-center text-center mt-2">{plant.name.replace("-", " ")}</h2>
                    <p className="text-sm text-center text-gray-600">ความสูง {plant.height} cm</p>
                  </div>
                </Link>
                <Link href={`/product/plant/`} className="flex-shrink-0 w-[50%] sm:w-1/2 md:w-[400px] block md:h-full md:mx-1.5">
                  <div className="rounded-3xl p-4 hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                    <div className="w-full max-w-[280px] sm:max-w-[360px] md:max-w-[460px] aspect-[3/4] rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={getTransformedImageUrl()}
                          alt={plant.name}
                          className="w-full h-full object-contain object-bottom transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-gray-400">No image available</div>
                      )}
                    </div>
                    <h2 className="flex items-center justify-center text-center mt-2">{plant.name.replace("-", " ")}</h2>
                    <p className="text-sm text-center text-gray-600">ความสูง {plant.height} cm</p>
                  </div>
                </Link>
                <Link href={`/product/plant/`} className="flex-shrink-0 w-[50%] sm:w-1/2 md:w-[400px] block md:h-full md:mx-1.5">
                  <div className="rounded-3xl p-4 hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                    <div className="w-full max-w-[280px] sm:max-w-[360px] md:max-w-[460px] aspect-[3/4] rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={getTransformedImageUrl()}
                          alt={plant.name}
                          className="w-full h-full object-contain object-bottom transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-gray-400">No image available</div>
                      )}
                    </div>
                    <h2 className="flex items-center justify-center text-center mt-2">{plant.name.replace("-", " ")}</h2>
                    <p className="text-sm text-center text-gray-600">ความสูง {plant.height} cm</p>
                  </div>
                </Link>

              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
