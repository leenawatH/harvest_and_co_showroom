'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

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
    return imageUrl.replace("/upload/", "/upload/c_crop,h_1100,g_south/");
  }else if(plant.height < 100){
    return imageUrl.replace("/upload/", "/upload/c_crop,h_900,g_south/c_crop,w_600,h_600/");
  }else if(plant.height <= 200 && plant.height >= 150){
    return imageUrl.replace("/upload/", "/upload/c_crop,h_1300,g_south/");
  }

  return imageUrl;
};


  if (error) return <div className="p-6">No data</div>;
  if (!plant) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 mx-4 px-4 w-full max-w-[400px] h-[400px] mx-auto">

      {imageUrl ? (
        <div className="relative">
          <div className="overflow-hidden mb-4">
            <img
              src={getTransformedImageUrl()}
              alt={plant.name}
              className={`w-full h-full object-contain object-bottom object-scale-down transition-transform duration-300`}
            />
          </div>

          <div className="flex justify-end gap-2 mb-4">
            {availableColors?.map((color, index) => (
              <button
                key={index}
                onClick={() => handleColorChange(color.url)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 
              ${activeColor === color.url ? 'border-blue-400' : 'border-gray-400'} hover:opacity-70`}
                style={{ backgroundColor: color.color.toLowerCase() }}
                title={color.color}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>No image available</div>
      )}
        <div className="overflow-x-auto">
          <div className="flex gap-4">
            {pot?.map((potItem) => (
              <div
                key={potItem.id}
                className={`flex-[0_0_25%] aspect-square border rounded-lg cursor-pointer 
              ${selectedPotId === potItem.id ? 'bg-gray-100' : ''} 
              hover:bg-gray-100 transition-all duration-300 
              flex flex-col items-center justify-center text-center px-1`}
                onClick={() => handlePotClick(potItem.id)}
              >
                {potItem.color?.[0]?.url ? (
                  <img
                    src={potItem.color[0].url}
                    alt={potItem.name}
                    className=" h-2/3 object-contain mb-1"
                  />
                ) : (
                  <div className="text-[10px]">No image</div>
                )}
                <h4 className="text-[10px] font-medium leading-tight">{potItem.name}</h4>
              </div>
            ))}
          </div>
        </div>
      <div>
        <h1 className="text-2xl font-bold mt-4">{plant.name.replace("-", " ")}</h1>
        <p>ความสูงต้นไม้ H: {plant.height} cm</p>
        <p>ความสูงรวมกระถางในรูป H: {heightWithSelectedPot} cm</p>
      </div>
    </div>
  );
}
