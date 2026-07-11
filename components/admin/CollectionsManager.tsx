"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import {
  useAdminCollections,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
} from "@/lib/hooks/use-admin-collections";

const inputCls =
  "border border-[#CDCAC3] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#9B7A51] bg-white";

export default function CollectionsManager() {
  const { data: collections = [], isLoading } = useAdminCollections();
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();
  const deleteCollection = useDeleteCollection();

  const [newId, setNewId] = useState("");
  const [newLabel, setNewLabel] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await createCollection.mutateAsync({
      id: newId,
      label: newLabel,
      order: collections.length,
      active: true,
    });
    setNewId("");
    setNewLabel("");
  }

  if (isLoading) return <div className="text-black/40 text-sm">Loading…</div>;

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleAdd} className="bg-white rounded-xl border border-[#CDCAC3] p-4 sm:p-5 mb-5 sm:mb-6">
        <h2 className="font-semibold text-black mb-4">Add Collection</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs text-black/50 mb-1">ID (slug, e.g. "kaftans")</label>
            <input
              value={newId}
              onChange={(e) => setNewId(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              required
              placeholder="kaftans"
              className={inputCls + " w-full"}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-black/50 mb-1">Label</label>
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              required
              placeholder="Kaftans"
              className={inputCls + " w-full"}
            />
          </div>
          <div className="flex sm:items-end">
            <button
              type="submit"
              disabled={createCollection.isPending}
              className="w-full sm:w-auto bg-[#6C3D0C] hover:bg-[#9B7A51] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-1"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
        {createCollection.error && (
          <p className="text-xs text-red-600 mt-2">
            {(createCollection.error as { error?: string })?.error ?? "Error"}
          </p>
        )}
      </form>

      {collections.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#CDCAC3] px-5 py-10 text-center text-black/40 text-sm">
          No collections yet. Add one above.
        </div>
      ) : (
        <>
          {/* Card list — mobile */}
          <div className="flex flex-col gap-3 sm:hidden">
            {collections.map((col) => (
              <div key={col._id} className="bg-white rounded-xl border border-[#CDCAC3] p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-black text-sm">{col.label}</p>
                  <p className="font-mono text-xs text-black/50 mt-0.5">{col.id}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => updateCollection.mutate({ id: col._id, data: { active: !col.active } })}
                    className={`relative w-9 h-5 rounded-full transition-colors ${col.active ? "bg-[#9B7A51]" : "bg-[#CDCAC3]"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${col.active ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                  <button
                    onClick={() => deleteCollection.mutate(col._id)}
                    className="text-black/30 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Table — sm+ */}
          <div className="hidden sm:block bg-white rounded-xl border border-[#CDCAC3] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[400px]">
                <thead>
                  <tr className="border-b border-[#CDCAC3]">
                    {["ID", "Label", "Order", "Active", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-black/50 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {collections.map((col) => (
                    <tr key={col._id} className="border-b border-[#CDCAC3] last:border-0 hover:bg-[#FDE7C7]/30">
                      <td className="px-5 py-3 font-mono text-xs text-black/50">{col.id}</td>
                      <td className="px-5 py-3 font-medium text-black">{col.label}</td>
                      <td className="px-5 py-3 text-black/50">{col.order}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => updateCollection.mutate({ id: col._id, data: { active: !col.active } })}
                          className={`relative w-9 h-5 rounded-full transition-colors ${col.active ? "bg-[#9B7A51]" : "bg-[#CDCAC3]"}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${col.active ? "translate-x-4" : "translate-x-0"}`} />
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => deleteCollection.mutate(col._id)}
                          className="text-black/30 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}