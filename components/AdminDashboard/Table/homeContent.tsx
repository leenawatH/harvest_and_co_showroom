'use client';
import { useState } from "react";
import { Box, Typography, IconButton, Button, MenuItem, Select, useMediaQuery } from "@mui/material";
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
  rectSortingStrategy,
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
        flex: { xs: "0 1 calc(50% - 8px)", sm: "0 1 calc(33.3% - 10px)", md: "0 1 calc(16.6% - 10px)" },
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        background: "white",
        cursor: "grab",
        boxShadow: 1,
        "&:hover": {
          transform: "scale(1.02)",
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
              className="w-full object-cover"
              style={{ height: 140 }}
            />
          ) : "image_cover" in item && item.image_cover ? (
            <img
              src={item.image_cover}
              alt={item.title}
              className="w-full object-cover"
              style={{ height: 140 }}
            />
          ) : (
            <Box sx={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#eee" }}>
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

export default function HomeContent({
  suggest_plant, plants,
  suggest_pot, pots,
  suggest_port, ports,
  refreshData
}: Props) {

  const isMobile = useMediaQuery("(max-width:768px)");
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

  const [isLoading, setIsLoading] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleSave = async (type: "plant" | "pot" | "port", items: SlotItem[], original: any[], updateFn: any) => {
    setIsLoading(true);
    const payload = items
      .map((i, idx) => i && { id: i.id, is_suggested: idx + 1 })
      .filter(Boolean);

    for (const p of payload) {
      if (!p) continue;
      const old = original.find((o) => o.id === p.id);
      if (!old || old.is_suggested !== p.is_suggested) {
        await updateFn(p.id, p.is_suggested);
      }
    }
    await refreshData();
    setIsLoading(false);
  };

  const renderSection = (
    title: string,
    items: SlotItem[],
    setItems: (arr: SlotItem[]) => void,
    available: any[],
    onSave: () => void
  ) => (
    <>
      <Typography variant="h6" fontWeight="bold" mt={4}>{title}</Typography>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
        const { active, over } = e;
        if (!over || active.id === over.id) return;
        const from = parseInt(String(active.id).replace("slot-", ""));
        const to = parseInt(String(over.id).replace("slot-", ""));
        setItems(arrayMove(items, from, to));
      }}>
        <SortableContext
          items={items.map((_, index) => `slot-${index}`)}
          strategy={rectSortingStrategy}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: isMobile ? "center" : "space-between",
              gap: 1.5,
              mt: 2,
            }}
          >
            {items.map((item, index) => (
              <SortableItem
                key={`slot-${index}`}
                item={item}
                index={index}
                onDelete={(i) => {
                  const updated = [...items];
                  updated[i] = null;
                  setItems(updated);
                }}
                onAdd={(i, newItem) => {
                  const updated = [...items];
                  updated[i] = newItem;
                  setItems(updated);
                }}
                available={available}
              />
            ))}
          </Box>
        </SortableContext>
      </DndContext>

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={onSave}
          sx={{
            fontSize: isMobile ? 12 : 14,
            px: isMobile ? 2 : 4,
            py: isMobile ? 1 : 1.5,
          }}
        >
          Save
        </Button>
      </Box>
    </>
  );

  return (
    <Box sx={{ px: { xs: 1, md: 3 }, py: 3, minHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
      {isLoading ? (
        <Box className="flex justify-center items-center h-[50vh]">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h5" fontWeight="bold">Home Content</Typography>
          {renderSection(
            "Plant Suggestion",
            plantItems,
            setPlantItems,
            plants,
            () => handleSave("plant", plantItems, suggest_plant, updateSuggestedPlant)
          )}
          {renderSection(
            "Pot Suggestion",
            potItems,
            setPotItems,
            pots,
            () => handleSave("pot", potItems, suggest_pot, updateSuggestedPot)
          )}
          {renderSection(
            "Port Suggestion",
            portItems,
            setPortItems,
            ports,
            () => handleSave("port", portItems, suggest_port, updateSuggestedPort)
          )}
        </>
      )}
    </Box>
  );
}
