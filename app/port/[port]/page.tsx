'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { Port } from '@/lib/types/types';
import { getPortById } from '@/lib/service/portService';

import Port_Templete_Title from '@/components/Templete_Port_Component/Port_Templete_Title';
import Port_Templete_Component from '@/components/Templete_Port_Component/Port_Templete_Component';
import { CircularProgress } from '@mui/material';

export default function PortfolioDetailPage() {
  const params = useParams();
  const [port, setPort] = useState<Port | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataPort = async () => {
      try {
        const slug = params?.port as string;
        if (!slug) {
          setError('No Data');
          return;
        }
        const data = await getPortById(slug);
        setPort(data ?? null);
      } catch (e) {
        console.error(e);
        setError('Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetchDataPort();
  }, [params]);

  if (loading) return <main className="min-h-screen flex items-center justify-center"><CircularProgress /></main>;

  if (error || !port) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error ?? 'Not found'}</div>
      </main>
    );
  }

  const sortedMiddle = (port.port_middle_sections ?? [])
    .slice()
    .sort(
      (a, b) => (Number(a.position) || 0) - (Number(b.position) || 0)
    );

  const sortedBottom = (port.port_bottom_groups ?? [])
    .slice()
    .sort(
      (a, b) => (Number(a.position) || 0) - (Number(b.position) || 0)
    );

  return (
    <main className="min-h-screen flex flex-col items-center mt-20 mx-20 mb-20 px-10">
      <section className="w-full max-w-7xl mx-auto px-4 py-10">
        {/* ข้อมูล */}
        <div className="max-w-3xl">
          <h1 className="text-2xl md:text-4xl font-bold">{port.title}</h1>

          {port.location && (
            <div className="mt-3">
              <span className="inline-flex items-center rounded-md px-3 py-1 text-sm text-gray-700">
                📍 {port.location}
              </span>
            </div>
          )}

          {port.description && (
            <p className="mt-5 text-gray-600 leading-relaxed">
              {port.description}
            </p>
          )}
        </div>

        {/* รูปด้านล่าง */}
        <div className="mt-8">
          <img
            src={port.image_cover || ''}
            alt={port.title || 'portfolio cover'}
            className="w-full aspect-[16/10] object-cover"
          />
        </div>
      </section>
      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        {sortedMiddle.map((ms, idx) => (
          <Port_Templete_Title
            key={ms.id || `${ms.title}`}
            count={idx + 1}
            title={ms.title || ''}
            description={ms.detail || ''}
            img={ms.image_url || ''}
          />
        ))}
      </div>
      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        {sortedBottom.map((bottom, idx) => {
          const pat = Math.max(1, Math.min(3, Number(bottom.pattern) || 1)) as 1 | 2 | 3;
          const imgs = [bottom.image_url_1, bottom.image_url_2, bottom.image_url_3]
            .filter(Boolean)
            .slice(0, pat) as string[];

          if (imgs.length === 0) return null;

          return (
            <Port_Templete_Component
              key={bottom.id || `bottom-${idx}`}
              Templete_number={pat}
              images={imgs}
            />
          );
        })}
      </div>
    </main>
  );
}
