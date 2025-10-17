'use client';
import { useMemo, useState } from 'react';
import {
  getAllSinglePortInCard,
  deletePort,
  updatePort,
  addNewPort,
  addNewPortMiddleSections,
  addNewPortBottomGroups,
  updatePortMiddleSections,
  updatePortBottomGroups,
  deletePortMiddleSections,
  deletePortBottomGroups,
} from '@/lib/service/portService';
import { deleteFolder } from '@/lib/service/cloudinaryService';
import { SinglePortInCard } from '@/lib/types/types';
import ConfirmModal from '@/components/AdminDashboard/ConfirmModal/ConfirmModal';
import PortForm from "@/components/AdminDashboard/Form/portForm";
import { CircularProgress } from '@mui/material';

export default function PortTable({ ports, refreshData }: { ports: SinglePortInCard[], refreshData: () => Promise<void>; }) {

  const [portsData, setPortsData] = useState<SinglePortInCard[]>(ports);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string[]>([]);
  const [singleDelete, setSingleDelete] = useState<boolean>(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState<string>("");
  const [targetName, setTargetName] = useState<string>("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPortId, setEditingPortId] = useState<string>("");

  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const toggleSelect = (id: string, name: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    const path = 'Port/' + name;
    setSelectedName((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== path) : [...prev, path]
    );
  };

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return portsData;
    return portsData.filter(p => (p.title || '').toLowerCase().includes(q));
  }, [search, portsData]);

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
          await deleteFolder('Port/' + targetName);
          await deletePort(targetId);
        } catch (err) {
          console.error(err);
        }
      }
    }
    await refresh();
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
          onSubmit={async (data) => {
            setIsLoading(true);
            const {
              finalUpdatePortData,
              newPort_middle_sections,
              updatedPort_middle_sections,
              deletedPort_middle_sections,
              newPort_bottom_group,
              updatedPort_bottom_group,
              deletedPort_bottom_group,
            } = data;

            // ✅ Create or update
            if (finalUpdatePortData) {
              if (!editingPortId) {
                const newPort = await addNewPort(finalUpdatePortData);
                if (newPort_middle_sections)
                  for (const m of newPort_middle_sections) {
                    m.port_id = newPort.id;
                    await addNewPortMiddleSections(m);
                  }
                if (newPort_bottom_group)
                  for (const g of newPort_bottom_group) {
                    g.port_id = newPort.id;
                    await addNewPortBottomGroups(g);
                  }
              } else {
                await updatePort(editingPortId, finalUpdatePortData);
                if (newPort_middle_sections)
                  for (const m of newPort_middle_sections) {
                    m.port_id = editingPortId;
                    await addNewPortMiddleSections(m);
                  }
                if (newPort_bottom_group)
                  for (const g of newPort_bottom_group) {
                    g.port_id = editingPortId;
                    await addNewPortBottomGroups(g);
                  }
              }
            }

            // ✅ Updates
            if (updatedPort_middle_sections)
              for (const m of updatedPort_middle_sections)
                await updatePortMiddleSections(m);
            if (updatedPort_bottom_group)
              for (const g of updatedPort_bottom_group)
                await updatePortBottomGroups(g);

            // ✅ Deletes
            if (deletedPort_middle_sections)
              for (const id of deletedPort_middle_sections)
                await deletePortMiddleSections(id);
            if (deletedPort_bottom_group)
              for (const id of deletedPort_bottom_group)
                await deletePortBottomGroups(id);

            await refresh();
            await refreshData();
            setIsFormOpen(false);
            setEditingPortId("");
            setIsLoading(false);
          }}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingPortId("");
          }}
        />
      ) : (
        <>
          {/* ✅ Top Bar */}
          <div className="sticky top-0 z-10 bg-white py-4 px-2">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
              <h2 className="text-xl font-bold">Port List</h2>

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
                  className={`px-4 py-2 rounded text-white ${isRefreshing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  disabled={isRefreshing}
                  onClick={refresh}
                >
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={() => {
                    setEditingPortId("");
                    setIsFormOpen(true);
                  }}
                >
                  New Port
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
                  <th className="p-4 w-[180px]">Title</th>
                  <th className="p-4 text-center w-[220px]">Location</th>
                  <th className="p-4 text-center w-[100px]">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {filteredRows.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 text-center align-middle">
                      <input
                        type="checkbox"
                        checked={selected.includes(item.id)}
                        onChange={() => toggleSelect(item.id, item.title)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
                        {item.image_cover ? (
                          <img
                            src={item.image_cover}
                            alt={item.title}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">no data</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">{item.title}</td>
                    <td className="p-4 text-center">{item.location}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingPortId(item.id);
                            setIsFormOpen(true);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.id, item.title)}
                          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
              <div key={item.id} className="border rounded-xl p-4 bg-white shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(item.id)}
                      onChange={() => toggleSelect(item.id, item.title)}
                      className="w-5 h-5"
                    />
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>
                  <span className="text-gray-500 text-sm">{item.location}</span>
                </div>

                <div className="flex justify-center">
                  {item.image_cover ? (
                    <img
                      src={item.image_cover}
                      alt={item.title}
                      className="w-48 h-48 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">no image</span>
                  )}
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => {
                      setEditingPortId(item.id);
                      setIsFormOpen(true);
                    }}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item.id, item.title)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 🔴 Confirm Modal */}
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
