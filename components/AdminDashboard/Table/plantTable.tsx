'use client';
import { useState } from 'react';
import {getAllSinglePlantWithPotInCard , deletePlant, updatePlant  } from '@/lib/service/plantService';
import { Plant, SinglePlantWithPotInCard } from '@/lib/types/types';
import { Pot } from '@/lib/service/potService';
import ConfirmModal from '@/components/AdminDashboard/ConfirmModal/ConfirmModal';
import PlantForm from "@/components/AdminDashboard/Form/plantForm";

export default function PlantTable({ plants, pots }: { plants: SinglePlantWithPotInCard[], pots: Pot[] }) {

  const [plantsData, setPlantsData] = useState<SinglePlantWithPotInCard[]>(plants);

  const [selected, setSelected] = useState<string[]>([]);
  const [singleDelete, setSingleDelete] = useState<boolean>(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState<string>("");
  const [targetName, setTargetName] = useState<string>("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlantId, seteditingPlantId] = useState<string>("");

  const [isPending, setIsPending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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
          refresh();
          setSelected([]);
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      if (targetId) {
        setIsPending(true);
        try {
          await deletePlant(targetId);
          refresh();
        } catch (err) {
          console.error(err);
        }
      }
    }
    setIsPending(false);
    setConfirmOpen(false);
  };

  return (
    <div className="overflow-x-auto">
      {isFormOpen ? (
        <PlantForm
          initialData={editingPlantId}
          onSubmit={async ({ plant, newPotOptions, updatedPotOptions, deletedPotOptionIds }) => {
            if (editingPlantId) {
              // Edit
              //await updatePlant(editingPlantId, plant);
            } else {
              // Add
              // await createPlant(plant, newPotOptions, updatedPotOptions, deletedPotOptionIds);
            }
            await refresh();
            setIsFormOpen(false);
            seteditingPlantId("");
          }}
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
                  <th className="p-4 w-12"></th>
                  <th className="p-4 w-36">Cover Image</th>
                  <th className="p-4 w-32">Name</th>
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
                        onChange={() => item.id && toggleSelect(item.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
                        {item.url? (
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
