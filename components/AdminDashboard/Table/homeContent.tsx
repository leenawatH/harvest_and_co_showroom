'use client';
import { useState } from "react";
import { Box, Typography, IconButton, Button, MenuItem, Select } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { CircularProgress } from '@mui/material';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SinglePlantWithPotInCard, SinglePortInCard, SinglePotInCard } from "@/lib/types/types";
import { updateSuggestedPlant } from "@/lib/service/plantService";
import { updateSuggestedPot } from "@/lib/service/potService";
import { updateSuggestedPort } from "@/lib/service/portService";

type Props = {
    suggest_plant: SinglePlantWithPotInCard[];
    plants: SinglePlantWithPotInCard[];
    suggest_pot: SinglePotInCard[];
    pots: SinglePotInCard[];
    suggest_port: SinglePortInCard[];
    ports: SinglePortInCard[];
    refreshData: () => void;
};

type SlotItem = SinglePlantWithPotInCard | SinglePotInCard | SinglePortInCard | null;


function SortableItem({
    item,
    index,
    onDelete,
    onAdd,
    available,
}: {
    item: SlotItem;
    index: number;
    onDelete: (index: number) => void;
    onAdd: (index: number, item: any) => void;
    available: SinglePlantWithPotInCard[] | SinglePotInCard[] | SinglePortInCard[];
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: `slot-${index}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Box
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            sx={{
                width: 'calc(100% / 6 - 10px)',
                overflow: "hidden",
                position: "relative",
                background: "white",
                borderRadius: 2,
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "grab",
                "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 6,
                },
            }}
        >
            {item ? (
                <>
                    {"url" in item && item.url ? (
                        <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-120 object-cover"
                        />
                    ) : "image_cover" in item && item.image_cover ? (
                        <img
                            src={item.image_cover}
                            alt={item.title}
                            className="w-full h-120 object-cover"
                        />
                    ) : (
                        <Box sx={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#eee" }}>
                            <Typography variant="caption" color="textSecondary">No image</Typography>
                        </Box>
                    )}
                    <Box sx={{ p: 1 }}>
                        <Typography align="center" fontWeight="bold" fontSize={14}>
                            {"name" in item ? item.name : item.title}
                        </Typography>

                        <Typography align="center" fontSize={12} color="textSecondary">
                            {"price" in item
                                ? `ราคา ${item.price} บาท`
                                : "location" in item
                                    ? item.location
                                    : ""}
                        </Typography>

                    </Box>
                    <IconButton
                        onClick={() => onDelete(index)}
                        size="small"
                        sx={{ position: "absolute", top: 5, right: 5, bgcolor: "#fff" }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </>
            ) : (
                <Box sx={{ p: 2 }}>
                    <Typography variant="body2" textAlign="center" mb={1}>Add New</Typography>
                    <Select
                        displayEmpty
                        fullWidth
                        onChange={(e) => {
                            const selected = available.find(p => p.id === e.target.value);
                            if (selected) onAdd(index, selected);
                        }}
                        value=""
                        sx={{ fontSize: 14 }}
                    >
                        <MenuItem disabled value="">-- เลือก --</MenuItem>
                        {available.map(p => (
                            <MenuItem key={p.id} value={p.id}>{"name" in p ? p.name : p.title}</MenuItem>
                        ))}
                    </Select>
                </Box>
            )}
        </Box>
    );
}

export default function HomeContent({ suggest_plant, plants, suggest_pot, pots, suggest_port, ports, refreshData }: Props) {
    const [plantItems, setPlantItems] = useState<SlotItem[]>(() => {
        const filled = Array(6).fill(null);
        for (const plant of suggest_plant) {
            const i = plant.is_suggested - 1;
            if (i >= 0 && i < 6) filled[i] = plant;
        }
        return filled;
    });

    const [potItems, setPotItems] = useState<SlotItem[]>(() => {
        const filled = Array(6).fill(null);
        for (const pot of suggest_pot) {
            const i = pot.is_suggested - 1;
            if (i >= 0 && i < 6) filled[i] = pot;
        }
        return filled;
    });

    const [portItems, setPortItems] = useState<SlotItem[]>(() => {
        const filled = Array(6).fill(null);
        for (const port of suggest_port) {
            const i = port.is_suggested - 1;
            if (i >= 0 && i < 6) filled[i] = port;
        }
        return filled;
    });

    const [allPlants] = useState<SinglePlantWithPotInCard[]>(plants);
    const [allPots] = useState<SinglePotInCard[]>(pots);
    const [allPorts] = useState<SinglePortInCard[]>(ports);

    const [isLoading, setIsLoading] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const getAvailablePlants = () => {
        const selectedIds = plantItems.filter(Boolean).map(i => (i as SinglePlantWithPotInCard).id);
        return allPlants.filter(p => !selectedIds.includes(p.id));
    };
    const getAvailablePots = () => {
        const selectedIds = potItems.filter(Boolean).map(i => (i as SinglePotInCard).id);
        return allPots.filter(p => !selectedIds.includes(p.id));
    };
    const getAvailablePorts = () => {
        const selectedIds = portItems.filter(Boolean).map(i => (i as SinglePortInCard).id);
        return allPorts.filter(p => !selectedIds.includes(p.id));
    };

    const handleAddPlant = (index: number, plant: SinglePlantWithPotInCard) => {
        const updated = [...plantItems];
        updated[index] = plant;
        setPlantItems(updated);
    };
    const handleAddPot = (index: number, pot: SinglePotInCard) => {
        const updated = [...potItems];
        updated[index] = pot;
        setPotItems(updated);
    };
    const handleAddPort = (index: number, port: SinglePortInCard) => {
        const updated = [...portItems];
        updated[index] = port;
        setPortItems(updated);
    };

    const handleDeletePlant = (index: number) => {
        const updated = [...plantItems];
        updated[index] = null;
        setPlantItems(updated);
    };
    const handleDeletePot = (index: number) => {
        const updated = [...potItems];
        updated[index] = null;
        setPotItems(updated);
    };
    const handleDeletePort = (index: number) => {
        const updated = [...portItems];
        updated[index] = null;
        setPortItems(updated);
    };

    const handleDragEndPlant = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const from = parseInt(active.id.replace("slot-", ""));
        const to = parseInt(over.id.replace("slot-", ""));

        const reordered = arrayMove(plantItems, from, to);
        setPlantItems(reordered);
    };

    const handleDragEndPot = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const from = parseInt(active.id.replace("slot-", ""));
        const to = parseInt(over.id.replace("slot-", ""));

        const reordered = arrayMove(potItems, from, to);
        setPotItems(reordered);
    };
    const handleDragEndPort = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const from = parseInt(active.id.replace("slot-", ""));
        const to = parseInt(over.id.replace("slot-", ""));

        const reordered = arrayMove(portItems, from, to);
        setPortItems(reordered);
    };

    const handleSavePlant = async () => {
        setIsLoading(true);
        const payload = plantItems
            .map((plant, index) => {
                if (!plant) return null;
                const original = suggest_plant.find(p => p.id === plant.id);
                const isSamePosition = original?.is_suggested === index + 1;
                const wasInOriginal = !!original;

                if (!wasInOriginal || !isSamePosition) {
                    return {
                        id: plant.id,
                        is_suggested: index + 1,
                    };
                }
                return null;
            })
            .filter(Boolean);

        console.log("💾 Saving changed payload only:", payload);
        for (const item of payload) {
            if (item != null) {
                await updateSuggestedPlant(item.id, item.is_suggested);
            }
        }
        await refreshData();
        setIsLoading(false);
    };

    const handleSavePot = async () => {
        setIsLoading(true);
        const payload = potItems
            .map((pot, index) => {
                if (!pot) return null;
                const original = suggest_pot.find(p => p.id === pot.id);
                const isSamePosition = original?.is_suggested === index + 1;
                const wasInOriginal = !!original;

                if (!wasInOriginal || !isSamePosition) {
                    return {
                        id: pot.id,
                        is_suggested: index + 1,
                    };
                }
                return null;
            })
            .filter(Boolean);

        console.log("💾 Saving changed payload only:", payload);
        for (const item of payload) {
            if (item != null) {
                await updateSuggestedPot(item.id, item.is_suggested);
            }
        }
        await refreshData();
        setIsLoading(false);
    };

    const handleSavePort = async () => {
        setIsLoading(true);
        const payload = portItems
            .map((port, index) => {
                if (!port) return null;
                const original = suggest_port.find(p => p.id === port.id);
                const isSamePosition = original?.is_suggested === index + 1;
                const wasInOriginal = !!original;

                if (!wasInOriginal || !isSamePosition) {
                    return {
                        id: port.id,
                        is_suggested: index + 1,
                    };
                }
                return null;
            })
            .filter(Boolean);

        console.log("💾 Saving changed payload only:", payload);
        for (const item of payload) {
            if (item != null) {
                await updateSuggestedPort(item.id, item.is_suggested);
            }
        }
        await refreshData();
        setIsLoading(false);
    };

    return (

        <Box sx={{ px: 1, py: 3, height: 'calc(100vh - 128px)', overflowY: 'auto' }}>
            {isLoading ? (
                <div className="flex justify-center plantItems-center">
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <h2 className="text-xl font-bold">Home Content</h2>
                    <h5 className="text-l font-bold mt-5">Plant Suggestion</h5>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndPlant}>
                        <SortableContext
                            items={plantItems.map((_, index) => `slot-${index}`)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", mt: 5, gap: 1 }}>
                                {plantItems.map((plant, index) => (
                                    <SortableItem
                                        key={`slot-${index}`}
                                        item={plant}
                                        index={index}
                                        onDelete={handleDeletePlant}
                                        onAdd={handleAddPlant}
                                        available={getAvailablePlants()}
                                    />
                                ))}
                            </Box>
                        </SortableContext>
                    </DndContext>

                    <Box sx={{ textAlign: "center", mt: 3 }}>
                        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSavePlant}>
                            Save
                        </Button>
                    </Box>

                    <h5 className="text-l font-bold mt-5">Pot Suggestion</h5>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndPot}>
                        <SortableContext
                            items={potItems.map((_, index) => `slot-${index}`)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", mt: 5, gap: 1 }}>
                                {potItems.map((pot, index) => (
                                    <SortableItem
                                        key={`slot-${index}`}
                                        item={pot}
                                        index={index}
                                        onDelete={handleDeletePot}
                                        onAdd={handleAddPot}
                                        available={getAvailablePots()}
                                    />
                                ))}
                            </Box>
                        </SortableContext>
                    </DndContext>

                    <Box sx={{ textAlign: "center", mt: 3 }}>
                        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSavePot}>
                            Save
                        </Button>
                    </Box>

                    <h5 className="text-l font-bold mt-5">Port Suggestion</h5>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndPort}>
                        <SortableContext
                            items={portItems.map((_, index) => `slot-${index}`)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", mt: 5, gap: 1 }}>
                                {portItems.map((port, index) => (
                                    <SortableItem
                                        key={`slot-${index}`}
                                        item={port}
                                        index={index}
                                        onDelete={handleDeletePort}
                                        onAdd={handleAddPort}
                                        available={getAvailablePorts()}
                                    />
                                ))}
                            </Box>
                        </SortableContext>
                    </DndContext>

                    <Box sx={{ textAlign: "center", mt: 3 }}>
                        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSavePort}>
                            Save
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
}
