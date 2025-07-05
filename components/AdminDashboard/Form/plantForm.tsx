'use client';

import { useState, useEffect } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { getAllPots, Pot } from '@/lib/service/potService';
import { getPlantById } from '@/lib/service/plantService';
import { getPlantPotOptionById } from '@/lib/service/plantWithPotOptionService';
import { Plant, plant_pot_options, PotColor } from '@/lib/types/types';

interface PlantFormProps {
    initialData: string; // ใช้ plantId
    onSubmit: (formData: any) => void;
    onCancel?: () => void;
}

export default function PlantForm({ initialData, onSubmit, onCancel }: PlantFormProps) {
    const [plant, setPlant] = useState<Plant | null>(null);
    const [allPots, setAllPots] = useState<Pot[]>([]);
    const [potPairs, setPotPairs] = useState<plant_pot_options[]>([]);
    const [originalPotPairs, setOriginalPotPairs] = useState<plant_pot_options[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [plantData, potsList] = await Promise.all([
                    getPlantById(initialData),
                    getAllPots()
                ]);
                setPlant(plantData);
                setPotPairs(plantData.plant_pot_options ?? []);
                setOriginalPotPairs(plantData.plant_pot_options ?? []);
                setAllPots(potsList);
            } catch (err) {
                console.error('Error loading plant data:', err);
            }
            setLoading(false);
        };
        fetchData();
    }, [initialData]);

    function handleChangePlant(field: keyof Plant, value: string) {
        if (!plant) return;
        setPlant({ ...plant, [field]: value });
    }

    function handlePotChange(index: number, field: keyof plant_pot_options, value: string) {
        const updated = [...potPairs];
        (updated[index] as any)[field] = value;
        setPotPairs(updated);
    }
    // ลบรูปที่ cloudinary ด้วย
    function removePotPair(index: number) {
        const updated = [...potPairs];
        updated.splice(index, 1);
        setPotPairs(updated);
    }

    function addPotPair() {
        setPotPairs([...potPairs, {
            id: '',
            pot_id: '',
            pot_color: '',
            url: '',
            height_with_pot: '',
            plant_id: plant?.id ?? '',
            is_suggested: false,
            file: null
        }]);
    }

    function handleSelectSuggested(index: number) {
    const updated = potPairs.map((p, i) => ({
        ...p,
        is_suggested: i === index, // true เฉพาะตัวที่เลือก
    }));
    setPotPairs(updated);
}


    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!plant) return;

        const newPotOptions = potPairs.filter(p => !p.id);
        const updatedPotOptions = potPairs.filter(p => {
            const original = originalPotPairs.find(o => o.id === p.id);
            return original && JSON.stringify(original) !== JSON.stringify(p);
        });
        const deletedPotOptionIds = originalPotPairs
            .filter(o => !potPairs.find(p => p.id === o.id))
            .map(o => o.id);

        console.log('📦 SUBMIT PAYLOAD:', {
            plant,
            newPotOptions,
            updatedPotOptions,
            deletedPotOptionIds
        });

        onSubmit({ plant, newPotOptions, updatedPotOptions, deletedPotOptionIds });
    }

    if (loading || !plant) {
        return <div className="p-6 text-center text-gray-500">Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 max-w-3xl">
            <button onClick={onCancel} type="button" className="text-black-600">
                <ArrowBackIosNewIcon fontSize="small" /> Back
            </button>

            <h2 className="text-2xl font-bold mb-4">Plant Form</h2>

            <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                    type="text"
                    value={plant.name}
                    onChange={(e) => handleChangePlant('name', e.target.value)}
                    className="w-full border px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Height</label>
                <input
                    type="text"
                    value={plant.height}
                    onChange={(e) => handleChangePlant('height', e.target.value)}
                    className="w-full border px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                    type="text"
                    value={plant.price}
                    onChange={(e) => handleChangePlant('price', e.target.value)}
                    className="w-full border px-3 py-2"
                />
            </div>
            <h3 className="text-lg font-semibold mb-2 mt-6">Cover Image (Pot + Color)</h3>
{potPairs.length === 0 ? (
  <p className="text-gray-500 text-sm">Add at least one matched pot first.</p>
) : (
  <div className="space-y-4">
    {/* select dropdown */}
    <select
      value={potPairs.findIndex(p => p.is_suggested)}
      onChange={(e) => handleSelectSuggested(Number(e.target.value))}
      className="w-full border px-3 py-2"
    >
      <option value={-1}>Select cover...</option>
      {potPairs.map((pair, index) => {
        const potName = allPots.find(p => p.id === pair.pot_id)?.name ?? 'Unnamed Pot';
        const label = `${potName} - ${pair.pot_color || 'No Color'}`;
        return (
          <option key={index} value={index}>
            {label}
          </option>
        );
      })}
    </select>


    {/* preview image */}
    <div className="w-32 h-32 overflow-hidden flex items-center justify-center">
      {(() => {
        const cover = potPairs.find(p => p.is_suggested);
        return cover && cover.url ? (
          <img
            src={cover.url}
            alt="Cover Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm text-gray-400">No Image</span>
        );
      })()}
    </div>
  </div>
)}




            <h3 className="text-lg font-semibold mb-2 mt-6">Matched Pots</h3>
            {potPairs.map((pair, index) => (
                <div key={index} className="border p-4 mb-4 rounded shadow-sm bg-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Pot</label>
                            <select
                                value={pair.pot_id}
                                onChange={(e) => handlePotChange(index, 'pot_id', e.target.value)}
                                className="border w-full px-3 py-2"
                            >
                                {allPots.map((pot) => (
                                    <option key={pot.id} value={pot.id}>{pot.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Height with Pot</label>
                            <input
                                type="text"
                                value={pair.height_with_pot}
                                onChange={(e) => handlePotChange(index, 'height_with_pot', e.target.value)}
                                className="border px-3 py-2"
                            />
                        </div>

                        <div>
                            <button type="button" onClick={() => removePotPair(index)} className="text-red-500 hover:underline text-sm">
                                Remove
                            </button>
                        </div>
                    </div>

                    <div className="mt-2">
                        <label className="block text-sm font-medium mb-1">Color</label>
                        <select
                            value={pair.pot_color}
                            onChange={(e) => handlePotChange(index, 'pot_color', e.target.value)}
                            className="w-full border px-3 py-2"
                        >
                            <option value="">Select color</option>
                            {Object.values(PotColor).map((color) => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium mb-1">Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const updated = [...potPairs];
                                    updated[index].file = file;
                                    // ✅ Preview: สร้าง URL ชั่วคราวสำหรับ preview
                                    updated[index].url = URL.createObjectURL(file);
                                    setPotPairs(updated);
                                    console.log('setPotPairs uploaded:',potPairs);
                                }
                            }}
                            
                        />
                        <div className="mt-2">
           {pair.url? (
                          <img
                            src={pair.url}
                            className="w-32 h-32 object-cover border rounded"
                          />
                        ) : (
                          <span className="text-gray-400 text-s">No Image</span>
                        )}
        </div>
                    </div>

                </div>
            ))}

            <button type="button" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={addPotPair}>
                + Add Pot
            </button>

            <div className="pt-6 flex justify-end gap-4">
                {onCancel && (
                    <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
                        Cancel
                    </button>
                )}
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Save
                </button>
            </div>

        </form>
    );
}
