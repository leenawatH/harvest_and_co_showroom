'use client';
import { useState } from 'react';
import { getAllSinglePortInCard, deletePort, updatePort, addNewPort,  } from '@/lib/service/portService';
import { deleteFolder } from '@/lib/service/cloudinaryService';
import { Port, SinglePortInCard } from '@/lib/types/types';
import ConfirmModal from '@/components/AdminDashboard/ConfirmModal/ConfirmModal';
import PortForm from "@/components/AdminDashboard/Form/portForm";
import { CircularProgress } from '@mui/material';

export default function PortTable({ ports, refreshData  }: { ports: SinglePortInCard[], refreshData: () => Promise<void>; }) {

  const [PortsData, setPortsData] = useState<SinglePortInCard[]>(ports);

  const [selected, setSelected] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string[]>([]);
  const [singleDelete, setSingleDelete] = useState<boolean>(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState<string>("");
  const [targetName, setTargetName] = useState<string>("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPortId, seteditingPortId] = useState<string>("");

  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleSelect = (id: string, name: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    const path = 'Port/' + name;
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
      const NewPort = await getAllSinglePortInCard();
      setPortsData(NewPort);
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
          await Promise.all(selected.map(id => deletePort(id)));
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
          console.log("Deleting Port with ID:", targetId, "and name:", targetName);
          await deleteFolder('Port/' + targetName);
          await deletePort(targetId);
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
        <PortForm
          initialData={editingPortId}
          onSubmit={async ({ finalUpdatePortData, newPotOptions, updatedPotOptions, deletedPotOptionIds }) => {
            setIsLoading(true);
            // if (finalUpdatePortData) {
            //   if (editingPortId === "") {
            //     // สร้าง Port ใหม่
            //     const Port = await addNewPort(finalUpdatePortData);

            //     // ตั้งค่า Port_id ให้กับ newPotOptions หลังจากสร้าง Port
            //     if (newPotOptions != null) {
            //       for (const pair of newPotOptions) {
            //         pair.Port_id = Port.id; // ใช้ id ที่ได้จากการสร้าง Port
            //         try {
            //           await addNewPort(pair);
            //         } catch (error) {
            //           console.error("Error adding new pot option:", error);
            //         }
            //       }
            //     }
            //   } else {
            //     // อัปเดต Port ที่มีอยู่แล้ว
            //     await updatePort(editingPortId, finalUpdatePortData);

            //     // ตั้งค่า Port_id ของ newPotOptions โดยใช้ editingPortId
            //     if (newPotOptions != null) {
            //       for (const pair of newPotOptions) {
            //         pair.Port_id = editingPortId; // ใช้ id ที่เป็น editingPortId
            //         try {
            //           await addNewPort(pair);
            //         } catch (error) {
            //           console.error("Error adding new pot option:", error);
            //         }
            //       }
            //     }
            //   }
            // } else {
            //   // ถ้าไม่มีการอัปเดต Port ก็ใช้ editingPortId สำหรับ Port_id
            //   if (newPotOptions != null) {
            //     for (const pair of newPotOptions) {
            //       pair.Port_id = editingPortId; // ใช้ id ที่เป็น editingPortId
            //       try {
            //         await addNewPortPotOption(pair);
            //       } catch (error) {
            //         console.error("Error adding new pot option:", error);
            //       }
            //     }
            //   }
            // }
            // if (updatedPotOptions != null) {
            //   for (const pair of updatedPotOptions) {
            //     try {
            //       await updatePortPotOption(pair);
            //     }
            //     catch (error) {
            //       console.error("Error updating pot option:", error);
            //     }
            //   }

            // }
            // if (deletedPotOptionIds != null) {
            //   for (const id of deletedPotOptionIds) {
            //     try {
            //       await deletePortPotOption(id);
            //     }
            //     catch (error) {
            //       console.error("Error deleting pot option:", error);
            //     }
            //   }

            // }
            await refresh();
            await refreshData();
            setIsFormOpen(false);
            seteditingPortId("");
            setIsLoading(false);
          }
          }
          onCancel={() => {
            setIsFormOpen(false);
            seteditingPortId("");
          }} />
      ) : (
        <>
          {/* ✅ Top Bar */}
          <div className="sticky top-0 z-10 bg-white py-4">
            <div className="flex justify-between items-center mb-2 px-2">
              <h2 className="text-xl font-bold">Port List</h2>
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
                    seteditingPortId("");
                    setIsFormOpen(true);
                  }}
                >
                  New Port
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
                  <th className="p-4 w-50">Title</th>
                  <th className="p-4 text-center w-32">Location</th>
                  <th className="p-4 text-center w-36">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {PortsData.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 text-center align-middle">
                      <input
                        type="checkbox"
                        checked={item.id ? selected.includes(item.id) : false}
                        onChange={() => item.id && toggleSelect(item.id, item.title)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
                        {item.image_cover ? (
                          <img
                            src={item.image_cover}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">no data</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">{item.title}</td>
                    <td className="p-4 text-center align-middle">{item.location} cm</td>
                    <td className="p-4 text-center align-middle">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            seteditingPortId(item.id);      // กรณี Edit
                            setIsFormOpen(true);
                          }}
                          className="px-4 py-3 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.id!, item.title)}
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
