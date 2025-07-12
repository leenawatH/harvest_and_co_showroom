'use client';
import { useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
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

type Props = {
    suggest_plant: SinglePlantWithPotInCard[];
    plants: SinglePlantWithPotInCard[];
};

function SortableItem({
    plant,
    index,
    onDelete,
}: {
    plant: SinglePlantWithPotInCard;
    index: number;
    onDelete: (index: number) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: plant.id });

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
            {plant.url ? (
                <img
                    src={plant.url}
                    alt={plant.name}
                    className="w-full h-120 object-cover"
                />
            ) : (
                <Box sx={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#eee" }}>
                    <Typography variant="caption" color="textSecondary">No image</Typography>
                </Box>
            )}

            <Box sx={{ p: 1 }}>
                <Typography align="center" fontWeight="bold" fontSize={14}>{plant.name}</Typography>
                <Typography align="center" fontSize={12} color="textSecondary">
                    ความสูง {plant.height} cm
                </Typography>
                <Typography align="center" fontSize={12} color="textSecondary">
                    ราคา {plant.price} บาท
                </Typography>
            </Box>

            <IconButton
                onClick={() => onDelete(index)}
                size="small"
                sx={{ position: "absolute", top: 5, right: 5, bgcolor: "#fff" }}
            >
                <DeleteIcon fontSize="small" />
            </IconButton>
        </Box>
    );
}

export default function HomeContent({ suggest_plant, plants }: Props) {
    const [items, setItems] = useState<SinglePlantWithPotInCard[]>(suggest_plant);
    const [allPlants] = useState<SinglePlantWithPotInCard[]>(plants);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const getAvailablePlants = () => {
        const selectedIds = items.map(i => i.id);
        return allPlants.filter(p => !selectedIds.includes(p.id));
    };

    const handleAddPlant = (plant: SinglePlantWithPotInCard) => {
        if (items.length >= 6) return;
        const newItems = [...items, plant];
        setItems(newItems);
        updateSuggestedOrder(newItems);
    };

    const updateSuggestedOrder = (newItems: SinglePlantWithPotInCard[]) => {
        const updated = newItems.map((plant, index) => ({
            id: plant.id,
            is_suggested: index + 1,
        }));
        console.log("📦 Updated is_suggested order:", updated);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        setItems(reordered);
        updateSuggestedOrder(reordered);
    };

    const handleDelete = (index: number) => {
        const updated = [...items];
        updated.splice(index, 1);
        setItems(updated);
        updateSuggestedOrder(updated);
    };

    const handleSave = () => {
        const payload = items
            .map((plant, index) => {
                const originalIndex = suggest_plant.findIndex(p => p.id === plant.id);
                const isSamePosition = originalIndex === index;
                const wasInOriginal = originalIndex !== -1;

                if (!wasInOriginal || !isSamePosition) {
                    return {
                        id: plant.id,
                        is_suggested: index + 1,
                    };
                }

                return null; // ไม่ต้องส่งถ้าไม่มีการเปลี่ยนแปลง
            })
            .filter(Boolean); // กรอง null ออก

        console.log("💾 Saving changed payload only:", payload);
        // TODO: ส่ง payload ไป backend
    };

    return (
        <Box sx={{ px: 4 }}>
            <Typography variant="h4" gutterBottom>
                Suggested Plants
            </Typography>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                    items={items.map((plant) => plant.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            gap: 1,
                        }}
                    >
                        {items.map((plant, index) => (
                            <SortableItem
                                key={plant.id}
                                plant={plant}
                                index={index}
                                onDelete={handleDelete}
                            />
                        ))}
                        {Array.from({ length: 6 - items.length }).map((_, index) => (
                            <Box
                                key={`add-slot-${index}`}
                                sx={{
                                    width: 'calc(100% / 6 - 10px)',
                                    borderRadius: 2,
                                    boxShadow: 2,
                                    backgroundColor: "white",
                                    overflow: "hidden",
                                    position: "relative",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    "&:hover": {
                                        transform: "scale(1.03)",
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        height: 120,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        bgcolor: "#f5f5f5",
                                    }}
                                >
                                    <Typography variant="caption" color="textSecondary">เพิ่มต้นไม้</Typography>
                                </Box>

                                <Box sx={{ p: 2 }}>
                                    {getAvailablePlants().length > 0 ? (
                                        <Box>
                                            <Typography variant="body2" textAlign="center" mb={1}>
                                                เลือกต้นไม้
                                            </Typography>
                                            <Box
                                                component="select"
                                                defaultValue=""
                                                onChange={(e) => {
                                                    const selected = allPlants.find(p => p.id === e.target.value);
                                                    if (selected) handleAddPlant(selected);
                                                }}
                                                sx={{
                                                    width: '100%',
                                                    padding: '6px 8px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: 1,
                                                    fontSize: 14,
                                                    outline: 'none',
                                                    '&:focus': {
                                                        borderColor: '#1976d2',
                                                    },
                                                }}
                                            >
                                                <option value="" disabled>-- เลือก --</option>
                                                {getAvailablePlants().map((plant) => (
                                                    <option key={plant.id} value={plant.id}>{plant.name}</option>
                                                ))}
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Typography variant="caption" color="gray" textAlign="center">
                                            ไม่มีต้นไม้เหลือ
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        ))}


                    </Box>
                </SortableContext>
            </DndContext>


            <Box sx={{ textAlign: "center", mt: 3 }}>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
                    Save
                </Button>
            </Box>
        </Box>
    );
}
