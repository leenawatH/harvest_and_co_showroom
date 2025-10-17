'use client';
import { useMemo, useState } from 'react';
import { 
  getAllSinglePlantWithPotInCard, 
  deletePlant, 
  updatePlant, 
  addPlant, 
  addNewPlantPotOption, 
  updatePlantPotOption, 
  deletePlantPotOption, 
  addNewPlantMoreImage, 
  updatePlantMoreImage, 
  deletePlantMoreImage,
  addNewPlantReviewPic,
  updatePlantReviewPic,
  deletePlantReviewPic 
} from '@/lib/service/plantService';
import { deleteFolder } from '@/lib/service/cloudinaryService';
import { SinglePlantWithPotInCard } from '@/lib/types/types';
import ConfirmModal from '@/components/AdminDashboard/ConfirmModal/ConfirmModal';
import PlantForm from "@/components/AdminDashboard/Form/plantForm";
import { CircularProgress } from '@mui/material';

export default function PlantTable({ plants, refreshData }: { plants: SinglePlantWithPotInCard[], refreshData: () => Promise<void>; }) {

  const [plantsData, setPlantsData] = useState<SinglePlantWithPotInCard[]>(plants);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string[]>([]);
  const [singleDelete, setSingleDelete] = useState<boolean>(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState<string>("");
  const [targetName, setTargetName] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlantId, seteditingPlantId] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const toggleSelect = (id: string, name: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    const path = 'Plant/' + name;
    setSelectedName((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== path) : [...prev, path]
    );
  };

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return plantsData;
    return plantsData.filter(p => (p.name || '').toLowerCase().includes(q));
  }, [search, plantsData]);

  const handleDeleteClick = (id: string, name: string) => {
    setTargetId(id);
    setTargetName(name);
    setSingleDelete(true);
    setConfirmOpen(true);
  };

  const handleManyDeleteClick = () => {
    setSingleDelete(false);
    setConfirmOpen(true);
  };

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const NewPlant = await getAllSinglePlantWithPotInCard();
      setPlantsData(NewPlant);
    } catch (err) {
      console.error(err);
    }
    setIsRefreshing(false);
  };

  const confirmDelete = async () => {
    if (!singleDelete) {
      if (selected.length > 0) {
        setIsPending(true);
        try {
          await Promise.all(selected.map(id => deletePlant(id)));
          await Promise.all(selectedName.map(path => deleteFolder(path)));
          setSelected([]);
          setSelectedName([]);
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      if (targetId) {
        setIsPending(true);
        try {
          console.log("Deleting plant with ID:", targetId, "and name:", targetName);
          await deleteFolder('Plant/' + targetName);
          await deletePlant(targetId);
        } catch (err) {
          console.error(err);
        }
      }
    }
    refresh();
    await refreshData();
    setIsPending(false);
    setConfirmOpen(false);
  };

  return (
    <div className="overflow-x-auto">
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 z-50 flex items-center justify-center">
          <CircularProgress />
        </div>
      )}

      {isFormOpen ? (
        <PlantForm
          initialData={editingPlantId}
          onSubmit={async ({
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
          }) => {
            setIsLoading(true);
            // สร้าง / อัปเดต plant + images + pots
            if (finalUpdatePlantData) {
              if (editingPlantId === "") {
                const plant = await addPlant(finalUpdatePlantData);
                if (newPotOptions) for (const pair of newPotOptions) { pair.plant_id = plant.id; await addNewPlantPotOption(pair); }
                if (newPlantMoreImage) for (const img of newPlantMoreImage) { img.plant_id = plant.id; await addNewPlantMoreImage(img); }
                if (newPlantReviewPic) for (const pic of newPlantReviewPic) { pic.plant_id = plant.id; await addNewPlantReviewPic(pic); }
              } else {
                await updatePlant(editingPlantId, finalUpdatePlantData);
                if (newPotOptions) for (const pair of newPotOptions) { pair.plant_id = editingPlantId; await addNewPlantPotOption(pair); }
                if (newPlantMoreImage) for (const img of newPlantMoreImage) { img.plant_id = editingPlantId; await addNewPlantMoreImage(img); }
                if (newPlantReviewPic) for (const pic of newPlantReviewPic) { pic.plant_id = editingPlantId; await addNewPlantReviewPic(pic); }
              }
            }
            if (updatedPotOptions) for (const pair of updatedPotOptions) await updatePlantPotOption(pair);
            if (updatedPlantMoreImage) for (const img of updatedPlantMoreImage) await updatePlantMoreImage(img);
            if (updatedPlantReviewPic) for (const pic of updatedPlantReviewPic) await updatePlantReviewPic(pic);
            if (deletedPotOptionIds) for (const id of deletedPotOptionIds) await deletePlantPotOption(id);
            if (deletedPlantMoreImageIds) for (const id of deletedPlantMoreImageIds) await deletePlantMoreImage(id);
            if (deletedPlantReviewPicIds) for (const id of deletedPlantReviewPicIds) await deletePlantReviewPic(id);

            await refresh();
            await refreshData();
            setIsFormOpen(false);
            seteditingPlantId("");
            setIsLoading(false);
          }}
          onCancel={() => {
            setIsFormOpen(false);
            seteditingPlantId("");
          }}
        />
      ) : (
        <>
          {/* ✅ Top Bar */}
          <div className="sticky top-0 z-10 bg-white py-4 px-2">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
              <h2 className="text-xl font-bold">Plant List</h2>

              {/* 🔎 Search bar */}
              <div className="flex items-center gap-2 w-full md:w-[360px]">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name..."
                  className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-400"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="px-3 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
                    title="Clear"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* 🔘 Actions */}
              <div className="flex flex-wrap gap-3">
                {selected.length > 0 && (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={handleManyDeleteClick}
                  >
                    Delete Selected
                  </button>
                )}
                <button
                  className={`px-4 py-2 rounded text-white ${isRefreshing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700'}`}
                  disabled={isRefreshing}
                  onClick={refresh}
                >
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={() => {
                    seteditingPlantId("");
                    setIsFormOpen(true);
                  }}
                >
                  New Plant
                </button>
              </div>
            </div>
          </div>

          {/* ✅ Desktop Table */}
          <div className="overflow-y-auto max-h-[70vh] bg-white hidden md:block">
            <table className="min-w-full bg-white">
              <thead className="text-left text-gray-700 text-base">
                <tr>
                  <th className="p-4 w-[50px]"></th>
                  <th className="p-4 w-[200px]">Cover</th>
                  <th className="p-4 w-[200px]">Name</th>
                  <th className="p-4 text-center w-32">Height</th>
                  <th className="p-4 text-center w-32">Price</th>
                  <th className="p-4 text-center w-36">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {filteredRows.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 text-center align-middle">
                      <input
                        type="checkbox"
                        checked={item.id ? selected.includes(item.id) : false}
                        onChange={() => item.id && toggleSelect(item.id, item.name)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
                        {item.url ? (
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">no data</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">{item.name}</td>
                    <td className="p-4 text-center align-middle">{item.height} cm</td>
                    <td className="p-4 text-center align-middle">฿{item.price}</td>
                    <td className="p-4 text-center align-middle">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            seteditingPlantId(item.id);
                            setIsFormOpen(true);
                          }}
                          className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.id!, item.name)}
                          className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Mobile Card View */}
          <div className="md:hidden space-y-4 p-3">
            {filteredRows.map((item) => (
              <div
                key={item.id}
                className="border rounded-xl p-4 shadow-sm bg-white flex flex-col gap-3"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.id ? selected.includes(item.id) : false}
                      onChange={() => item.id && toggleSelect(item.id, item.name)}
                      className="w-5 h-5"
                    />
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                  </div>
                  <span className="text-gray-500 text-sm">฿{item.price}</span>
                </div>

                <div className="flex justify-center">
                  {item.url ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-48 h-48 rounded-md object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">no image</span>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  Height: {item.height} cm
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => {
                      seteditingPlantId(item.id);
                      setIsFormOpen(true);
                    }}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item.id!, item.name)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 🔴 Modal */}
          <ConfirmModal
            open={confirmOpen}
            title="Confirm Delete"
            message={
              !singleDelete && selected.length > 1
                ? `Are you sure you want to delete ${selected.length} items?`
                : `Are you sure you want to delete "${targetName}"?`
            }
            onCancel={() => setConfirmOpen(false)}
            onConfirm={confirmDelete}
            isPending={isPending}
          />
        </>
      )}
    </div>
  );
}
