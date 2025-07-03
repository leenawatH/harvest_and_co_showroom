'use client';

import { useState } from 'react';

import { Pot } from '@/lib/service/potService'
import { getPlantPotOptionById } from '@/lib/service/plantWithPotOptionService';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { plant_pot_options } from '@/lib/types/types';

interface PlantFormProps {
    initialData?: any;
    onSubmit: (formData: any) => void;
    onCancel?: () => void;
    pots?: Pot[];
}

export default async function PlantForm({ initialData, onSubmit, onCancel, pots }: PlantFormProps) {
    console.log(initialData.id);

    const potPair = await getPlantPotOptionById(initialData.id);

    const [name, setName] = useState(initialData?.name || '');
    const [height, setHeight] = useState(initialData?.height || '');
    const [price, setPrice] = useState(initialData?.price || '');
    const [potPairs, setPotPairs] = useState<plant_pot_options[]>(potPair);

    function handlePotChange(index: number, arg1: string, value: string): void {
        throw new Error('Function not implemented.');
    }

    function removePotPair(index: number): void {
        throw new Error('Function not implemented.');
    }

    function handleColorChange(index: number, p0: number, p1: string, value: string): void {
        throw new Error('Function not implemented.');
    }

    function addPotPair() {

    }

    return (
        <form className="space-y-6 bg-white p-6 max-w-3xl">
            <button
                onClick={onCancel}
                className=" text-black-600 "
            >
                <ArrowBackIosNewIcon fontSize="small" /> Back
            </button>
            <h2 className="text-2xl font-bold mb-4">Plant Form</h2>

            <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Height</label>
                <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full border px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border px-3 py-2"
                />
            </div>

            <h3 className="text-lg font-semibold mb-2 mt-6">Matched Pots</h3>
            {potPairs.map((pair, index) => (
                <div key={index} className="border p-4 mb-4 rounded shadow-sm bg-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Pot</label>
                            <select
                                value={pair.pot_id ?? ''}
                                onChange={(e) => handlePotChange(index, 'pot_id', e.target.value)}
                                className="border w-full px-3 py-2"
                            >
                                {pots?.map((pot) => (
                                    <option key={pot.id} value={pot.id}>
                                        {pot.name}
                                    </option>
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
                            <label className="block text-sm font-medium mb-1">Preview</label>
                            <img
                                src={pair.url || ''}
                                alt="preview"
                                className="w-20 h-20 object-cover border"
                            />
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => removePotPair(index)}
                                className="text-red-500 hover:underline text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    </div>

                    <div className="mt-2">
                        <label className="block text-sm font-medium mb-1">Image URL</label>
                        <input
                            type="text"
                            value={(pair.url) || ''}
                            onChange={(e) => handleColorChange(index, 0, 'url', e.target.value)}
                            className="w-full border px-3 py-2"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-medium mb-1">Color</label>
                        <input
                            type="text"
                            value={pair.pot_color|| ''}
                            onChange={(e) => handleColorChange(index, 0, 'color', e.target.value)}
                            className="w-full border px-3 py-2"
                        />
                    </div>
                </div>
            ))}

            <button
                type="button"
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={addPotPair}
            >
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
