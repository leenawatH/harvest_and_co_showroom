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

import { getAllPots, getPotById } from '@/lib/service/potService';
import { uploadImage, deleteImage } from '@/lib/service/cloudinaryService';
import { Pot, Pot_Img, Color } from '@/lib/types/types';

interface PotFormProps {
    initialData: string; // ใช้ potId
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

export default function PotForm({ initialData, onSubmit, onCancel }: PotFormProps) {
    const [loading, setLoading] = useState<boolean>(true);

    const [pot, setPot] = useState<Pot | null>(null);
    const [originalPot, setOriginalPot] = useState<Pot | null>(null);
    const [allPots, setAllPots] = useState<Pot[]>([]);
    const [selectedSimilar, setSelectedSimilar] = useState<string[]>([]);
    const selectedSimilarSet = useMemo(() => new Set(selectedSimilar), [selectedSimilar]);
    const [additionImages, setAdditionImages] = useState<string[]>([]);
    const [deleteAdditionImages, setDeleteAdditionImages] = useState<string[]>([])
    const additionImageFileRef = useRef<File[]>(new Array(2));

    //Match Pots
    const [potColors, setPotColors] = useState<Pot_Img[]>([]);
    const [originalpotColors, setOriginalpotColors] = useState<Pot_Img[]>([]);
    const [deletePotColorImages, setDeletePotColorImages] = useState<string[]>([])

    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [potData, potsList] = await Promise.all([
                    getPotById(initialData),
                    getAllPots(),

                ]);
                setPot(potData);
                console.log('Fetched Pot Data:', potData);
                setOriginalPot(potData);
                setPotColors(JSON.parse(JSON.stringify(potData.pot_colors ?? [])));
                setOriginalpotColors(JSON.parse(JSON.stringify(potData.pot_colors ?? [])));
                setAllPots(potsList);
                if (potData.addition_img != null) {
                    setAdditionImages(potData.addition_img);
                } else {
                    setAdditionImages([]);
                }
                if (potData.similar_pot != null) {
                    setSelectedSimilar(potData.similar_pot);
                } else {
                    setSelectedSimilar([]);
                }
                setDeleteAdditionImages([]);

            } catch (err) {
                console.error('Error loading pot data:', err);
            }
            setLoading(false);
        };
        fetchData();
    }, [initialData]);

    function handleChangePot(field: keyof Pot, value: string) {
        if (!pot) return;
        setPot({ ...pot, [field]: value });
    }

    function handlePotChange(index: number, field: keyof Pot_Img, value: string) {
        const updated = [...potColors];
        (updated[index] as any)[field] = value;
        setPotColors(updated);
    }

    function removePotColor(index: number, pairId: string | null) {
        if (pairId != null) {
            setDeletePotColorImages(prev => [...prev, potColors[index].url]);
        }
        const updated = [...potColors];
        updated.splice(index, 1);
        setPotColors(updated);
    }

    function addNewPorColor() {
        setPotColors([...potColors, {
            id: '',
            pot_id: '',
            pot_color: null,
            url: '',
            file: null
        }]);
    }

    const handleSelectSimilarChange = (
        event: React.ChangeEvent<HTMLInputElement> | (Event & { target: { value: string[]; name?: string } }),
        child?: React.ReactNode
    ) => {
        const value =
            typeof event.target.value === 'string'
                ? event.target.value.split(',')
                : (event.target.value as string[]);
        if (value.length <= 3) {
            setSelectedSimilar(value);
            if (pot) {
                setPot({ ...pot, similar_pot: value }); // Update similar_pot_ids in pot
            }
        }
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

            if (pot) {
                const updatedPot = { ...pot, addition_img: newImages };
                setPot(updatedPot);
            }
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        setIsPending(true);
        e.preventDefault();
        if (!pot) return;

        if (!originalPot) return;

        if (!originalpotColors) return;

        // pot info Update
        let resultsUrl = [];
        for (let i = 0; i < additionImageFileRef.current.length; i++) {
            if (additionImageFileRef.current[i] != null) {
                resultsUrl[i] = await uploadImage(additionImageFileRef.current[i], `Pot/${pot.name}/Addition_img`);
                resultsUrl[i] = resultsUrl[i].secure_url || resultsUrl[i].url;
            } else {
                resultsUrl[i] = additionImages[i] || null;
            }
        }

        deleteAdditionImages.forEach(async (url) => {
            const urlParts = url.split('Pot');
            const public_id = "Pot" + urlParts[urlParts.length - 1].split('.')[0];
            await deleteImage(public_id);
        });

        additionImageFileRef.current = [];

        const finalPot = resultsUrl.length > 0
            ? { ...pot, addition_img: resultsUrl }
            : pot;
        const updatedPotData: Partial<Pot> = {};

        updatedPotData.id = finalPot.id;
        if (pot.name !== originalPot.name) updatedPotData.name = finalPot.name;
        if (pot.height !== originalPot.height) updatedPotData.height = finalPot.height;
        if (pot.price !== originalPot.price) updatedPotData.price = finalPot.price;
        if (pot.circumference !== originalPot.circumference) updatedPotData.circumference = finalPot.circumference;
        if (pot.onShow_color !== originalPot.onShow_color) updatedPotData.onShow_color = finalPot.onShow_color;
        if (pot.is_suggested !== originalPot.is_suggested) updatedPotData.is_suggested = finalPot.is_suggested;
        if (pot.similar_pot !== originalPot.similar_pot) updatedPotData.similar_pot = finalPot.similar_pot;
        if (pot.addition_img !== originalPot.addition_img) updatedPotData.addition_img = finalPot.addition_img;

        const finalUpdatePotData = Object.keys(updatedPotData).length > 1 ? updatedPotData : null;

        // อัปเดตข้อมูล Pot
        const potPromises = potColors.map(async (pair, index) => {
            if (pair.file) {
                const PotColorFile = pair.file;
                let PotColorUrl: any;
                PotColorUrl = await uploadImage(PotColorFile, `Pot/${pot.name}`);
                PotColorUrl = PotColorUrl.secure_url || PotColorUrl.url;
                handlePotChange(index, 'url', PotColorUrl);
            }
            handlePotChange(index, 'pot_id', pot.id);
        });

        // ลบ Pot Pair ที่ถูกลบ
        await Promise.all(deletePotColorImages.map(async (url) => {
            if (url.includes('blob')) return; // Ignore blob URLs
            const urlParts = url.split('Pot');
            const public_id = "Pot" + urlParts[urlParts.length - 1].split('.')[0];
            await deleteImage(public_id);
        }));

        // รอจนกระทั่งอัปเดตทุกอย่างเสร็จ
        await Promise.all(potPromises);

        const newPotOptions = potColors.filter(p => !p.id);

        const updatedPotOptions = potColors.filter(p => {
            const original = originalpotColors.find(o => o.id === p.id);

            if (original) {
                // เปรียบเทียบฟิลด์ที่สำคัญระหว่าง original และ p
                const hasChanges =
                    original.pot_id !== p.pot_id ||
                    original.pot_color !== p.pot_color ||
                    original.url !== p.url;

                // ถ้ามีการเปลี่ยนแปลงในฟิลด์ใด ๆ ให้รวมไว้ใน updatedPotOptions
                return hasChanges;
            }
            // ถ้าไม่มี original ให้ไม่รวม
            return false;
        }).map(p => {
            // กรองแค่ฟิลด์ที่มีการเปลี่ยนแปลง
            const updatedFields: any = {};

            if (p.pot_id !== originalpotColors.find(o => o.id === p.id)?.pot_id) {
                updatedFields.pot_id = p.pot_id;
            }
            if (p.pot_color !== originalpotColors.find(o => o.id === p.id)?.pot_color) {
                updatedFields.pot_color = p.pot_color;
            }

            if (p.url !== originalpotColors.find(o => o.id === p.id)?.url) {
                updatedFields.url = p.url;
            }

            // ต้องการให้ทุกฟิลด์ที่มีการเปลี่ยนแปลงรวมอยู่ใน object
            return {
                id: p.id,
                ...updatedFields
            };
        });

        // ใช้กรองให้เฉพาะรายการที่ถูกลบจาก originalpotColors เเละ ลบ ใน cloudinary
        const deletedPotOptionIds = await Promise.all(
            originalpotColors
                .filter(o => !potColors.some(p => p.id === o.id))  // ตรวจหาว่ามีหรือไม่ใน potColors
                .map(async (o) => o.id)
        );

        console.log('📦 SUBMIT PAYLOAD:', {
            finalUpdatePotData,
            newPotOptions,
            updatedPotOptions,
            deletedPotOptionIds
        });

        await onSubmit({ finalUpdatePotData, newPotOptions, updatedPotOptions, deletedPotOptionIds });
        setIsPending(false);
    }


    if (loading || !pot) {
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

            <h2 className="text-2xl font-bold mb-4">Pot Form</h2>

            <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                    type="text"
                    value={pot.name || ''}
                    onChange={(e) => handleChangePot('name', e.target.value)}
                    className="w-full border px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Height</label>
                <input
                    type="text"
                    value={pot.height || ''}
                    onChange={(e) => handleChangePot('height', e.target.value)}
                    className="w-full border px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                    type="text"
                    value={pot.price || ''}
                    onChange={(e) => handleChangePot('price', e.target.value)}
                    className="w-full border px-3 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Circumference</label>
                <input
                    type="text"
                    value={pot.circumference || ''}
                    onChange={(e) => handleChangePot('circumference', e.target.value)}
                    className="w-full border px-3 py-2"
                />
            </div>
            <div className="mt-2">
                <label className="block text-sm font-medium mb-1">On Show Color</label>

                {potColors.length === 0 ? (
                    <p className="text-gray-500 text-sm">Add at least one pot color.</p>
                ) : (
                    <div className="space-y-4">
                        <select
                            value={pot.onShow_color ?? ''} // ใช้ pot.onShow_color ถ้ามีค่า ถ้าไม่มีก็ให้เป็น ''
                            onChange={(e) => handleChangePot('onShow_color', e.target.value)} // เมื่อมีการเลือกสีให้ update
                            className="w-full border px-3 py-2"
                        >
                            <option value="">Select color</option>  {/* ค่านี้จะถูกเลือกหากไม่มีสีที่เลือก */}
                            {Object.values(Color).map((color) => ( // ตรวจสอบว่า PotColor มีสีที่ต้องการหรือไม่
                                <option key={color} value={color}>{color}</option> // แสดงตัวเลือกสี
                            ))}
                        </select>
                        <div className="w-32 h-32 overflow-hidden flex items-center justify-center">
                            {(() => {
                                const cover = potColors.find(p => pot.onShow_color === p.pot_color);
                                return cover && cover.url ? (
                                    <img
                                        src={cover.url}
                                        alt="Cover Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm text-gray-400">Not Add Yet</span>
                                );
                            })()}
                        </div>
                    </div>
                )}
            </div>

            <h3 className="text-lg font-semibold mb-2 mt-6">Image with Environment</h3>
            <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Upload Images</h3>
                <div className="flex space-x-4">
                    {/* First Image */}
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

                    {/* Second Image */}
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
            </div>
            <h3 className="text-lg font-semibold mb-2 mt-6">Similar Pot</h3>
            <FormControl sx={{ width: 300 }}>
                <InputLabel>Similar Pots</InputLabel>
                <Select
                    multiple
                    value={selectedSimilar}
                    onChange={handleSelectSimilarChange}
                    input={<OutlinedInput label="Similar Pots" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {allPots.map((pot) => (
                        <MenuItem key={pot.id} value={pot.name}>
                            <Checkbox checked={selectedSimilarSet.has(pot.name)} />
                            <ListItemText primary={pot.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>


            <h3 className="text-lg font-semibold mb-2 mt-6">Pot Color</h3>
            {potColors.map((pair, index) => (
                <div
                    key={index}
                    className="relative border p-4 mb-4 rounded shadow-sm bg-gray-50"
                >
                    <IconButton
                        size="small"
                        onClick={() => removePotColor(index, pair.id)}
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

                    <div className="mt-2">
                        <label className="block text-sm font-medium mb-1">Color</label>
                        <select
                            value={pair.pot_color ?? ''}
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
                                    const updated = [...potColors];
                                    updated[index].file = file;
                                    if (updated[index].url != '') {
                                        setDeletePotColorImages(prev => [...prev, updated[index].url]);
                                    }
                                    updated[index].url = URL.createObjectURL(file);
                                    setPotColors(updated);
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

            <button type="button" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={addNewPorColor}>
                + Add Pot
            </button>

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
