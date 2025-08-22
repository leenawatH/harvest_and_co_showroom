'use client';
import { useState } from 'react';
import { getAllSinglePlantWithPotInCard, deletePlant, updatePlant, addPlant, addNewPlantPotOption, updatePlantPotOption, deletePlantPotOption } from '@/lib/service/plantService';
import { deleteFolder } from '@/lib/service/cloudinaryService';
import { SinglePlantWithPotInCard } from '@/lib/types/types';
import ConfirmModal from '@/components/AdminDashboard/ConfirmModal/ConfirmModal';
import PlantForm from "@/components/AdminDashboard/Form/plantForm";
import { CircularProgress } from '@mui/material';

export default function PlantTable({ plants, refreshData  }: { plants: SinglePlantWithPotInCard[], refreshData: () => Promise<void>; }) {

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

  const toggleSelect = (id: string, name: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    const path = 'Plant/' + name;
    setSelectedName((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== path) : [...prev, path]
    );
  };

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
          onSubmit={async ({ finalUpdatePlantData, newPotOptions, updatedPotOptions, deletedPotOptionIds }) => {
            setIsLoading(true);
            if (finalUpdatePlantData) {
              if (editingPlantId === "") {
                // สร้าง Plant ใหม่
                const plant = await addPlant(finalUpdatePlantData);

                // ตั้งค่า plant_id ให้กับ newPotOptions หลังจากสร้าง Plant
                if (newPotOptions != null) {
                  for (const pair of newPotOptions) {
                    pair.plant_id = plant.id; // ใช้ id ที่ได้จากการสร้าง Plant
                    try {
                      await addNewPlantPotOption(pair);
                    } catch (error) {
                      console.error("Error adding new pot option:", error);
                    }
                  }
                }
              } else {
                // อัปเดต Plant ที่มีอยู่แล้ว
                await updatePlant(editingPlantId, finalUpdatePlantData);

                // ตั้งค่า plant_id ของ newPotOptions โดยใช้ editingPlantId
                if (newPotOptions != null) {
                  for (const pair of newPotOptions) {
                    pair.plant_id = editingPlantId; // ใช้ id ที่เป็น editingPlantId
                    try {
                      await addNewPlantPotOption(pair);
                    } catch (error) {
                      console.error("Error adding new pot option:", error);
                    }
                  }
                }
              }
            } else {
              // ถ้าไม่มีการอัปเดต Plant ก็ใช้ editingPlantId สำหรับ plant_id
              if (newPotOptions != null) {
                for (const pair of newPotOptions) {
                  pair.plant_id = editingPlantId; // ใช้ id ที่เป็น editingPlantId
                  try {
                    await addNewPlantPotOption(pair);
                  } catch (error) {
                    console.error("Error adding new pot option:", error);
                  }
                }
              }
            }
            if (updatedPotOptions != null) {
              for (const pair of updatedPotOptions) {
                try {
                  await updatePlantPotOption(pair);
                }
                catch (error) {
                  console.error("Error updating pot option:", error);
                }
              }

            }
            if (deletedPotOptionIds != null) {
              for (const id of deletedPotOptionIds) {
                try {
                  await deletePlantPotOption(id);
                }
                catch (error) {
                  console.error("Error deleting pot option:", error);
                }
              }

            }
            await refresh();
            await refreshData();
            setIsFormOpen(false);
            seteditingPlantId("");
            setIsLoading(false);
          }
          }
          onCancel={() => {
            setIsFormOpen(false);
            seteditingPlantId("");
          }} />
      ) : (
        <>
          {/* ✅ Top Bar */}
          <div className="sticky top-0 z-10 bg-white py-4">
            <div className="flex justify-between items-center mb-2 px-2">
              <h2 className="text-xl font-bold">Plant List</h2>
              <div className="flex gap-4">
                {selected.length > 0 && (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={handleManyDeleteClick}
                  >
                    Delete Selected
                  </button>
                )}
                <button
                  className={`px-4 py-2 rounded text-white ${isRefreshing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700'
                    }`}
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

          {/* ✅ Scrollable Table */}
          <div className="overflow-y-auto max-h-[70vh] bg-white">
            <table className="min-w-full bg-white">
              <thead className="text-left text-gray-700 text-base">
                <tr>
                  <th className="p-4 w-[50px]"></th>
                  <th className="p-4 w-[200px]">Cover Image</th>
                  <th className="p-4 w-[200px]">Name</th>
                  <th className="p-4 text-center w-32">Height</th>
                  <th className="p-4 text-center w-32">Price</th>
                  <th className="p-4 text-center w-36">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {plantsData.map((item) => (
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
                            className="w-full h-full object-cover"
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
                            seteditingPlantId(item.id);      // กรณี Edit
                            setIsFormOpen(true);
                          }}
                          className="px-4 py-3 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.id!, item.name)}
                          className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

          </div>
        </>
      )}
    </div>
  );

  ;
}
