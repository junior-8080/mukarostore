"use client";

import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import {
  AdminExternalShop,
  useAdminExternalShops,
  useCreateExternalShop,
  useDeleteExternalShop,
  useUpdateExternalShop,
} from "@/lib/hooks/use-admin-external-shops";

const EMPTY_FORM = {
  name: "",
  contactPerson: "",
  phone: "",
  email: "",
  paymentMethod: "MoMo" as "MoMo" | "Bank Transfer",
  momoNumber: "",
  bankName: "",
  bankAccountName: "",
  bankAccountNumber: "",
  notes: "",
  isActive: true,
};

function ShopForm({
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

  function set<K extends keyof typeof EMPTY_FORM>(field: K, value: (typeof EMPTY_FORM)[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const inputCls =
    "w-full border border-gray-card bg-white px-3 py-2 text-sm font-body text-brand-navy focus:outline-none focus:border-brand-navy";

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
          Shop Name <span className="text-red-500">*</span>
        </label>
        <input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. Kofi's Wholesale"
          required
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
            Contact Person
          </label>
          <input value={form.contactPerson} onChange={(e) => set("contactPerson", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
            Phone
          </label>
          <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
          Email
        </label>
        <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
      </div>

      <div>
        <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
          Payout Method
        </label>
        <select
          value={form.paymentMethod}
          onChange={(e) => set("paymentMethod", e.target.value as "MoMo" | "Bank Transfer")}
          className={inputCls}
        >
          <option value="MoMo">MoMo</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>
      </div>

      {form.paymentMethod === "MoMo" ? (
        <div>
          <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
            MoMo Number
          </label>
          <input value={form.momoNumber} onChange={(e) => set("momoNumber", e.target.value)} className={inputCls} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
              Bank Name
            </label>
            <input value={form.bankName} onChange={(e) => set("bankName", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
              Account Name
            </label>
            <input value={form.bankAccountName} onChange={(e) => set("bankAccountName", e.target.value)} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
              Account Number
            </label>
            <input value={form.bankAccountNumber} onChange={(e) => set("bankAccountNumber", e.target.value)} className={inputCls} />
          </div>
        </div>
      )}

      <div>
        <label className="block text-[10px] font-body text-gray-muted uppercase tracking-widest mb-1.5">
          Notes
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={2}
          className={inputCls + " resize-none"}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => set("isActive", !form.isActive)}
          className={`relative w-10 h-5 shrink-0 transition-colors ${form.isActive ? "bg-brand-gold" : "bg-gray-card"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white shadow transition-transform ${
              form.isActive ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-sm font-body text-gray-muted">
          {form.isActive ? "Active — selectable on products" : "Inactive — hidden from product form"}
        </span>
      </div>

      {error && <p className="text-red-500 text-xs font-body">{error}</p>}

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

export default function ExternalShopsPage() {
  const { data: shops = [], isLoading } = useAdminExternalShops();
  const create = useCreateExternalShop();
  const update = useUpdateExternalShop();
  const del = useDeleteExternalShop();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [createError, setCreateError] = useState("");
  const [editError, setEditError] = useState("");

  function startEdit(id: string) {
    setEditingId(id);
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

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] text-gray-muted font-body uppercase tracking-widest mb-1">Manage</p>
        <h1 className="font-heading font-bold text-2xl text-brand-navy">External Shops</h1>
        <p className="text-xs text-gray-muted font-body mt-1 max-w-lg">
          Shops that supply products you list. Assign a product to a shop from the product form —
          this stays internal for reconciliation and is never shown to buyers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Shop list ── */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="text-gray-muted text-sm py-12 text-center font-body">Loading…</div>
          ) : shops.length === 0 ? (
            <div className="bg-white border border-gray-card px-5 py-12 text-center text-gray-muted text-sm font-body">
              No external shops yet. Add one using the form.
            </div>
          ) : (
            <div className="bg-white border border-gray-card overflow-hidden">
              {shops.map((shop, i) => (
                <div key={shop._id}>
                  {editingId === shop._id ? (
                    <div className="p-5 bg-gray-light border-b border-gray-card">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-body font-medium text-brand-navy">Editing: {shop.name}</p>
                        <button onClick={cancelEdit} className="text-gray-muted hover:text-brand-navy">
                          <X size={14} />
                        </button>
                      </div>
                      <ShopForm
                        initial={{
                          name: shop.name,
                          contactPerson: shop.contactPerson,
                          phone: shop.phone,
                          email: shop.email,
                          paymentMethod: shop.paymentMethod,
                          momoNumber: shop.momoNumber,
                          bankName: shop.bankName,
                          bankAccountName: shop.bankAccountName,
                          bankAccountNumber: shop.bankAccountNumber,
                          notes: shop.notes,
                          isActive: shop.isActive,
                        }}
                        onSubmit={(form) => handleUpdate(shop._id, form)}
                        onCancel={cancelEdit}
                        isPending={update.isPending}
                        error={editError}
                        submitLabel="Save changes"
                      />
                    </div>
                  ) : (
                    <div
                      className={`flex items-center gap-4 px-4 py-3 ${
                        i < shops.length - 1 ? "border-b border-gray-card" : ""
                      } hover:bg-gray-light transition-colors`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-body font-medium text-brand-navy text-sm leading-tight">{shop.name}</p>
                          {!shop.isActive && (
                            <span className="text-[10px] bg-gray-light text-gray-muted px-1.5 py-0.5 font-body">Inactive</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-muted font-body mt-0.5 truncate">
                          {[shop.contactPerson, shop.phone].filter(Boolean).join(" · ") || "No contact info"}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(shop._id)}
                          className="p-1.5 text-gray-muted hover:text-brand-navy transition-colors"
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteId(shop._id)}
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

        {/* ── Add shop form ── */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-card p-5">
            <p className="font-heading font-semibold text-brand-navy text-sm mb-4">Add External Shop</p>
            <ShopForm
              key={create.isSuccess ? String(Date.now()) : "create"}
              initial={EMPTY_FORM}
              onSubmit={handleCreate}
              isPending={create.isPending}
              error={createError}
              submitLabel="Create shop"
            />
          </div>
        </div>
      </div>

      {/* ── Delete confirm modal ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 max-w-sm w-full mx-4 shadow-lg">
            <h2 className="font-heading font-semibold text-brand-navy text-base mb-2">Delete external shop?</h2>
            <p className="text-sm font-body text-gray-muted mb-6">
              Products already tagged with this shop will keep a reference to it, but it will no longer
              be selectable on new or edited products.
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
