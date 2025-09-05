'use client';
import { useMemo, useState } from 'react';
import { getAllSinglePotInCard, deletePot, updatePot, addPot, addNewPotColor, updatePotColor, deletePotColor } from '@/lib/service/potService';
import { deleteFolder } from '@/lib/service/cloudinaryService';
import ConfirmModal from '@/components/AdminDashboard/ConfirmModal/ConfirmModal';
import PotForm from '@/components/AdminDashboard/Form/potForm';
import { CircularProgress } from '@mui/material';
import { SinglePotInCard } from '@/lib/types/types';

export default function PotTable({ pots, refreshData  }: { pots: SinglePotInCard[], refreshData: () => Promise<void>; }) {

  const [potsData, setpotsData] = useState<SinglePotInCard[]>(pots);

  const [selected, setSelected] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string[]>([]);
  const [singleDelete, setSingleDelete] = useState<boolean>(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState<string>("");
  const [targetName, setTargetName] = useState<string>("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPotId, seteditingPotId] = useState<string>("");

  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [search, setSearch] = useState('');

  const toggleSelect = (id: string, name: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    const path = 'Pot/' + name;
    setSelectedName((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== path) : [...prev, path]
    );
  };

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return potsData;
    return potsData.filter(p => (p.name || '').toLowerCase().includes(q));
  }, [search, potsData]);

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
      const NewPot = await getAllSinglePotInCard();
      setpotsData(NewPot);
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
          await Promise.all(selected.map(id => deletePot(id)));
          await Promise.all(selectedName.map(path => deleteFolder(path)));
          refresh();
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
          console.log("Deleting Pot with ID:", targetId, "and name:", targetName);
          await deleteFolder('Pot/' + targetName);
          await deletePot(targetId);
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
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 z-50 flex items-center justify-center">
          <CircularProgress />
        </div>
      )}
      {isFormOpen ? (
        <PotForm
          initialData={editingPotId}
          onSubmit={async ({ finalUpdatePotData, newPotOptions, updatedPotOptions, deletedPotOptionIds }) => {
            setIsLoading(true);
            if (finalUpdatePotData) {
              if (editingPotId === "") {
                // สร้าง Pot ใหม่
                const Pot = await addPot(finalUpdatePotData);

                // ตั้งค่า Pot_id ให้กับ newPotOptions หลังจากสร้าง Pot
                if (newPotOptions != null) {
                  for (const pair of newPotOptions) {
                    pair.Pot_id = Pot.id; // ใช้ id ที่ได้จากการสร้าง Pot
                    try {
                      await addNewPotColor(pair);
                    } catch (error) {
                      console.error("Error adding new pot option:", error);
                    }
                  }
                }
              } else {
                // อัปเดต Pot ที่มีอยู่แล้ว
                await updatePot(editingPotId, finalUpdatePotData);

                // ตั้งค่า Pot_id ของ newPotOptions โดยใช้ editingPotId
                if (newPotOptions != null) {
                  for (const pair of newPotOptions) {
                    pair.Pot_id = editingPotId; // ใช้ id ที่เป็น editingPotId
                    try {
                      await addNewPotColor(pair);
                    } catch (error) {
                      console.error("Error adding new pot option:", error);
                    }
                  }
                }
              }
            } else {
              // ถ้าไม่มีการอัปเดต Pot ก็ใช้ editingPotId สำหรับ Pot_id
              if (newPotOptions != null) {
                for (const pair of newPotOptions) {
                  pair.Pot_id = editingPotId; // ใช้ id ที่เป็น editingPotId
                  try {
                    await addNewPotColor(pair);
                  } catch (error) {
                    console.error("Error adding new pot option:", error);
                  }
                }
              }
            }
            if (updatedPotOptions != null) {
              for (const pair of updatedPotOptions) {
                try {
                  await updatePotColor(pair);
                }
                catch (error) {
                  console.error("Error updating pot option:", error);
                }
              }

            }
            if (deletedPotOptionIds != null) {
              for (const id of deletedPotOptionIds) {
                try {
                  await deletePotColor(id);
                }
                catch (error) {
                  console.error("Error deleting pot option:", error);
                }
              }

            }
            await refresh();
            await refreshData();
            setIsFormOpen(false);
            seteditingPotId("");
            setIsLoading(false);
          }
          }
          onCancel={() => {
            setIsFormOpen(false);
            seteditingPotId("");
          }} />
      ) : (
        <>
          {/* ✅ Top Bar */}
          <div className="sticky top-0 z-10 bg-white py-4">
            <div className="flex justify-between items-center mb-2 px-2">
              <h2 className="text-xl font-bold">Pot List</h2>
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
                    seteditingPotId("");
                    setIsFormOpen(true);
                  }}
                >
                  New Pot
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
                  <th className="p-4 text-center w-32">Circumference</th>
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
                    <td className="p-4 text-center align-middle">{item.circumference} cm</td>
                    <td className="p-4 text-center align-middle">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            seteditingPotId(item.id);      // กรณี Edit
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
