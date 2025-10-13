'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { Color, Plant, plant_pot_options, plant_review_pic } from '@/lib/types/types';
import { getPlantById } from '@/lib/service/plantService';
import { getPotById } from '@/lib/service/potService';
import { useLoading } from '@/components/LoadingProvider/LoadingProvider';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HorizontalScroll from '@/components/HorizontalScroll';

type ColorChip = { color: Color; url: string };

type PlantPot = {
  pot_id: string;
  pot_name?: string;
  height_with_pot: string;
  price_with_pot: string;
  potHeight?: number;
  potCircumference?: number;
  colors: ColorChip[]; // รวมจาก plant_pot_options ของ pot_id นั้น (unique ตาม color)
  available_colors?: Color[];
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

  const [plantReviewPic, setPlantReviewPic] = useState<plant_review_pic[]>([]);

  const [similar_plant, setSimilar_plant] = useState<SimilarPlant[]>([]);

  const [error, setError] = useState<string | null>(null);
  const { setLoading } = useLoading();

  const reviewPicScroll = HorizontalScroll(850 , 2);

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
        setPlantReviewPic(data.plant_review_pic ?? []);

        const potPair = await groupOptionsByPotId(data.plant_pot_options ?? []);

        const suggestedPotId =
          (data.plant_pot_options ?? []).find(o => Boolean(o.is_suggested))?.pot_id ?? null;

        potPair.sort((a, b) =>
          Number(b.pot_id === suggestedPotId) - Number(a.pot_id === suggestedPotId)
        );

        setPlantPots(potPair);


        if (potPair.length > 0) {
          setSelectedPotId(potPair[0].pot_id);
          setSelectedColorUrl(potPair[0].colors[0]?.url ?? null);
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

  useEffect(() => {
    console.log("review : " ,reviewPicScroll.ref.current);
    reviewPicScroll.checkScroll();
  },[plantReviewPic]);

  // สร้างลิสต์ใหม่จาก plant_pot_options ให้เป็น PlantPot[]
  async function groupOptionsByPotId(options: plant_pot_options[]): Promise<PlantPot[]> {
    const map = new Map<string, PlantPot>();

    for (const opt of options) {
      const key = opt.pot_id;
      let potName = '';
      let height_With_Pot = '';
      let price_With_Pot = '';
      let potHeight = 0;
      let potCircumference = 0;
      let available_colors: Color[] = [];
      if (!map.has(key)) {
        // Await the pot name only once per pot_id
        try {
          const pot = await getPotById(key);
          potName = pot.name;
          potHeight = pot.height;
          potCircumference = pot.circumference;
          height_With_Pot = opt.height_with_pot ?? '';
          price_With_Pot = opt.price_with_pot ?? '';
          available_colors = pot.color_available ?? [];
        } catch {
          potName = '';
        }

        map.set(key, {
          pot_id: key,
          pot_name: potName,
          height_with_pot: height_With_Pot,
          price_with_pot: price_With_Pot,
          potHeight: potHeight,
          potCircumference: potCircumference,
          colors: [],
          available_colors: available_colors,
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

  const availableColors = selectedGroup?.available_colors ?? [];
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

          <p className="text-lg font-semibold mb-4">
            ราคาต้นไม้: {plant.price?.toLocaleString()} บาท{' '}
            <span className="font-normal">
              (รวมกระถาง: {selectedGroup?.price_with_pot !== undefined ? selectedGroup.price_with_pot.toLocaleString() : '-'} บาท)
            </span>
          </p>

          {/* <p className="text-lg font-semibold mb-2">
            ราคารวมกระถาง: {selectedGroup?.price_with_pot !== undefined ? selectedGroup.price_with_pot.toLocaleString() : '-'} บาท
          </p> */}

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
            <div className="font-semibold mb-1">สีที่มี:</div>
            <div className="flex gap-2 flex-wrap">
              {availableColors.map((chip, idx) => (
                <button
                  key={idx}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200`}
                  style={{ backgroundColor: colorToCss(chip) }}
                  title={String(chip)}
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
          {/* Thumbnails ของทุกกระถาง + More Images */}
          <section className="w-full max-w-6xl mx-auto mt-8 px-5">
            <div className="flex flex-wrap justify-center gap-4">
              {/* กระถาง */}
              {plantPots.map((pot) =>
                pot.colors.map((c, idx) => (
                  <div
                    key={`${pot.pot_id}-${idx}`}
                    className={`w-20 h-20 border rounded overflow-hidden cursor-pointer ${selectedPotId === pot.pot_id && selectedColorUrl === c.url
                      ? 'ring-2 ring-green-500'
                      : ''
                      }`}
                    onClick={() => {
                      // เปลี่ยน selected pot + selected color
                      setSelectedPotId(pot.pot_id);
                      setSelectedColorUrl(c.url);
                    }}
                  >
                    <img
                      src={c.url}
                      alt={`${pot.pot_name} - ${c.color}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              )}

              {/* More Images */}
              {plant.plant_more_image?.map((plant, idx) => (
                <div
                  key={`more-${idx}`}
                  className={`w-20 h-20 border rounded overflow-hidden cursor-pointer ${imageUrl === plant.url ? 'ring-2 ring-blue-500' : ''
                    }`}
                  onClick={() => {
                    setSelectedPotId(null);
                    setSelectedColorUrl(plant.url);
                  }}
                >
                  <img
                    src={plant.url}
                    alt={`More image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>

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
      <div className="w-full h-full max-w-6xl bg-white mt-10 p-4 relative">
        <div
          ref={reviewPicScroll.ref}
          className="flex md:gap-10 w-max max-w-full sm:px-2 md:px-1 overflow-x-auto scroll-smooth"
        >
          {plantReviewPic.map((img, idx) => (
            <div
              key={idx}
              className="flex-none min-w-[50%] sm:min-w-[50%] md:min-w-[50%] h-64 rounded-lg overflow-hidden border"
            >
              {img.url ? (
                <img
                  src={img.url}
                  alt={`Review ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Arrow buttons */}
       <button
                                   onClick={reviewPicScroll.scrollLeftByOne}
                                   disabled={!reviewPicScroll.canLeft}
                                   className={`absolute -left-1 top-1/2 -translate-y-1/2 z-10 
                       text-black transition-transform duration-200 ease-in-out
                       ${reviewPicScroll.canLeft ? 'opacity-100' : 'opacity-30 cursor-default'}
                       scale-70 hover:scale-125 active:scale-125
                     `}
                               >
                                   <ArrowBackIosNewIcon fontSize="small" />
                               </button>
                               <button
                                   onClick={reviewPicScroll.scrollRightByOne}
                                   disabled={!reviewPicScroll.canRight}
                                   className={`absolute -right-1 top-1/2 -translate-y-1/2 z-10 
                       text-black transition-transform duration-200 ease-in-out
                       ${reviewPicScroll.canRight ? 'opacity-100' : 'opacity-30 cursor-default'}
                       scale-70 hover:scale-125 active:scale-125
                     `}
                               >
                                   <ArrowForwardIosIcon fontSize="small" />
                               </button>
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
