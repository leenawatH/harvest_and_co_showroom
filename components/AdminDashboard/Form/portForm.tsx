'use client';

import { useState, useEffect, useRef, useMemo, ChangeEvent } from 'react';
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
import PanoramaRoundedIcon from '@mui/icons-material/PanoramaRounded';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import ViewWeekRoundedIcon from '@mui/icons-material/ViewWeekRounded';

import { getAllPort, getPortById } from '@/lib/service/portService';
import { uploadImage, deleteImage } from '@/lib/service/cloudinaryService';
import { Port, Port_Middle_Sections, Port_Bottom_Groups } from '@/lib/types/types';

interface PortFormProps {
    initialData: string;
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

export default function PortForm({ initialData, onSubmit, onCancel }: PortFormProps) {
    const [loading, setLoading] = useState<boolean>(true);

    const [port, setPort] = useState<Port | null>(null);
    const [originalPort, setOriginalPort] = useState<Port | null>(null);

    const [port_middle_sections, setPort_middle_sections] = useState<Port_Middle_Sections[]>([]);
    const [originalPort_middle_sections, setOriginalPort_middle_sections] = useState<Port_Middle_Sections[]>([]);

    const [port_bottom_groups, setPort_bottom_groups] = useState<Port_Bottom_Groups[]>([]);
    const [originalPort_bottom_groups, setOriginalPort_bottom_groups] = useState<Port_Bottom_Groups[]>([]);

    const [allPorts, setAllPorts] = useState<Port[]>([]);
    const [selectedSimilar, setSelectedSimilar] = useState<string[]>([]);
    const selectedSimilarSet = useMemo(() => new Set(selectedSimilar), [selectedSimilar]);
    const [deleteImages, setDeleteImages] = useState<string[]>([])

    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [portData, portList] = await Promise.all([
                    getPortById(initialData),
                    getAllPort(),
                ]);
                setPort(portData);
                setOriginalPort(portData);

                setPort_middle_sections(JSON.parse(JSON.stringify(portData.port_middle_sections ?? [])));
                setOriginalPort_middle_sections(JSON.parse(JSON.stringify(portData.port_middle_sections ?? [])));
              
                setPort_bottom_groups(JSON.parse(JSON.stringify(portData.port_bottom_groups ?? [])));
                setOriginalPort_bottom_groups(JSON.parse(JSON.stringify(portData.port_bottom_groups ?? [])));

                setAllPorts(portList);

                setDeleteImages([]);

            } catch (err) {
                console.error('Error loading port data:', err);
            }
            setLoading(false);
        };
        fetchData();
    }, [initialData]);

    function handleChangePort(field: keyof Port, value: string) {
        if (!port) return;
        setPort({ ...port, [field]: value });
    }

    function handleChangePort_Middle_Sections(index: number, field: keyof Port_Middle_Sections, value: any) {
        const updated = [...port_middle_sections];
        if (field == 'image_url') {
            setDeleteImages(prev => [...prev, port_middle_sections[index].image_url]);
        }
        (updated[index] as any)[field] = value;
        setPort_middle_sections(updated);
    }
    function handleChangePort_Bottom_Groups(index: number, field: keyof Port_Bottom_Groups, value: any) {
        const updated = [...port_bottom_groups];
        (updated[index] as any)[field] = value;
        setPort_bottom_groups(updated);
    }

    function addPort_Middle_Sections() {
        if (!port) return;
        setPort_middle_sections([...port_middle_sections, {
            id: '',
            port_id: port.id,
            title: '',
            detail: '',
            image_url: '',
            position: 1,
            file: null
        }]);
    }

    function addPort_bottom_groups() {
        if (!port) return;

        setPort_bottom_groups([...port_bottom_groups, {
            id: '',
            port_id: port.id,
            pattern: 1,
            image_url_1: '',
            image_url_2: '',
            image_url_3: '',
            file1: null,
            file2: null,
            file3: null,
        }]);
    }

    function removeMiddleSection(index: number, port_middle_section_Id: string | null) {
        if (port_middle_section_Id != null) {
            setDeleteImages(prev => [...prev, port_middle_sections[index].image_url]);
        }
        const updated = [...port_middle_sections];
        updated.splice(index, 1);
        setPort_middle_sections(updated);
    }

    async function removeBottomGroup(groupIdx: number) {
        const updatedGroups = [...port_bottom_groups];
        const groupToRemove = updatedGroups.splice(groupIdx, 1)[0];
        // ลบ port_bottom_images ของกลุ่มนี้ด้วย
        if (port_bottom_groups[groupIdx].image_url_1.startsWith("https://")) {
            setDeleteImages(prev => [...prev, port_bottom_groups[groupIdx].image_url_1]);
        }
        if (port_bottom_groups[groupIdx].image_url_2.startsWith("https://")) {
            setDeleteImages(prev => [...prev, port_bottom_groups[groupIdx].image_url_2]);
        }
        if (port_bottom_groups[groupIdx].image_url_3.startsWith("https://")) {
            setDeleteImages(prev => [...prev, port_bottom_groups[groupIdx].image_url_3]);
        }


        setPort_bottom_groups(updatedGroups);
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
            if (port) {
                setPort({ ...port, similar_port: value });
            }
        }
    };

    const handlePatternChange = (groupIdx: number, pattern: 1 | 2 | 3) => {
        if (!port) return;
        console.log("pattern : " + pattern)
        const new_port_bottom_images = {
            id: '',
            group_id: '',
            position: 1,
            image_url: '',
            file: null
        }

        handleChangePort_Bottom_Groups(groupIdx, "pattern", pattern);

    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imgID: number, index: number, type: string) => {
        const file = e.target.files?.[0];
        if (file) {
            if (type === 'cover') {
                if (port) {
                    if (port.image_cover && !port.image_cover.includes('blob')) {
                        setDeleteImages(prev => [...prev, port.image_cover]);
                    }
                    const previewUrl = URL.createObjectURL(file);
                    setPort({ ...port, image_cover: previewUrl, file: file });
                }

            } else if (type === 'middle') {
                if (port_middle_sections[index].image_url && !port_middle_sections[index].image_url.includes('blob')) {
                    setDeleteImages(prev => [...prev, port_middle_sections[index].image_url]);
                }
                const previewUrl = URL.createObjectURL(file);
                handleChangePort_Middle_Sections(index, "image_url", previewUrl);
                handleChangePort_Middle_Sections(index, "file", file);
            } else if (type === 'bottom') {
                if (imgID === 0) {
                    if (port_bottom_groups[index].image_url_1 && !port_bottom_groups[index].image_url_1.includes('blob')) {
                        setDeleteImages(prev => [...prev, port_bottom_groups[index].image_url_1]);
                    }
                    const previewUrl = URL.createObjectURL(file);
                    handleChangePort_Bottom_Groups(index, 'image_url_1', previewUrl);
                    handleChangePort_Bottom_Groups(index, "file1", file);
                }
                if (imgID === 1) {
                    if (port_bottom_groups[index].image_url_2 && !port_bottom_groups[index].image_url_2.includes('blob')) {
                        setDeleteImages(prev => [...prev, port_bottom_groups[index].image_url_2]);
                    }
                    const previewUrl = URL.createObjectURL(file);
                    handleChangePort_Bottom_Groups(index, 'image_url_2', previewUrl);
                    handleChangePort_Bottom_Groups(index, "file2", file);
                }
                if (imgID === 2) {
                    if (port_bottom_groups[index].image_url_3 && !port_bottom_groups[index].image_url_3.includes('blob')) {
                        setDeleteImages(prev => [...prev, port_bottom_groups[index].image_url_3]);
                    }
                    const previewUrl = URL.createObjectURL(file);
                    handleChangePort_Bottom_Groups(index, 'image_url_3', previewUrl);
                    handleChangePort_Bottom_Groups(index, "file3", file);
                }
            }

        }
    };

    async function handleSubmit(e: React.FormEvent) {
        setIsPending(true);
        e.preventDefault();
        if (!port) return;

        if (!originalPort) return;

        console.log('📦 SUBMITTING PORT DATA:', port.file);

        //Cover image
        let finalImageCover = port.image_cover;
        if (port.file) {
            const url = await uploadImage(port.file, `Port/${port.title}`);

            const coverUrl = url.secure_url || url.url;

            finalImageCover = coverUrl;

        }

        const updatedPortData: Partial<Port> = {};

        updatedPortData.id = port.id;
        if (port.title !== originalPort.title) updatedPortData.title = port.title;
        if (port.location !== originalPort.location) updatedPortData.location = port.location;
        if (finalImageCover !== originalPort.image_cover) updatedPortData.image_cover = finalImageCover;
        if (port.description !== originalPort.description) updatedPortData.description = port.description;
        if (port.similar_port !== originalPort.similar_port) updatedPortData.similar_port = port.similar_port;

        const finalUpdatePortData = Object.keys(updatedPortData).length > 1 ? updatedPortData : null;

        //PORT MIDDLE SECTION

        const middlePromises = port_middle_sections.map(async (middle, index) => {
            if (middle.file) {
                const middleFile = middle.file;
                let middleUrl: any;
                middleUrl = await uploadImage(middleFile, `Port/${port.title}/Middle_Section`);
                middleUrl = middleUrl.secure_url || middleUrl.url;
                handleChangePort_Middle_Sections(index, 'image_url', middleUrl);
            }
        });

        const bottomPromises = port_bottom_groups.map(async (bottom, index) => {
            if (bottom.file1) {
                const bottomFile = bottom.file1;
                let bottomUrl: any;
                bottomUrl = await uploadImage(bottomFile, `Port/${port.title}/Bottom_Group`);
                bottomUrl = bottomUrl.secure_url || bottomUrl.url;
                handleChangePort_Bottom_Groups(index, 'image_url_1', bottomUrl);
            }
            if (bottom.file2) {
                const bottomFile = bottom.file2;
                let bottomUrl: any;
                bottomUrl = await uploadImage(bottomFile, `Port/${port.title}/Bottom_Group`);
                bottomUrl = bottomUrl.secure_url || bottomUrl.url;
                handleChangePort_Bottom_Groups(index, 'image_url_2', bottomUrl);
            }
            if (bottom.file3) {
                const bottomFile = bottom.file3;
                let bottomUrl: any;
                bottomUrl = await uploadImage(bottomFile, `Port/${port.title}/Bottom_Group`);
                bottomUrl = bottomUrl.secure_url || bottomUrl.url;
                handleChangePort_Bottom_Groups(index, 'image_url_3', bottomUrl);
            }
        });

        console.log('📦 DELETE IMAGES:', deleteImages);

        await Promise.all(deleteImages.map(async (url) => {
            console.log("🔧 Deleting image:", url);
            if (url == "") return;
            if (url.includes('blob')) return; // Ignore blob URLs
            const urlParts = url.split('Port');
            const public_id = "Port" + urlParts[urlParts.length - 1].split('.')[0];
            await deleteImage(public_id);
        }));

        // รอจนกระทั่งอัปเดตทุกอย่างเสร็จ
        await Promise.all(middlePromises);
        await Promise.all(bottomPromises);

        const newPort_middle_sections = port_middle_sections.filter(p => !p.id);

        console.log('originalPort_middle_sections', originalPort_middle_sections);
        console.log('port_middle_sections', port_middle_sections);

        const updatedPort_middle_sections = port_middle_sections.filter(p => {
            const original = originalPort_middle_sections.find(o => o.id === p.id);

            if (original) {

                const hasChanges =
                    original.title !== p.title ||
                    original.detail !== p.detail ||
                    original.position !== p.position ||
                    original.image_url !== p.image_url;

                return hasChanges;
            }

            return false;
        }).map(p => {

            const updatedFields: any = {};

            if (p.detail !== originalPort_middle_sections.find(o => o.id === p.id)?.detail) {
                updatedFields.detail = p.detail;
            }
            if (p.image_url !== originalPort_middle_sections.find(o => o.id === p.id)?.image_url) {
                updatedFields.image_url = p.image_url;
            }
            if (p.position !== originalPort_middle_sections.find(o => o.id === p.id)?.position) {
                updatedFields.position = p.position;
            }
            if (p.title !== originalPort_middle_sections.find(o => o.id === p.id)?.title) {
                updatedFields.title = p.title;
            }

            return {
                id: p.id,
                ...updatedFields
            };
        });

        const deletedPort_middle_sections = await Promise.all(
            originalPort_middle_sections
                .filter(o => !port_middle_sections.some(p => p.id === o.id))
                .map(async (o) => o.id)
        );

        //PORT BOTTOM GROUP

        const newPort_bottom_group = port_bottom_groups.filter(p => !p.id);

        const updatedPort_bottom_group = port_bottom_groups.filter(p => {
            const original = originalPort_bottom_groups.find(o => o.id === p.id);

            if (original) {

                const hasChanges =
                    original.pattern !== p.pattern ||
                    original.image_url_1 !== p.image_url_1 ||
                    original.image_url_2 !== p.image_url_2 ||
                    original.image_url_3 !== p.image_url_3;

                return hasChanges;
            }

            return false;
        }).map(p => {

            const updatedFields: any = {};

            if (p.pattern !== originalPort_bottom_groups.find(o => o.id === p.id)?.pattern) {
                updatedFields.pattern = p.pattern;
            }
            if (p.image_url_1 !== originalPort_bottom_groups.find(o => o.id === p.id)?.image_url_1) {
                updatedFields.image_url_1 = p.image_url_1;
            }
            if (p.image_url_2 !== originalPort_bottom_groups.find(o => o.id === p.id)?.image_url_2) {
                updatedFields.image_url_2 = p.image_url_2;
            }
            if (p.image_url_3 !== originalPort_bottom_groups.find(o => o.id === p.id)?.image_url_3) {
                updatedFields.image_url_3 = p.image_url_3;
            }

            return {
                id: p.id,
                ...updatedFields
            };
        });

        const deletedPort_bottom_group = await Promise.all(
            originalPort_bottom_groups
                .filter(o => !port_bottom_groups.some(p => p.id === o.id))
                .map(async (o) => o.id)
        );


        console.log('📦 SUBMIT PAYLOAD:', {
            finalUpdatePortData,
            newPort_middle_sections,
            updatedPort_middle_sections,
            deletedPort_middle_sections,
            newPort_bottom_group,
            updatedPort_bottom_group,
            deletedPort_bottom_group,
        });

        await onSubmit({
            finalUpdatePortData,
            newPort_middle_sections,
            updatedPort_middle_sections,
            deletedPort_middle_sections,
            newPort_bottom_group,
            updatedPort_bottom_group,
            deletedPort_bottom_group,

        });
        setIsPending(false);
    }

    if (loading || !port) {
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

            <h2 className="text-2xl font-bold mb-4">Port Form</h2>

            {/* Title */}
            <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={port?.title || ''} onChange={(e) => handleChangePort('title', e.target.value)} disabled={initialData !== ""} className="w-full border px-3 py-2" />
            </div>

            {/* Location */}
            <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input type="text" value={port?.location || ''} onChange={(e) => handleChangePort('location', e.target.value)} className="w-full border px-3 py-2" />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={port?.description || ''} onChange={(e) => handleChangePort('description', e.target.value)} rows={4} className="w-full border px-3 py-2" />
            </div>

            {/* Cover Image */}
            <h3 className="text-lg font-semibold mb-2 mt-6">Cover Image</h3>
            <div className="space-y-6">
                <div className="flex space-x-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 0, 0, 'cover')}
                        className="w-full border px-3 py-2"
                    />
                </div>
                <div className="mt-2">
                    {port && port.image_cover ? (
                        <img
                            src={port.image_cover}
                            alt="Preview 1"
                            className="w-40 h-auto object-cover border rounded"
                        />
                    ) : (
                        <span className="text-gray-400">No image selected</span>
                    )}
                </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 mt-6">Similar Port</h3>
            <FormControl sx={{ width: 300 }}>
                <InputLabel>Similar Ports</InputLabel>
                <Select
                    multiple
                    value={selectedSimilar}
                    onChange={handleSelectSimilarChange}
                    input={<OutlinedInput label="Similar Port" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {allPorts.map((port) => (
                        <MenuItem key={port.id} value={port.title}>
                            <Checkbox checked={selectedSimilarSet.has(port.title)} />
                            <ListItemText primary={port.title} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Middle Sections */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Middle Sections</h3>
                    <button type="button" onClick={addPort_Middle_Sections} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">+ Add Section</button>
                </div>
                {port_middle_sections.map((port_ms, index) => (
                    <div key={index} className="relative border p-4 mb-4 rounded shadow-sm bg-gray-50">
                        <IconButton
                            size="small"
                            onClick={() => removeMiddleSection(index, port_ms.id)}
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
                        <div key={index} className="border p-4 mb-4 rounded flex gap-6">
                            <div className="w-1/2 space-y-2">
                                <input type="text" placeholder="Section Title" value={port_ms.title} onChange={(e) => {
                                    handleChangePort_Middle_Sections(index, "title", e.target.value);
                                }} className="w-full border px-3 py-2" />
                                <textarea placeholder="Section Detail" value={port_ms.detail} onChange={(e) => {
                                    handleChangePort_Middle_Sections(index, "detail", e.target.value);
                                }} rows={4} className="w-full border px-3 py-2" />
                            </div>
                            <div className="w-1/2 space-y-2">
                                <label className="block text-sm font-medium">Section Image</label>
                                <input type="file" accept="image/*"
                                    onChange={(e) => handleImageChange(e, 0, index, 'middle')}
                                    className="w-full" />
                                {port_ms.image_url ? (
                                    <img src={port_ms.image_url} alt={`Middle Section ${index + 1}`} className="w-full h-48 object-cover border rounded" />
                                ) : (
                                    <span className="text-gray-400 text-sm">No image selected</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {/* Bottom Groups */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Bottom Groups</h3>
                        <button type="button" onClick={addPort_bottom_groups} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">+ Add Group</button>
                    </div>

                    {port_bottom_groups.map((group, groupIdx) => (
                        <div key={groupIdx} className="relative border p-4 mb-4 rounded">
                            <IconButton
                                size="small"
                                onClick={() => removeBottomGroup(groupIdx)}
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
                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-1">Pattern</label>
                                <div className="flex gap-4">
                                    <button type="button" className={`p-2 border rounded ${group.pattern === 1 ? 'bg-blue-200' : ''}`} onClick={() => handlePatternChange(groupIdx, 1)}><PanoramaRoundedIcon /></button>
                                    <button type="button" className={`p-2 border rounded ${group.pattern === 2 ? 'bg-blue-200' : ''}`} onClick={() => handlePatternChange(groupIdx, 2)}><SplitscreenIcon /></button>
                                    <button type="button" className={`p-2 border rounded ${group.pattern === 3 ? 'bg-blue-200' : ''}`} onClick={() => handlePatternChange(groupIdx, 3)}><ViewWeekRoundedIcon /></button>
                                </div>
                            </div>
                            <div className={`grid gap-4 ${group.pattern === 1 ? 'grid-cols-1' : group.pattern === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                {Array.from({ length: group.pattern }).map((_, imgIdx) => {
                                    let img: string = '';
                                    if (imgIdx === 0) {
                                        img = group.image_url_1;
                                    } else if (imgIdx === 1) {
                                        img = group.image_url_2;
                                    } else {
                                        img = group.image_url_3;
                                    }
                                    return (
                                        <div key={imgIdx}>
                                            <label className="block text-sm font-medium mb-1">Image {imgIdx + 1}</label>
                                            {img ? (
                                                <img src={img} alt={`Bottom ${imgIdx + 1}`} className="w-full h-40 object-cover mb-1" />
                                            ) : (
                                                <span className="text-gray-400 text-sm">No image selected</span>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, imgIdx, groupIdx, 'bottom')}
                                                className="w-full border px-3 py-2"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Bottom Buttons */}
                <div className="sticky bottom-0 bg-white pt-6 pb-4 flex justify-end gap-4 border-t mt-10 z-10">
                    {onCancel && <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>}
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                </div>
            </div>
        </form>
    );
}
