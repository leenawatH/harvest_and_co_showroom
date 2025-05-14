'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter(); // Initialize router
  const [startTouch, setStartTouch] = useState(0);
  const params = useParams();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedPotId, setSelectedPotId] = useState<string | null>(null);
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

      if (potError) setError(potError.message);
      else setPot(potData);

      if (potData && potData.length > 0) {
        setSelectedPotId(potData[0].id); 
        const selectedPotImage = plantData.withpot_imgurl.find(item => item.pot_id === potData[0].id);
        if (selectedPotImage) {
          setAvailableColors(selectedPotImage.available_colors);
          setImageUrl(selectedPotImage.available_colors?.[0]?.url || null);
        }
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
      }
    }
  };

  const handleColorChange = (colorUrl: string) => {
    setImageUrl(colorUrl); // Update image when color is clicked
    setActiveColor(colorUrl); // Set active color to make it persist
  };

  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!plant) return <div className="p-6">Loading...</div>;

  const name = plant.name.replace("-", " ");

  return (
    <div className="p-6">
      {imageUrl ? (
        <div className="relative">
          {/* Display plant image */}
          <img src={imageUrl} alt={plant.name} className="w-full h-auto max-w-[350px] sm:max-w-[400px] mx-auto object-contain mb-4 transition-transform duration-300" />
          
          {/* Display color selection buttons */}
          <div className="absolute bottom-0 right-0 p-2 flex gap-2">
            {availableColors?.map((color, index) => (
              <button
                key={index}
                onClick={() => handleColorChange(color.url)}
                className={`w-8 h-8 rounded-full border-2 border-gray-400 transition-all duration-200 
                  ${activeColor === color.url ? 'opacity-50' : ''} hover:opacity-70`} // Apply opacity when active or hovered
                style={{ backgroundColor: color.color.toLowerCase() }}
                title={color.color}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>No image available</div>
      )}
      <h1 className="text-2xl font-bold mb-2">{name}</h1>
      <p>Height : {plant.height} cm</p>
      <p>Price : {plant.price} Baht</p>
      <div className="mt-6">
        <div className="overflow-x-auto"> {/* Add scrollable container */}
          <div className="flex gap-4"> {/* Flex for horizontal scroll */}
            {pot?.map((potItem) => (
              <div
                key={potItem.id}
                className={`p-4 border rounded-lg cursor-pointer relative 
                  ${selectedPotId === potItem.id ? 'bg-white bg-opacity-50'  : ''} 
                  hover:bg-white hover:bg-opacity-50 transition-all duration-300`} // Apply opacity change on hover and selected state
                onClick={() => handlePotClick(potItem.id)} // Add onClick handler
              >
                {/* Add the white overlay effect on hover or selected */}
                <div className="absolute inset-0 bg-white opacity-0 rounded-lg"></div>
                {potItem.color?.[0]?.url ? (
                  <img
                    src={potItem.color[0].url}
                    alt={potItem.name}
                    className="w-48 h-48 object-contain mt-2" // Adjust size of image
                  />
                ) : (
                  <div>No color available</div>
                )}
                <h4 className="font-bold text-lg mb-2 text-center">{potItem.name}</h4> {/* Center the name */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
