'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {
    OutlinedInput,
    InputLabel,
    MenuItem,
    Select,
    FormControl,
    ListItemText,
    Checkbox,
    CircularProgress,
    IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { getAllPots } from '@/lib/service/potService';
import { getAllPlant, getPlantById } from '@/lib/service/plantService';
import { uploadImage, deleteImage } from '@/lib/service/cloudinaryService';
import { Plant, plant_pot_options, plant_more_image, plant_review_pic, Color, Pot } from '@/lib/types/types';

interface PlantFormProps {
    initialData: string; // ใช้ plantId
    onSubmit: (formData: any) => void;
    onCancel?: () => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function PlantForm({ initialData, onSubmit, onCancel }: PlantFormProps) {
    const [loading, setLoading] = useState<boolean>(true);

    const [plant, setPlant] = useState<Plant | null>(null);
    const [originalPlant, setOriginalPlant] = useState<Plant | null>(null);
    const [allPlants, setAllPlants] = useState<Plant[]>([]);
    const [selectedSimilar, setSelectedSimilar] = useState<string[]>([]);
    const selectedSimilarSet = useMemo(() => new Set(selectedSimilar), [selectedSimilar]);
    const [additionImages, setAdditionImages] = useState<string[]>([]);
    const [deleteAdditionImages, setDeleteAdditionImages] = useState<string[]>([])
    const additionImageFileRef = useRef<File[]>(new Array(2));

    //Match Pots
    const [allPots, setAllPots] = useState<Pot[]>([]);

    const [plantReviewPic, setPlantReviewPic] = useState<plant_review_pic[]>([]);
    const [potPairs, setPotPairs] = useState<plant_pot_options[]>([]);
    const [plantMoreImages, setPlantMoreImages] = useState<plant_more_image[]>([]);

    const [originalPlantReviewPic, setOriginalPlantReviewPic] = useState<plant_review_pic[]>([]);
    const [originalPotPairs, setOriginalPotPairs] = useState<plant_pot_options[]>([]);
    const [originalPlantMoreImages, setOriginalPlantMoreImages] = useState<plant_more_image[]>([]);

    const [deletePlantReviewPic, setDeletePlantReviewPic] = useState<string[]>([]);
    const [deletePotPairImages, setDeletePotPairImages] = useState<string[]>([]);
    const [deletePlantMoreImages, setDeletePlantMoreImages] = useState<string[]>([]);

    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [plantData, potsList, plantsList] = await Promise.all([
                    getPlantById(initialData),
                    getAllPots(),
                    getAllPlant()
                ]);
                setPlant(plantData);
                setOriginalPlant(plantData);

                setPotPairs(JSON.parse(JSON.stringify(plantData.plant_pot_options ?? [])));
                setPlantMoreImages(JSON.parse(JSON.stringify(plantData.plant_more_image ?? [])));
                setPlantReviewPic(JSON.parse(JSON.stringify(plantData.plant_review_pic ?? [])));

                setOriginalPotPairs(JSON.parse(JSON.stringify(plantData.plant_pot_options ?? [])));
                setOriginalPlantMoreImages(JSON.parse(JSON.stringify(plantData.plant_more_image ?? [])));
                setOriginalPlantReviewPic(JSON.parse(JSON.stringify(plantData.plant_review_pic ?? [])));

                setAllPots(potsList);
                setAllPlants(plantsList);
                if (plantData.addition_img != null) {
                    setAdditionImages(plantData.addition_img);
                } else {
                    setAdditionImages([]);
                }
                if (plantData.similar_plant != null) {
                    setSelectedSimilar(plantData.similar_plant);
                } else {
                    setSelectedSimilar([]);
                }
                setDeleteAdditionImages([]);


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

    function handlePlantMoreImageChange(index: number, field: keyof plant_more_image, value: string) {
        const updated = [...plantMoreImages];
        (updated[index] as any)[field] = value;
        setPlantMoreImages(updated);
    }

    function handlePlantReviewPicChange(index: number, field: keyof plant_review_pic, value: string) {
        const updated = [...plantReviewPic];
        (updated[index] as any)[field] = value;
        setPlantReviewPic(updated);
    }

    function removePotPair(index: number, pairId: string | null) {
        if (pairId != null) {
            setDeletePotPairImages(prev => [...prev, potPairs[index].url]);
        }
        const updated = [...potPairs];
        updated.splice(index, 1);
        setPotPairs(updated);
    }

    function removePlantMoreImage(index: number, id: string | null) {
        if (id != null) {
            setDeletePlantMoreImages(prev => [...prev, plantMoreImages[index].url]);
        }
        const updated = [...plantMoreImages];
        updated.splice(index, 1);
        setPlantMoreImages(updated);
    }

    function removePlantReviewPic(index: number, id: string | null) {
        if (id != null) {
            setDeletePlantReviewPic(prev => [...prev, plantReviewPic[index].url]);
        }
        const updated = [...plantReviewPic];
        updated.splice(index, 1);
        setPlantReviewPic(updated);
    }

    function addPotPair() {
        setPotPairs([...potPairs, {
            id: '',
            pot_id: '',
            pot_color: '',
            url: '',
            height_with_pot: '',
            price_with_pot: '',
            plant_id: '',
            is_suggested: false,
            file: null
        }]);
    }

    function addPlantMoreImage() {
        setPlantMoreImages([...plantMoreImages, {
            id: '',
            url: '',
            plant_id: '',
            file: null
        }]);
    }

    function addPlantReviewPic() {
        setPlantReviewPic([...plantReviewPic, {
            id: '',
            url: '',
            plant_id: '',
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

    const handleSelectSimilarChange = (
        event: React.ChangeEvent<HTMLInputElement> | (Event & { target: { value: string[]; name?: string } }),
    ) => {
        const value =
            typeof (event as any).target.value === 'string'
                ? (event as any).target.value.split(',')
                : ((event as any).target.value as string[]);

        // จำกัดสูงสุด 3 อัน
        const ids = value.slice(0, 3);

        setSelectedSimilar(ids);
        setPlant(prev => (prev ? { ...prev, similar_plant: ids } : prev));
    };


    const handleAdditionImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        let newImages = [];
        if (file) {
            if (additionImages != null) {
                if (additionImages[index] != null) {
                    setDeleteAdditionImages(prev => [...prev, additionImages[index]]);
                }
                newImages = [...additionImages];
                newImages[index] = URL.createObjectURL(file);
                setAdditionImages(newImages);
                additionImageFileRef.current[index] = file;

            } else {
                newImages[index] = URL.createObjectURL(file);
                setAdditionImages(newImages);
                additionImageFileRef.current[index] = file;
            }

            if (plant) {
                const updatedPlant = { ...plant, addition_img: newImages };
                setPlant(updatedPlant);
            }
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        setIsPending(true);
        e.preventDefault();
        if (!plant) return;

        if (!originalPlant) return;

        if (!originalPotPairs) return;

        const validReviewPics = plantReviewPic.filter(pic => pic.url || pic.file);
        if (validReviewPics.length < 2) {
            alert('Review Pic ต้องมีอย่างน้อย 2 รูป');
            setIsPending(false);
            return;
        }

        // plant info Update
        let resultsUrl = [];
        for (let i = 0; i < additionImageFileRef.current.length; i++) {
            if (additionImageFileRef.current[i] != null) {
                resultsUrl[i] = await uploadImage(additionImageFileRef.current[i], `Plant/${plant.name}/Addition_img`);
                resultsUrl[i] = resultsUrl[i].secure_url || resultsUrl[i].url;
            } else {
                resultsUrl[i] = additionImages[i] || null;
            }
        }

        deleteAdditionImages.forEach(async (url) => {
            const urlParts = url.split('Plant');
            const public_id = "Plant" + urlParts[urlParts.length - 1].split('.')[0];
            await deleteImage(public_id);
        });

        additionImageFileRef.current = [];

        const finalPlant = resultsUrl.length > 0
            ? { ...plant, addition_img: resultsUrl }
            : plant;
        const updatedPlantData: Partial<Plant> = {};

        updatedPlantData.id = finalPlant.id;
        if (plant.name !== originalPlant.name) updatedPlantData.name = finalPlant.name;
        if (plant.eng_name !== originalPlant.eng_name) updatedPlantData.eng_name = finalPlant.eng_name;
        if (plant.height !== originalPlant.height) updatedPlantData.height = finalPlant.height;
        if (plant.price !== originalPlant.price) updatedPlantData.price = finalPlant.price;
        if (plant.is_suggested !== originalPlant.is_suggested) updatedPlantData.is_suggested = finalPlant.is_suggested;
        if (plant.similar_plant !== originalPlant.similar_plant) updatedPlantData.similar_plant = finalPlant.similar_plant;
        if (plant.addition_img !== originalPlant.addition_img) updatedPlantData.addition_img = finalPlant.addition_img;

        const finalUpdatePlantData = Object.keys(updatedPlantData).length > 1 ? updatedPlantData : null;

        const plantReviewPicPromises = plantReviewPic.map(async (plantReviewPic, index) => {
            if (plantReviewPic.file) {
                const plantReviewPicFile = plantReviewPic.file;
                let plantReviewPicUrl: any;
                plantReviewPicUrl = await uploadImage(plantReviewPicFile, `Plant/${plant.name}/Review_pic`);
                plantReviewPicUrl = plantReviewPicUrl.secure_url || plantReviewPicUrl.url;
                handlePlantReviewPicChange(index, 'url', plantReviewPicUrl);
            }
            handlePlantReviewPicChange(index, 'plant_id', plant.id);
        });

        await Promise.all(deletePlantReviewPic.map(async (url) => {
            if (url.includes('blob')) return; // Ignore blob URLs
            const urlParts = url.split('Plant');
            const public_id = "Plant" + urlParts[urlParts.length - 1].split('.')[0];
            await deleteImage(public_id);
        }));

        await Promise.all(plantReviewPicPromises);


        // อัปเดตข้อมูล Pot
        const potPromises = potPairs.map(async (pair, index) => {
            if (pair.file) {
                const potPairFile = pair.file;
                let potPairUrl: any;
                potPairUrl = await uploadImage(potPairFile, `Plant/${plant.name}`);
                potPairUrl = potPairUrl.secure_url || potPairUrl.url;
                handlePotChange(index, 'url', potPairUrl);
            }
            handlePotChange(index, 'plant_id', plant.id);
        });

        // ลบ Pot Pair ที่ถูกลบ
        await Promise.all(deletePotPairImages.map(async (url) => {
            if (url.includes('blob')) return; // Ignore blob URLs
            const urlParts = url.split('Plant');
            const public_id = "Plant" + urlParts[urlParts.length - 1].split('.')[0];
            await deleteImage(public_id);
        }));

        // รอจนกระทั่งอัปเดตทุกอย่างเสร็จ
        await Promise.all(potPromises);

        const plantMoreImagePromises = plantMoreImages.map(async (plantMoreImg, index) => {
            if (plantMoreImg.file) {
                const plantMoreImgFile = plantMoreImg.file;
                let plantMoreImgUrl: any;
                plantMoreImgUrl = await uploadImage(plantMoreImgFile, `Plant/${plant.name}/More_img`);
                plantMoreImgUrl = plantMoreImgUrl.secure_url || plantMoreImgUrl.url;
                handlePlantMoreImageChange(index, 'url', plantMoreImgUrl);
            }
            handlePlantMoreImageChange(index, 'plant_id', plant.id);
        });

        await Promise.all(deletePlantMoreImages.map(async (url) => {
            if (url.includes('blob')) return; // Ignore blob URLs
            const urlParts = url.split('Plant');
            const public_id = "Plant" + urlParts[urlParts.length - 1].split('.')[0];
            await deleteImage(public_id);
        }));

        await Promise.all(plantMoreImagePromises);

        const newPlantReviewPic = plantReviewPic.filter(p => !p.id);

        const updatedPlantReviewPic = plantReviewPic.filter(p => {
            const original = originalPlantReviewPic.find(o => o.id === p.id);

            if (original) {
                // เปรียบเทียบฟิลด์ที่สำคัญระหว่าง original และ p
                const hasChanges =
                    original.url !== p.url;
                return hasChanges;
            }
            // ถ้าไม่มี original ให้ไม่รวม
            return false;
        }).map(p => {
            // กรองแค่ฟิลด์ที่มีการเปลี่ยนแปลง
            const updatedFields: any = {};

            if (p.url !== originalPlantReviewPic.find(o => o.id === p.id)?.url) {
                updatedFields.url = p.url;
            }

            return {
                id: p.id,
                ...updatedFields
            };
        });

        const deletedPlantReviewPicIds = await Promise.all(
            originalPlantReviewPic
                .filter(o => !plantReviewPic.some(p => p.id === o.id))
                .map(async (o) => o.id)
        );

        const newPlantMoreImage = plantMoreImages.filter(p => !p.id);

        const updatedPlantMoreImage = plantMoreImages.filter(p => {
            const original = originalPlantMoreImages.find(o => o.id === p.id);

            if (original) {
                // เปรียบเทียบฟิลด์ที่สำคัญระหว่าง original และ p
                const hasChanges =
                    original.url !== p.url;
                return hasChanges;
            }
            // ถ้าไม่มี original ให้ไม่รวม
            return false;
        }).map(p => {
            // กรองแค่ฟิลด์ที่มีการเปลี่ยนแปลง
            const updatedFields: any = {};

            if (p.url !== originalPlantMoreImages.find(o => o.id === p.id)?.url) {
                updatedFields.url = p.url;
            }

            return {
                id: p.id,
                ...updatedFields
            };
        });

        const deletedPlantMoreImageIds = await Promise.all(
            originalPlantMoreImages
                .filter(o => !plantMoreImages.some(p => p.id === o.id))
                .map(async (o) => o.id)
        );

        const newPotOptions = potPairs.filter(p => !p.id);

        const updatedPotOptions = potPairs.filter(p => {
            const original = originalPotPairs.find(o => o.id === p.id);

            if (original) {
                // เปรียบเทียบฟิลด์ที่สำคัญระหว่าง original และ p
                const hasChanges =
                    original.pot_id !== p.pot_id ||
                    original.pot_color !== p.pot_color ||
                    original.height_with_pot !== p.height_with_pot ||
                    original.price_with_pot !== p.price_with_pot ||
                    original.url !== p.url ||
                    original.is_suggested !== p.is_suggested;

                // ถ้ามีการเปลี่ยนแปลงในฟิลด์ใด ๆ ให้รวมไว้ใน updatedPotOptions
                return hasChanges;
            }
            // ถ้าไม่มี original ให้ไม่รวม
            return false;
        }).map(p => {
            // กรองแค่ฟิลด์ที่มีการเปลี่ยนแปลง
            const updatedFields: any = {};

            if (p.pot_id !== originalPotPairs.find(o => o.id === p.id)?.pot_id) {
                updatedFields.pot_id = p.pot_id;
            }
            if (p.pot_color !== originalPotPairs.find(o => o.id === p.id)?.pot_color) {
                updatedFields.pot_color = p.pot_color;
            }
            if (p.height_with_pot !== originalPotPairs.find(o => o.id === p.id)?.height_with_pot) {
                updatedFields.height_with_pot = p.height_with_pot;
            }
            if (p.price_with_pot !== originalPotPairs.find(o => o.id === p.id)?.price_with_pot) {
                updatedFields.price_with_pot = p.price_with_pot;
            }
            if (p.url !== originalPotPairs.find(o => o.id === p.id)?.url) {
                updatedFields.url = p.url;
            }
            if (p.is_suggested !== originalPotPairs.find(o => o.id === p.id)?.is_suggested) {
                updatedFields.is_suggested = p.is_suggested;
            }

            // ต้องการให้ทุกฟิลด์ที่มีการเปลี่ยนแปลงรวมอยู่ใน object
            return {
                id: p.id,
                ...updatedFields
            };
        });

        // ใช้กรองให้เฉพาะรายการที่ถูกลบจาก originalPotPairs เเละ ลบ ใน cloudinary
        const deletedPotOptionIds = await Promise.all(
            originalPotPairs
                .filter(o => !potPairs.some(p => p.id === o.id))  // ตรวจหาว่ามีหรือไม่ใน potPairs
                .map(async (o) => o.id)
        );

        console.log('📦 SUBMIT PAYLOAD:', {
            finalUpdatePlantData,
            newPotOptions,
            updatedPotOptions,
            deletedPotOptionIds,
            newPlantMoreImage,
            updatedPlantMoreImage,
            deletedPlantMoreImageIds,
            newPlantReviewPic,
            updatedPlantReviewPic,
            deletedPlantReviewPicIds
        });

        await onSubmit({ finalUpdatePlantData, 
                         newPotOptions,
                         updatedPotOptions, 
                         deletedPotOptionIds, 
                         newPlantMoreImage, 
                         updatedPlantMoreImage, 
                         deletedPlantMoreImageIds, 
                         newPlantReviewPic, 
                         updatedPlantReviewPic, 
                         deletedPlantReviewPicIds });
        setIsPending(false);
    }


    if (loading || !plant) {
        return <div className="p-6 text-center text-gray-500">Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 max-w-3xl pb-1 max-h-[calc(100vh-100px)] overflow-y-auto">
            {isPending && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 z-50 flex items-center justify-center">
                    <CircularProgress />
                </div>
            )}
            <button onClick={onCancel} type="button" className="text-black-600">
                <ArrowBackIosNewIcon fontSize="small" /> Back
            </button>

            <h2 className="text-2xl font-bold mb-4">Plant Form</h2>

            <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                    type="text"
                    value={plant.name || ''}
                    onChange={(e) => handleChangePlant('name', e.target.value)}
                    disabled={initialData !== ""}
                    className="w-full border px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Eng Name</label>
                <input
                    type="text"
                    value={plant.eng_name || ''}
                    onChange={(e) => handleChangePlant('eng_name', e.target.value)}
                    className="w-full border px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Height</label>
                <input
                    type="text"
                    value={plant.height || ''}
                    onChange={(e) => handleChangePlant('height', e.target.value)}
                    className="w-full border px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Width</label>
                <input
                    type="text"
                    value={plant.width || ''}
                    onChange={(e) => handleChangePlant('width', e.target.value)}
                    className="w-full border px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                    type="text"
                    value={plant.price || ''}
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

            <h3 className="text-lg font-semibold mb-2 mt-6">Review Pic</h3>
            <div className="space-y-4">
                {plantReviewPic.map((img, index) => (
                    <div key={index} className="flex items-center gap-4 relative border p-3 rounded shadow-sm bg-gray-50">
                        {/* Input file */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const updated = [...plantReviewPic];
                                // เก็บไฟล์สำหรับ upload
                                updated[index].file = file;
                                // ถ้ามี url เดิมให้ลบออก Cloudinary
                                if (updated[index].url) {
                                    setDeletePlantReviewPic(prev => [...prev, updated[index].url]);
                                }
                                // preview
                                updated[index].url = URL.createObjectURL(file);
                                setPlantReviewPic(updated);
                            }}
                            className="w-full border px-3 py-2"
                        />

                        {/* Preview */}
                        <div className="w-32 h-32 overflow-hidden flex items-center justify-center relative">
                            {img.url ? (
                                <>
                                    <img
                                        src={img.url}
                                        alt={`More ${index + 1}`}
                                        className="w-full h-full object-cover border rounded"
                                    />
                                    {/* Delete button */}
                                    <button
                                        type="button"
                                        onClick={() => removePlantReviewPic(index, img.id)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        ×
                                    </button>
                                </>
                            ) : (
                                <span className="text-gray-400 text-sm">No Image</span>
                            )}
                             <button
                                        type="button"
                                        onClick={() => removePlantReviewPic(index, img.id)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        ×
                                    </button>
                        </div>
                    </div>
                ))}

                {/* Add More Image button */}
                <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={addPlantReviewPic}
                >
                    + Add More Image
                </button>
            </div>

            {/* <h3 className="text-lg font-semibold mb-2 mt-6">Image with Environment</h3>
            <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Upload Images</h3>
                <div className="flex space-x-4">
                   
                    <div className="w-1/2">
                        <label className="block text-sm font-medium mb-2">Image 1</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleAdditionImageChange(e, 0)}
                            className="w-full border px-3 py-2"
                        />
                        <div className="mt-2">
                            {additionImages && additionImages[0] ? (
                                <img
                                    src={additionImages[0]}
                                    alt="Preview 1"
                                    className="w-full h-48 object-cover border rounded"
                                />
                            ) : (
                                <span className="text-gray-400">No image selected</span>
                            )}
                        </div>
                    </div>

                 
                    <div className="w-1/2">
                        <label className="block text-sm font-medium mb-2">Image 2</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleAdditionImageChange(e, 1)}
                            className="w-full border px-3 py-2"
                        />
                        <div className="mt-2">
                            {additionImages && additionImages[1] ? (
                                <img
                                    src={additionImages[1]}
                                    alt="Preview 2"
                                    className="w-full h-48 object-cover border rounded"
                                />
                            ) : (
                                <span className="text-gray-400">No image selected</span>
                            )}
                        </div>
                    </div>
                </div>
            </div> */}
            <h3 className="text-lg font-semibold mb-2 mt-6">Similar Plant</h3>
            <FormControl sx={{ width: 300 }}>
                <InputLabel>Similar Plants</InputLabel>
                <Select
                    multiple
                    value={selectedSimilar}
                    onChange={handleSelectSimilarChange}
                    input={<OutlinedInput label="Similar Plants" />}
                    renderValue={(selected) =>
                        (selected as string[])
                            .map(id => allPlants.find(p => p.id === id)?.name ?? id)
                            .join(', ')
                    }
                    MenuProps={MenuProps}
                >
                    {allPlants.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                            <Checkbox checked={selectedSimilarSet.has(p.id)} />
                            <ListItemText primary={p.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <h3 className="text-lg font-semibold mb-2 mt-6">Matched Pots</h3>
            {potPairs.map((pair, index) => (
                <div key={index} className="relative border p-4 mb-4 rounded shadow-sm bg-gray-50">
                    <IconButton
                        size="small"
                        onClick={() => removePotPair(index, pair.id)}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'white',
                            '&:hover': {
                                backgroundColor: '#fdd',
                            },
                        }}
                    >
                        <CloseIcon fontSize="small" sx={{ color: 'red' }} />
                    </IconButton>
                    <div className="flex items-center gap-4 mt-5">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Pot</label>
                            <select
                                value={pair.pot_id}
                                onChange={(e) => handlePotChange(index, 'pot_id', e.target.value)}
                                className="border w-full px-3 py-2"
                            >
                                <option value="">Select Pot</option>
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
                            <label className="block text-sm font-medium mb-1">Price with Pot</label>
                            <input
                                type="text"
                                value={pair.price_with_pot}
                                onChange={(e) => handlePotChange(index, 'price_with_pot', e.target.value)}
                                className="border px-3 py-2"
                            />
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
                            {Object.values(Color).map((color) => (
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
                                    if (updated[index].url != '') {
                                        setDeletePotPairImages(prev => [...prev, updated[index].url]);
                                    }
                                    updated[index].url = URL.createObjectURL(file);
                                    setPotPairs(updated);
                                }
                            }}

                        />
                        <div className="mt-2">
                            {pair.url ? (
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

            <h3 className="text-lg font-semibold mb-2 mt-6">More Images of Plant</h3>
            <div className="space-y-4">
                {plantMoreImages.map((img, index) => (
                    <div key={index} className="flex items-center gap-4 relative border p-3 rounded shadow-sm bg-gray-50">
                        {/* Input file */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const updated = [...plantMoreImages];
                                // เก็บไฟล์สำหรับ upload
                                updated[index].file = file;
                                // ถ้ามี url เดิมให้ลบออก Cloudinary
                                if (updated[index].url) {
                                    setDeletePlantMoreImages(prev => [...prev, updated[index].url]);
                                }
                                // preview
                                updated[index].url = URL.createObjectURL(file);
                                setPlantMoreImages(updated);
                            }}
                            className="w-full border px-3 py-2"
                        />

                        {/* Preview */}
                        <div className="w-32 h-32 overflow-hidden flex items-center justify-center relative">
                            {img.url ? (
                                <>
                                    <img
                                        src={img.url}
                                        alt={`More ${index + 1}`}
                                        className="w-full h-full object-cover border rounded"
                                    />
                                    {/* Delete button */}
                                    <button
                                        type="button"
                                        onClick={() => removePlantMoreImage(index, img.id)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        ×
                                    </button>
                                </>
                            ) : (
                                <span className="text-gray-400 text-sm">No Image</span>
                            )}
                        </div>
                    </div>
                ))}

                {/* Add More Image button */}
                <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={addPlantMoreImage}
                >
                    + Add More Image
                </button>
            </div>


            {/* Bottom Floating Button */}
            <div className="sticky bottom-0 bg-white pt-6 pb-4 flex justify-end gap-4 border-t mt-10 z-10">
                {onCancel && (
                    <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Save
                </button>
            </div>

        </form>
    );
}
