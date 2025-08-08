'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { uploadImage, deleteImage } from '@/lib/service/cloudinaryService';
import { Port, Port_Middle_Sections, Port_Bottom_Groups, Port_Bottom_Images } from '@/lib/types/types';
import { getPortById } from '@/lib/service/portService';

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


interface PortFormProps {
    initialData: string;
    onSubmit: (formData: any) => void;
    onCancel?: () => void;
}

export default function PortForm({ initialData, onSubmit, onCancel }: PortFormProps) {
    const [port, setPort] = useState<Port | null>(null);
    const [originalPort, setOriginalPort] = useState<Port | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            if (initialData) {
                const data = await getPortById(initialData);
                setPort(data);
                setOriginalPort(data);
            } else {
                setPort({
                    id: '',
                    title: '',
                    location: '',
                    image_cover: '',
                    description: '',
                    is_suggested: 0,
                    port_bottom_groups: [],
                    port_middle_sections: [],
                    file: null,
                });
                setOriginalPort(null);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [initialData]);

    function handleChangePort(field: keyof Port, value: string) {
        if (!port) return;
        setPort({ ...port, [field]: value });
    }

    function addMiddleSections() {
        if (!port) return;

        const newSection = {
            id: '',
            title: '',
            detail: '',
            position: port.port_middle_sections.length + 1,
            image_url: '',
            file: null,
        };

        const updatedSections = [...port.port_middle_sections, newSection];
        setPort({ ...port, port_middle_sections: updatedSections });
    }

    function addBottomGroups() {
        if (!port) return;

        const newGroup: Port_Bottom_Groups = {
            id: '',
            position: port.port_bottom_groups.length + 1,
            pattern: 1,
            port_bottom_images: [{
                id: '',
                position: 1,
                image_url: '',
                file: null
            }],
        };

        const updatedGroups = [...port.port_bottom_groups, newGroup];
        setPort({ ...port, port_bottom_groups: updatedGroups });
    }

    async function handleSubmit(e: React.FormEvent) {
        throw new Error('Function not implemented.');
    }

    return (
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 max-w-3xl max-h-[calc(100vh-100px)] overflow-y-auto">
                {isPending && (
                    <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 z-50 flex items-center justify-center">
                        <CircularProgress />
                    </div>
                )}
                <button onClick={onCancel} type="button" className="text-black-600">
                    <ArrowBackIosNewIcon fontSize="small" /> Back
                </button>
    
                <h2 className="text-2xl font-bold mb-4">Plant Form</h2>


            </form>
            )


}