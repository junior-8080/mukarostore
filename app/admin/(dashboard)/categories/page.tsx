"use client";

import Image from "next/image";
import { useState } from "react";
import { Pencil, Trash2, X, GripVertical } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  AdminCategory,
  useAdminCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/lib/hooks/use-admin-categories";

const EMPTY_FORM = { name: "", description: "", image: "", order: 0 };

function CategoryForm({
  initial,
  onSubmit,
  onCancel,
  isPending,
  error,
  submitLabel,
}: {
  initial: typeof EMPTY_FORM;
  onSubmit: (data: typeof EMPTY_FORM) => void;
  onCancel?: () => void;
  isPending: boolean;
  error?: string;
  submitLabel: string;
}) {
  const [form, setForm] = useState(initial);

  function set(field: keyof typeof EMPTY_FORM, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. Toiletries"
          required
          className="w-full border border-gray-card bg-white px-3 py-2 text-sm font-body text-brand-navy focus:outline-none focus:border-brand-navy"
        />
      </div>

      <div>
        <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Short description shown on the shop page…"
          rows={2}
          className="w-full border border-gray-card bg-white px-3 py-2 text-sm font-body text-brand-navy focus:outline-none focus:border-brand-navy resize-none"
        />
      </div>

      <div>
        <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
          Image
        </label>
        <ImageUploader
          max={1}
          images={form.image ? [form.image] : []}
          onChange={(urls) => set("image", urls[0] ?? "")}
        />
      </div>

      <div>
        <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
          Display Order
        </label>
        <input
          type="number"
          min={0}
          value={form.order}
          onChange={(e) => set("order", Number(e.target.value))}
          className="w-full border border-gray-card bg-white px-3 py-2 text-sm font-body text-brand-navy focus:outline-none focus:border-brand-navy"
        />
        <p className="text-[10px] text-gray-muted font-body mt-1">Lower numbers appear first.</p>
      </div>

      {error && (
        <p className="text-red-500 text-xs font-body">{error}</p>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-brand-navy text-white text-xs font-body font-medium py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isPending ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 border border-gray-card text-xs font-body text-gray-muted hover:text-brand-navy hover:border-brand-navy transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useAdminCategories();
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const del = useDeleteCategory();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [createError, setCreateError] = useState("");
  const [editError, setEditError] = useState("");

  function startEdit(cat: AdminCategory) {
    setEditingId(cat._id);
    setEditError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError("");
  }

  async function handleCreate(form: typeof EMPTY_FORM) {
    setCreateError("");
    try {
      await create.mutateAsync(form);
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  async function handleUpdate(id: string, form: typeof EMPTY_FORM) {
    setEditError("");
    try {
      await update.mutateAsync({ id, ...form });
      setEditingId(null);
    } catch (e: unknown) {
      setEditError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  async function handleDelete(id: string) {
    try {
      await del.mutateAsync(id);
      setDeleteId(null);
    } catch {}
  }

  const editTarget = categories.find((c) => c._id === editingId);

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] text-gray-muted font-body uppercase tracking-widest mb-1">Manage</p>
        <h1 className="font-heading font-bold text-2xl text-brand-navy">Categories</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Category list ── */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="text-gray-muted text-sm py-12 text-center font-body">Loading…</div>
          ) : categories.length === 0 ? (
            <div className="bg-white border border-gray-card px-5 py-12 text-center text-gray-muted text-sm font-body">
              No categories yet. Add one using the form.
            </div>
          ) : (
            <div className="bg-white border border-gray-card overflow-hidden">
              {categories.map((cat, i) => (
                <div key={cat._id}>
                  {editingId === cat._id ? (
                    <div className="p-5 bg-gray-light border-b border-gray-card">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-body font-medium text-brand-navy">Editing: {cat.name}</p>
                        <button onClick={cancelEdit} className="text-gray-muted hover:text-brand-navy">
                          <X size={14} />
                        </button>
                      </div>
                      <CategoryForm
                        initial={{
                          name: cat.name,
                          description: cat.description,
                          image: cat.image,
                          order: cat.order,
                        }}
                        onSubmit={(form) => handleUpdate(cat._id, form)}
                        onCancel={cancelEdit}
                        isPending={update.isPending}
                        error={editError}
                        submitLabel="Save changes"
                      />
                    </div>
                  ) : (
                    <div
                      className={`flex items-center gap-4 px-4 py-3 ${
                        i < categories.length - 1 ? "border-b border-gray-card" : ""
                      } hover:bg-gray-light transition-colors`}
                    >
                      <GripVertical size={14} className="text-gray-card shrink-0" />

                      <div className="w-10 h-10 shrink-0 bg-gray-card overflow-hidden relative">
                        {cat.image ? (
                          <Image src={cat.image} alt={cat.name} fill sizes="40px" className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-muted text-[10px] font-body">
                            {cat.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-body font-medium text-brand-navy text-sm leading-tight">{cat.name}</p>
                        {cat.description && (
                          <p className="text-xs text-gray-muted font-body mt-0.5 truncate">{cat.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] text-gray-muted font-body mr-2">#{cat.order}</span>
                        <button
                          onClick={() => startEdit(cat)}
                          className="p-1.5 text-gray-muted hover:text-brand-navy transition-colors"
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteId(cat._id)}
                          className="p-1.5 text-gray-muted hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Add category form ── */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-card p-5">
            <p className="font-heading font-semibold text-brand-navy text-sm mb-4">Add Category</p>
            <CategoryForm
              key={create.isSuccess ? String(Date.now()) : "create"}
              initial={EMPTY_FORM}
              onSubmit={handleCreate}
              isPending={create.isPending}
              error={createError}
              submitLabel="Create category"
            />
          </div>
        </div>
      </div>

      {/* ── Delete confirm modal ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 max-w-sm w-full mx-4 shadow-lg">
            <h2 className="font-heading font-semibold text-brand-navy text-base mb-2">Delete category?</h2>
            <p className="text-sm font-body text-gray-muted mb-6">
              This removes the category from the list. Products already tagged with this category will keep their tag.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={del.isPending}
                className="flex-1 bg-red-500 text-white text-xs font-body font-medium py-2.5 hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {del.isPending ? "Deleting…" : "Yes, delete"}
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-card text-xs font-body text-gray-muted py-2.5 hover:border-brand-navy hover:text-brand-navy transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
