'use client';
import React from 'react';

type Props = {
  count: number;
  title: string;
  description: string;
  img: string;
};

export default function Port_Templete_Title({ count, title, description, img }: Props) {
  const isEven = count % 2 === 0;

  return (
    <section className="flex flex-col md:flex-row items-center my-12 gap-20">
      {isEven ? (
        <>
          {/* ข้อความซ้าย */}
          <div className="w-full md:w-1/2 text-left">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-gray-700">{description}</p>
          </div>
          {/* รูปขวา */}
          <div className="w-full md:w-1/2">
            <img src={img} alt={title} className="w-full h-auto object-cover" />
          </div>
        </>
      ) : (
        <>
          {/* รูปซ้าย */}
          <div className="w-full md:w-1/2">
            <img src={img} alt={title} className="w-full h-auto object-cover" />
          </div>
          {/* ข้อความขวา */}
          <div className="w-full md:w-1/2 text-left">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-gray-700">{description}</p>
          </div>
        </>
      )}
    </section>
  );
}
