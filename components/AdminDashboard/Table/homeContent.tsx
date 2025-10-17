'use client';
import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  MenuItem,
  Select,
  Tabs,
  Tab,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

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
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  SinglePlantWithPotInCard,
  SinglePortInCard,
  SinglePotInCard,
} from "@/lib/types/types";
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

// 🔹 Card สำหรับ Desktop
function SortableItem({
  item,
  index,
  onDelete,
}: {
  item: SlotItem;
  index: number;
  onDelete: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: `slot-${index}` });
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
        flex: "0 1 calc(16.6% - 10px)",
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        background: "white",
        cursor: "grab",
        boxShadow: 1,
        "&:hover": { boxShadow: 5 },
      }}
    >
      {item ? (
        <>
          {"url" in item && item.url ? (
            <img src={item.url} alt={item.name} style={{ width: "100%", height: 140, objectFit: "cover" }} />
          ) : "image_cover" in item && item.image_cover ? (
            <img src={item.image_cover} alt={item.title} style={{ width: "100%", height: 140, objectFit: "cover" }} />
          ) : (
            <Box sx={{ height: 140, bgcolor: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
              No image
            </Box>
          )}
          <Typography align="center" fontSize={14} sx={{ p: 1 }}>
            {"name" in item ? item.name : item.title}
          </Typography>
          <IconButton
            onClick={() => onDelete(index)}
            size="small"
            sx={{ position: "absolute", top: 5, right: 5, bgcolor: "#fff" }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ) : (
        <Box sx={{ p: 2, textAlign: "center", color: "gray" }}>ว่าง</Box>
      )}
    </Box>
  );
}

export default function HomeContent({
  suggest_plant,
  plants,
  suggest_pot,
  pots,
  suggest_port,
  ports,
  refreshData,
}: Props) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [tab, setTab] = useState<"plant" | "pot" | "port">("plant");
  const [isLoading, setIsLoading] = useState(false);

  const initSlot = (arr: any[]) => {
    const filled = Array(6).fill(null);
    for (const a of arr) {
      const i = a.is_suggested - 1;
      if (i >= 0 && i < 6) filled[i] = a;
    }
    return filled;
  };

  const [plantItems, setPlantItems] = useState<SlotItem[]>(() => initSlot(suggest_plant));
  const [potItems, setPotItems] = useState<SlotItem[]>(() => initSlot(suggest_pot));
  const [portItems, setPortItems] = useState<SlotItem[]>(() => initSlot(suggest_port));

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const moveItem = (arr: SlotItem[], from: number, to: number, setter: any) => {
    const newArr = [...arr];
    const [moved] = newArr.splice(from, 1);
    newArr.splice(to, 0, moved);
    setter(newArr);
  };

  const handleSave = async (
    type: "plant" | "pot" | "port",
    items: SlotItem[],
    original: any[],
    updateFn: any
  ) => {
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

  // 📱 Mobile List View
  const renderMobileList = (
    title: string,
    items: SlotItem[],
    setItems: (arr: SlotItem[]) => void,
    available: any[],
    onSave: () => void
  ) => (
    <>
      <Typography variant="h6" fontWeight="bold" mt={3} mb={1}>{title}</Typography>
      <Box>
        {items.map((item, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "#fff",
              borderRadius: 2,
              mb: 1,
              p: 1.5,
              boxShadow: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {item ? (
                <>
                  {"url" in item && item.url ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      style={{ width: 50, height: 50, borderRadius: 8, objectFit: "cover" }}
                    />
                  ) : "image_cover" in item && item.image_cover ? (
                    <img
                      src={item.image_cover}
                      alt={item.title}
                      style={{ width: 50, height: 50, borderRadius: 8, objectFit: "cover" }}
                    />
                  ) : (
                    <Box sx={{ width: 50, height: 50, bgcolor: "#eee", borderRadius: 1 }} />
                  )}
                  <Typography fontSize={13} color="text.primary">
                    {"name" in item ? item.name : item.title}
                  </Typography>
                </>
              ) : (
                <Typography fontSize={13} color="gray">ช่องว่าง</Typography>
              )}
            </Box>

            <Box>
              <IconButton size="small" disabled={i === 0} onClick={() => moveItem(items, i, i - 1, setItems)}>
                <ArrowUpwardIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" disabled={i === items.length - 1} onClick={() => moveItem(items, i, i + 1, setItems)}>
                <ArrowDownwardIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => {
                const newArr = [...items];
                newArr[i] = null;
                setItems(newArr);
              }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}

        {/* Add new item */}
        <Select
          displayEmpty
          fullWidth
          onChange={(e) => {
            const selected = available.find((p) => p.id === e.target.value);
            if (selected) {
              const idx = items.findIndex((i) => i === null);
              if (idx >= 0) {
                const newArr = [...items];
                newArr[idx] = selected;
                setItems(newArr);
              }
            }
          }}
          value=""
          sx={{ mt: 1 }}
        >
          <MenuItem disabled value="">➕ เพิ่มใหม่</MenuItem>
          {available.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {"name" in p ? p.name : p.title}
            </MenuItem>
          ))}
        </Select>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={onSave}>
            Save
          </Button>
        </Box>
      </Box>
    </>
  );

  // 💻 Desktop Drag & Drop
  const renderDesktopGrid = (
    title: string,
    items: SlotItem[],
    setItems: (arr: SlotItem[]) => void,
    available: any[],
    onSave: () => void
  ) => (
    <>
      <Typography variant="h6" fontWeight="bold" mt={4}>{title}</Typography>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (!over || active.id === over.id) return;
          const from = parseInt(String(active.id).replace("slot-", ""));
          const to = parseInt(String(over.id).replace("slot-", ""));
          setItems(arrayMove(items, from, to));
        }}
      >
        <SortableContext items={items.map((_, i) => `slot-${i}`)} strategy={rectSortingStrategy}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
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
              />
            ))}
          </Box>
        </SortableContext>
      </DndContext>

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={onSave}>
          Save
        </Button>
      </Box>
    </>
  );

  const currentSet = {
    plant: { items: plantItems, set: setPlantItems, available: plants, title: "Plant Suggestion", save: () => handleSave("plant", plantItems, suggest_plant, updateSuggestedPlant) },
    pot: { items: potItems, set: setPotItems, available: pots, title: "Pot Suggestion", save: () => handleSave("pot", potItems, suggest_pot, updateSuggestedPot) },
    port: { items: portItems, set: setPortItems, available: ports, title: "Port Suggestion", save: () => handleSave("port", portItems, suggest_port, updateSuggestedPort) },
  }[tab];

  return (
    <Box sx={{ px: 2, py: 3, minHeight: "calc(100vh - 120px)" }}>
      {isLoading ? (
        <Box className="flex justify-center items-center h-[50vh]">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* 🔹 หัวข้อใหญ่เท่านั้นที่เป็น bold */}
          <Typography variant="h5" fontWeight="bold" mb={2}>Home Content</Typography>

          {/* 🔹 Tabs เมนู */}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
          >
            <Tab value="plant" label="Plant" />
            <Tab value="pot" label="Pot" />
            <Tab value="port" label="Port" />
          </Tabs>

          {isMobile
            ? renderMobileList(currentSet.title, currentSet.items, currentSet.set, currentSet.available, currentSet.save)
            : renderDesktopGrid(currentSet.title, currentSet.items, currentSet.set, currentSet.available, currentSet.save)}
        </>
      )}
    </Box>
  );
}
