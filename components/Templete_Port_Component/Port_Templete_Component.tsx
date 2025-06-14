'use client';

import React from 'react';

type Props = {
  Templete_number: 1 | 2 | 3;
  images: string[];
};

export default function Port_Templete_Component({ Templete_number, images }: Props) {
  // ตั้งค่าจำนวน column
  const columnClass =
    Templete_number === 1
      ? 'grid-cols-1'
      : Templete_number === 2
      ? 'md:grid-cols-2'
      : 'md:grid-cols-3';

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className={`grid gap-6 ${columnClass}`}>
        {images.map((img, index) => (
          <div key={index} className="w-full">
            <img
              src={img}
              alt={`Port ${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
