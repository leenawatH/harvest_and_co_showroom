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
import { SinglePlantWithPotInCard } from "@/lib/types/types";
import { updateSuggestedPlant } from "@/lib/service/plantService";

type Props = {
    suggest_plant: SinglePlantWithPotInCard[];
    plants: SinglePlantWithPotInCard[];
    refreshData: () => void;
};

type SlotItem = SinglePlantWithPotInCard | null;

function SortableItem({
    plant,
    index,
    onDelete,
    onAdd,
    availablePlants,
}: {
    plant: SlotItem;
    index: number;
    onDelete: (index: number) => void;
    onAdd: (index: number, plant: SinglePlantWithPotInCard) => void;
    availablePlants: SinglePlantWithPotInCard[];
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
            {plant ? (
                <>
                    {plant.url ? (
                        <img src={plant.url} alt={plant.name} className="w-full h-120 object-cover" />
                    ) : (
                        <Box sx={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#eee" }}>
                            <Typography variant="caption" color="textSecondary">No image</Typography>
                        </Box>
                    )}
                    <Box sx={{ p: 1 }}>
                        <Typography align="center" fontWeight="bold" fontSize={14}>{plant.name}</Typography>
                        <Typography align="center" fontSize={12} color="textSecondary">ความสูง {plant.height} cm</Typography>
                        <Typography align="center" fontSize={12} color="textSecondary">ราคา {plant.price} บาท</Typography>
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
                    <Typography variant="body2" textAlign="center" mb={1}>เพิ่มต้นไม้</Typography>
                    <Select
                        displayEmpty
                        fullWidth
                        onChange={(e) => {
                            const selected = availablePlants.find(p => p.id === e.target.value);
                            if (selected) onAdd(index, selected);
                        }}
                        value=""
                        sx={{ fontSize: 14 }}
                    >
                        <MenuItem disabled value="">-- เลือก --</MenuItem>
                        {availablePlants.map(p => (
                            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                        ))}
                    </Select>
                </Box>
            )}
        </Box>
    );
}

export default function HomeContent({ suggest_plant, plants, refreshData }: Props) {
    const [items, setItems] = useState<SlotItem[]>(() => {
        const filled = Array(6).fill(null);
        for (const plant of suggest_plant) {
            const i = plant.is_suggested - 1;
            if (i >= 0 && i < 6) filled[i] = plant;
        }
        return filled;
    });

    const [allPlants] = useState<SinglePlantWithPotInCard[]>(plants);

    const [isLoading, setIsLoading] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const getAvailablePlants = () => {
        const selectedIds = items.filter(Boolean).map(i => (i as SinglePlantWithPotInCard).id);
        return allPlants.filter(p => !selectedIds.includes(p.id));
    };

    const handleAddPlant = (index: number, plant: SinglePlantWithPotInCard) => {
        const updated = [...items];
        updated[index] = plant;
        setItems(updated);
    };

    const handleDelete = (index: number) => {
        const updated = [...items];
        updated[index] = null;
        setItems(updated);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const from = parseInt(active.id.replace("slot-", ""));
        const to = parseInt(over.id.replace("slot-", ""));

        const reordered = arrayMove(items, from, to);
        setItems(reordered);
    };

    const handleSave = async () => {
        setIsLoading(true);
        const payload = items
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
            if(item != null){
                await updateSuggestedPlant(item.id, item.is_suggested);
            }
        }
        await refreshData();
        setIsLoading(false);
    };

    return (
        
        <Box sx={{ px: 1, py: 3 }}>
            {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <CircularProgress />
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold">Home Content</h2>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                    items={items.map((_, index) => `slot-${index}`)}
                    strategy={horizontalListSortingStrategy}
                >
                    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", mt: 5, gap: 1 }}>
                        {items.map((plant, index) => (
                            <SortableItem
                                key={`slot-${index}`}
                                plant={plant}
                                index={index}
                                onDelete={handleDelete}
                                onAdd={handleAddPlant}
                                availablePlants={getAvailablePlants()}
                            />
                        ))}
                    </Box>
                </SortableContext>
            </DndContext>

            <Box sx={{ textAlign: "center", mt: 3 }}>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
                    Save
                </Button>
            </Box>
            </>
        )}
        </Box>
    );
}
