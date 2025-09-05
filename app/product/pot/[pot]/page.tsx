'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLoading } from '@/components/LoadingProvider/LoadingProvider';

import { Color, Pot, Pot_Img } from '@/lib/types/types';
import { getPotById } from '@/lib/service/potService';


type SimilarPot = {
  id: string;
  name: string;
  height: number;
  circumference: number;
  url: string;
};

export default function PotDetail() {
  const params = useParams();

  const [pot, setPot] = useState<Pot | null>(null);
  const [colorList, setColorList] = useState<Pot_Img[]>([]);
  const [selectedColorUrl, setSelectedColorUrl] = useState<string | null>(null);

  const [similarPots, setSimilarPots] = useState<SimilarPot[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { setLoading } = useLoading();

  // โหลดข้อมูลกระถาง + จัดเรียงสีตาม onShow_color
  useEffect(() => {
    setLoading(true);
    const run = async () => {
      try {
        const id = params?.pot as string;
        if (!id) {
          setError('No id provided');
          return;
        }

        const data = await getPotById(id);
        setPot(data);

        // ✅ sort สีให้ onShow_color ขึ้นก่อน
        const sortedColors = [...(data.pot_colors ?? [])].sort(
          (a, b) =>
            Number(b.pot_color === data.onShow_color) -
            Number(a.pot_color === data.onShow_color)
        ) as Pot_Img[];

        setColorList(sortedColors);
        setSelectedColorUrl(sortedColors[0]?.url ?? null);

        // ✅ similar pots: เลือกรูป cover ด้วย onShow_color ของแต่ละ pot
        if (Array.isArray(data.similar_pot) && data.similar_pot.length > 0) {
          const sims = await Promise.all(
            data.similar_pot.map(async (pid: string) => {
              try {
                const p = await getPotById(pid);
                const sorted = [...(p.pot_colors ?? [])].sort(
                  (a, b) =>
                    Number(b.pot_color === p.onShow_color) -
                    Number(a.pot_color === p.onShow_color)
                ) as Pot_Img[];
                return {
                  id: p.id,
                  name: p.name,
                  height: p.height,
                  circumference: p.circumference,
                  url: sorted[0]?.url ?? '',
                };
              } catch {
                return null;
              }
            })
          );
          setSimilarPots(sims.filter(Boolean) as SimilarPot[]);
        }
      } catch (e: any) {
        console.error(e);
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [params]);

  // รูปหลักที่เลือกอยู่ตอนนี้
  const imageUrl = selectedColorUrl;

  // เปลี่ยนสี
  const handleColorChange = (url: string) => {
    setSelectedColorUrl(url);
  };

  // Cloudinary transform (ถ้าต้องการ crop ตาม height)
  const getTransformedImageUrl = (Url: string): string => {
    if (!Url || !pot) return Url || '';
    if (pot.height <= 150 && pot.height >= 100) {
      return Url.replace('/upload/', '/upload/c_crop,h_1000,g_south/');
    } else if (pot.height < 100) {
      return Url.replace('/upload/', '/upload/c_crop,h_900,g_south/c_crop,w_600,h_600/');
    } else if (pot.height <= 200 && pot.height >= 150) {
      return Url.replace('/upload/', '/upload/c_crop,h_1500,g_south/');
    }
    return Url;
  };

  if (error || !pot) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        No data
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center mt-15 mb-20 px-10">
      <div className="w-full max-w-6xl flex flex-col px-5 md:flex-row gap-10 bg-white rounded-xl p-6">
        {/* LEFT: Product Info */}
        <div className="flex-1 flex flex-col justify-start mt-20 pt-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 mt-10">
            {pot.name?.replace('-', ' ')}
          </h1>

          <p className="text-lg font-semibold mb-4">
            ราคา: {pot.price?.toLocaleString()} บาท
          </p>

          <div className="mb-2">
            <span className="font-semibold">ความสูง:</span>
            <span className="ml-2 text-gray-700">: {pot.height} cm</span>
          </div>

          <div className="mb-2">
            <span className="font-semibold">เส้นรอบวง:</span>
            <span className="ml-2 text-gray-700">: {pot.circumference} cm</span>
          </div>

          <div className="mb-4">
            <span className="font-semibold">สีที่เลือก:</span>
            <span className="ml-2 text-gray-700">
              {colorList.find((c) => c.url === imageUrl)?.pot_color ?? '-'}
            </span>
          </div>

          {/* เลือกสี */}
          <div>
            <div className="font-semibold mb-1">เลือกสี:</div>
            <div className="flex gap-2 flex-wrap">
              {colorList.map((img) => (
                <button
                  key={img.id}
                  onClick={() => handleColorChange(img.url)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    imageUrl === img.url ? 'border-green-700' : 'border-gray-300'
                  } hover:opacity-70`}
                  style={{ backgroundColor: String(img.pot_color) }}
                  title={String(img.pot_color)}
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
                alt={pot.name}
                className="w-full h-full object-contain object-bottom transition-transform duration-300"
              />
            ) : (
              <div className="text-gray-400">No image available</div>
            )}
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
              const url = pot.addition_img?.[i] ?? null;
              return (
                <div
                  key={i}
                  className="w-full rounded-lg flex items-center justify-center mb-4 overflow-hidden"
                >
                  {url ? (
                    <img
                      src={url}
                      alt={pot.name}
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

      {/* Similar Pots */}
      <section className="py-4 flex justify-center relative">
        <div className="container mx-auto px-10">
          <h1 className="text-[27px] font-semibold mt-10 text-left">Similar pots</h1>

          <div className="relative">
            <div className="overflow-y-hidden scroll-smooth">
              <div className="flex md:gap-10 w-max max-w-full sm:px-2 md:px-1">
                {similarPots.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/pot/${p.id}`}
                    className="flex-shrink-0 w-[50%] sm:w-1/2 md:w-[400px] block md:h-full md:mx-1.5"
                  >
                    <div className="rounded-3xl p-4 hover:shadow-lg transition transform hover:scale-105 h-full flex flex-col justify-between bg-white">
                      <div className="w-full max-w-[280px] sm:max-w-[360px] md:max-w-[460px] aspect-[3/4] rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                        {p.url ? (
                          <img
                            src={getTransformedImageUrl(p.url)}
                            alt={p.name}
                            className="w-full h-full object-contain object-bottom transition-transform duration-300"
                          />
                        ) : (
                          <div className="text-gray-400">No image available</div>
                        )}
                      </div>
                      <h2 className="flex items-center justify-center text-center mt-2">
                        {p.name?.replace('-', ' ')}
                      </h2>
                      <p className="text-sm text-center text-gray-600">
                        ความสูง {p.height} cm | เส้นรอบวง {p.circumference} cm
                      </p>
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
