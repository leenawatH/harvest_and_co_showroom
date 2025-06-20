'use client';
import { useState } from 'react';
import { Plant , deletePlant , getAllPlants } from '@/lib/service/plantService';
import ConfirmModal from '@/components/AdminDashboard/ConfirmModal/ConfirmModal';

export default function PlantTable({ plants }: { plants: Plant[] }) {

  const [plantsData, setPlantsData] = useState<Plant[]>(plants);
  const [selected, setSelected] = useState<string[]>([]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState<string>("");
  const [targetName, setTargetName] = useState<string>("");
  const [isPending, setIsPending] = useState(false);


  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteClick = (id: string, name: string) => {
    setTargetId(id);
    setTargetName(name);
    setConfirmOpen(true);
  };

  const refresh = async () => {
    const NewPlant = await getAllPlants();
      setPlantsData(NewPlant);
  }

  const confirmDelete = async () => {
    if (targetId) {
      setIsPending(true);
    try {
      await deletePlant(targetId);
      refresh();
    } catch (err) {
      console.error(err);
    }
    setIsPending(false);
  }
      
    setConfirmOpen(false);
  };

  return (
    <div className="overflow-x-auto mb-6">
      {/* ✅ Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Plant List</h2>
        <div className="flex gap-4">
          {selected.length > 0 && (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => console.log('Delete selected', selected)}
            >
              Delete Selected
            </button>
          )}
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={refresh}
          >
            Refresh
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => console.log('New Plant')}
          >
            New Plant
          </button>
        </div>
      </div>

      {/* ✅ Table */}
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
                  {item.withpot_imgurl?.[0]?.available_colors?.[0]?.url ? (
                    <img
                      src={item.withpot_imgurl[0].available_colors[0].url}
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
                    onClick={() => console.log('Edit', item.id)}
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
        message={`Are you sure you want to delete "${targetName}"?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
