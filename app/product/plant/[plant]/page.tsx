'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { Color, Plant, plant_pot_options } from '@/lib/types/types';
import { getPlantById } from '@/lib/service/plantService';
import { getPotById } from '@/lib/service/potService';
import { useLoading } from '@/components/LoadingProvider/LoadingProvider';

type ColorChip = { color: Color; url: string };

type PlantPot = {
  pot_id: string;
  pot_name?: string;
  height_with_pot: string;
  potHeight?: number;
  potCircumference?: number;
  colors: ColorChip[]; // รวมจาก plant_pot_options ของ pot_id นั้น (unique ตาม color)
};

type SimilarPlant = {
  id: string;
  name: string;
  height: number;
  url: string;
};

export default function PlantDetail() {
  const params = useParams();

  const [plant, setPlant] = useState<Plant | null>(null);
  const [plantPots, setPlantPots] = useState<PlantPot[]>([]);
  const [selectedPotId, setSelectedPotId] = useState<string | null>(null);
  const [selectedColorUrl, setSelectedColorUrl] = useState<string | null>(null);

  const [similar_plant, setSimilar_plant] = useState<SimilarPlant[]>([]);

  const [error, setError] = useState<string | null>(null);
  const { setLoading } = useLoading();

  // โหลดข้อมูล plant ตาม id, และ group options → PlantPot[]
  useEffect(() => {
    setLoading(true);
    const setUp = async () => {
      try {
        const id = params?.plant as string; // สมมติ dynamic route เป็น /product/plant/[plant]
        if (!id) {
          setError('No id provided');
          return;
        }

        const data = await getPlantById(id);
        setPlant(data);

        const grouped = await groupOptionsByPotId(data.plant_pot_options ?? []);

        const suggestedPotId =
          (data.plant_pot_options ?? []).find(o => Boolean(o.is_suggested))?.pot_id ?? null;

        grouped.sort((a, b) =>
          Number(b.pot_id === suggestedPotId) - Number(a.pot_id === suggestedPotId)
        );

        setPlantPots(grouped);


        if (grouped.length > 0) {
          setSelectedPotId(grouped[0].pot_id);
          setSelectedColorUrl(grouped[0].colors[0]?.url ?? null);
        }

        // ก่อนเริ่มโหลด similar ล้าง state เก่าไว้กันซ้อน
        setSimilar_plant([]);

        if (Array.isArray(data.similar_plant) && data.similar_plant.length) {
          const sims = await Promise.all(
            data.similar_plant.map(async (pid) => {
              try {
                return await getPlantById(pid);
              } catch {
                return null;
              }
            })
          );

          const simCards = sims
            .filter((p): p is Plant => !!p)
            .map((p) => ({
              id: p.id,
              name: p.name,
              height: p.height,
              url: p.plant_pot_options?.find((opt) => opt.is_suggested)?.url ?? '',
            }));

          // de-duplicate ตาม id กันรายการซ้ำ
          const unique = Array.from(new Map(simCards.map((s) => [s.id, s])).values());

          setSimilar_plant(unique);
        }

      } catch (e: any) {
        console.error(e);
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    setUp();
  }, [params]);

  // สร้างลิสต์ใหม่จาก plant_pot_options ให้เป็น PlantPot[]
  async function groupOptionsByPotId(options: plant_pot_options[]): Promise<PlantPot[]> {
    const map = new Map<string, PlantPot>();

    for (const opt of options) {
      const key = opt.pot_id;
      let potName = '';
      let height_With_Pot = '';
      let potHeight = 0;
      let potCircumference = 0;
      if (!map.has(key)) {
        // Await the pot name only once per pot_id
        try {
          const pot = await getPotById(key);
          potName = pot.name;
          potHeight = pot.height;
          potCircumference = pot.circumference;
          height_With_Pot = opt.height_with_pot ?? '';
        } catch {
          potName = '';
        }

        map.set(key, {
          pot_id: key,
          pot_name: potName,
          height_with_pot: height_With_Pot,
          potHeight: potHeight,
          potCircumference: potCircumference,
          colors: [],
        });
      }
      const group = map.get(key)!;

      // ดึงสี + url (unique ตาม color)
      const color = opt.pot_color as unknown as Color | undefined;
      const url = opt.url ?? '';
      if (color && url && !group.colors.some((c) => c.color === color)) {
        group.colors.push({ color, url });
      }


    }

    return Array.from(map.values());
  }

  // group ที่เลือก
  const selectedGroup = useMemo(
    () => plantPots.find((g) => g.pot_id === selectedPotId) ?? null,
    [plantPots, selectedPotId]
  );

  const availableColors = selectedGroup?.colors ?? [];
  const heightWithSelectedPot = selectedGroup?.height_with_pot ?? null;
  const imageUrl = selectedColorUrl;

  const handlePotClick = (potId: string) => {
    setSelectedPotId(potId);
    const g = plantPots.find((x) => x.pot_id === potId);
    setSelectedColorUrl(g?.colors[0]?.url ?? null);
  };

  const handleColorChange = (chip: ColorChip) => {
    setSelectedColorUrl(chip.url);
  };

  const colorToCss = (c: Color) => String(c); // enum ค่าเป็นชื่อสี css แล้ว: 'black' | 'white' | 'beige' | 'stone'

  // Cloudinary transform ตามความสูงพืช
  const getTransformedImageUrl = (Url: string): string => {
    if (!Url || !plant) return Url || '';
    if (plant.height <= 150 && plant.height >= 100) {
      return Url.replace('/upload/', '/upload/c_crop,h_1000,g_south/');
    } else if (plant.height < 100) {
      return Url.replace('/upload/', '/upload/c_crop,h_900,g_south/c_crop,w_600,h_600/');
    } else if (plant.height <= 200 && plant.height >= 150) {
      return Url.replace('/upload/', '/upload/c_crop,h_1500,g_south/');
    }
    return Url;
  };

  if (error || !plant) return <main className="min-h-screen flex items-center justify-center"> No data</main>;

  return (
    <main className="min-h-screen flex flex-col items-center mt-15 mb-20 px-10">
      <div className="w-full max-w-6xl flex flex-col px-5 md:flex-row gap-10 bg-white rounded-xl p-6">
        {/* LEFT: Product Info */}
        <div className="flex-1 flex flex-col justify-start mt-20 pt-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 mt-10">
            {plant.name?.replace('-', ' ')}
          </h1>

          <p className="mb-4">{plant.eng_name}</p>

          <p className="text-lg font-semibold mb-4">ราคา: {plant.price?.toLocaleString()} บาท</p>

          <div className="mb-2">
            <span className="font-semibold">ความสูงต้นไม้:</span>
            <span className="ml-2 text-gray-700">: {plant.height} cm</span>
          </div>

          <div className="mb-2">
            <span className="font-semibold">ความกว้างพุ่มไม้:</span>
            <span className="ml-2 text-gray-700">: {plant.width} cm</span>
          </div>

          <div className="mb-2">
            <span className="font-semibold">ความสูงรวมกระถาง:</span>
            <span className="ml-2 text-gray-700">: {selectedGroup?.height_with_pot ?? '-'} cm</span>
          </div>

          <div className="mb-2">
            <span className="font-semibold">แบบกระถาง:</span>
            <span className="ml-2 text-gray-700">{selectedGroup?.pot_name ?? '-'}</span>
          </div>
          
          <div className="mb-2">
            <span className="font-semibold">ขนาดกระถาง:</span>
            <span className="ml-2 text-gray-700">Ø{selectedGroup?.potCircumference ?? '-'}*H{selectedGroup?.potHeight ?? '-'} cm</span>
          </div>

          <div className="mb-2">
            <span className="font-semibold">สี:</span>
            <span className="ml-2 text-gray-700">
              {availableColors.find((c) => c.url === imageUrl)?.color ?? '-'}
            </span>
          </div>

          {/* เลือกกระถาง */}
          <div className="mb-4">
            <div className="font-semibold mb-1">เลือกแบบกระถาง:</div>
            <div className="flex gap-2 overflow-x-auto">
              {plantPots.map((g) => (
                <div
                  key={g.pot_id}
                  className={`flex flex-col items-center cursor-pointer border rounded-lg p-2 min-w-[60px] ${selectedPotId === g.pot_id ? 'border-green-700 bg-green-50' : 'border-gray-200'
                    }`}
                  onClick={() => handlePotClick(g.pot_id)}
                >
                  {/* ใช้รูปจากสีแรกของกระถางนั้น */}
                  {g.colors?.[0]?.url ? (
                    <img
                      src={g.colors[0].url}
                      alt={g.pot_id}
                      className="h-8 w-8 object-contain mb-1"
                    />
                  ) : (
                    <div className="text-xs">No image</div>
                  )}
                  <span className="text-xs">{g.pot_name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* เลือกสี */}
          <div>
            <div className="font-semibold mb-1">เลือกสี:</div>
            <div className="flex gap-2 flex-wrap">
              {availableColors.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleColorChange(chip)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${imageUrl === chip.url ? 'border-green-700' : 'border-gray-300'
                    } hover:opacity-70`}
                  style={{ backgroundColor: colorToCss(chip.color) }}
                  title={String(chip.color)}
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
                src={getTransformedImageUrl(imageUrl)}
                alt={plant.name}
                className="w-full h-full object-contain object-bottom transition-transform duration-300"
              />
            ) : (
              <div className="text-gray-400">No image available</div>
            )}
          </div>

          {/* แถบเลือกสีซ้ำ (optional) */}
          <div className="flex gap-2 mt-2">
            {availableColors.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleColorChange(chip)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${imageUrl === chip.url ? 'border-green-700' : 'border-gray-300'
                  } hover:opacity-70`}
                style={{ backgroundColor: colorToCss(chip.color) }}
                title={String(chip.color)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <section className="w-full max-w-6xl mx-auto mt-10 px-5">
        <h2 className="text-xl font-bold mb-4">Tips</h2>
        <ol className="list-decimal ml-6 space-y-2 text-gray-700">
          <li>ควรวางต้นไม้ในที่มีแสงรำไรหรือแสงธรรมชาติ เพื่อยืดอายุการใช้งานของต้นไม้ประดิษฐ์</li>
          <li>หมั่นเช็ดฝุ่นที่ใบและกระถางด้วยผ้าแห้งหรือผ้าชุบน้ำหมาดๆ เพื่อความสวยงาม</li>
          <li>หลีกเลี่ยงการวางใกล้เปลวไฟหรือความร้อนสูง</li>
          <li>สามารถเปลี่ยนกระถางหรือจัดวางใหม่ได้ตามสไตล์ที่ต้องการ</li>
        </ol>
      </section>

      {/* รูปตัวอย่าง 2 รูป */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-10 bg-white mt-10 rounded-xl">
        <div className="flex-1 flex flex-col items-center">
          <div className="flex flex-row gap-4 w-full justify-center">
            {[0, 1].map((i) => {
              const url = plant.addition_img?.[i] ?? null;
              return (
                <div
                  key={i}
                  className="w-full rounded-lg flex items-center justify-center mb-4 overflow-hidden"
                >
                  {url ? (
                    <img
                      src={url}
                      alt={plant.name}
                      className="w-full object-contain object-bottom transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-gray-400">No image available</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Similar (demo) */}
      <section className="py-4 flex justify-center relative">
        <div className="container mx-auto px-10">
          <h1 className="text-[27px] font-semibold mt-10 text-left">Similar potted plants</h1>

          <div className="relative">
            <div className="overflow-y-hidden scroll-smooth">
              <div className="flex md:gap-10 w-max max-w-full sm:px-2 md:px-1">
                {similar_plant.map((plant) => (
                  <Link
                    key={plant.id}
                    href={`/product/plant/${plant.id}`}
                    className="flex-shrink-0 w-[50%] sm:w-1/2 md:w-[400px] block md:h-full md:mx-1.5"
                  >
                    <div className="rounded-3xl p-4 hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                      <div className="w-full max-w-[280px] sm:max-w-[360px] md:max-w-[460px] aspect-[3/4] rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                        {plant.url ? (
                          <img
                            src={getTransformedImageUrl(plant.url)}
                            alt={plant.name}
                            className="w-full h-full object-contain object-bottom transition-transform duration-300"
                          />
                        ) : (
                          <div className="text-gray-400">No image available</div>
                        )}
                      </div>
                      <h2 className="flex items-center justify-center text-center mt-2">
                        {plant.name?.replace('-', ' ')}
                      </h2>
                      <p className="text-sm text-center text-gray-600">ความสูง {plant.height} cm</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
