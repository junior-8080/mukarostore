"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useUpdateOrder } from "@/lib/hooks/use-admin-orders";

const STATUSES = ["placed", "processing", "delivered"] as const;
type Status = typeof STATUSES[number];

type Toast = { type: "success" | "error"; message: string };

export default function OrderActions({
  orderId,
  currentStatus,
  currentNotes,
}: {
  orderId: string;
  currentStatus: Status;
  currentNotes: string;
}) {
  const [status, setStatus] = useState<Status>(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [toast, setToast] = useState<Toast | null>(null);
  const { mutate: updateOrder, isPending } = useUpdateOrder();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  function handleSave() {
    updateOrder(
      { id: orderId, data: { status, notes } },
      {
        onSuccess: (data) => {
          setToast({
            type: "success",
            message: data.sms?.queued
              ? "Order updated. SMS sent to customer."
              : "Order updated successfully.",
          });
        },
        onError: () =>
          setToast({ type: "error", message: "Failed to update order. Please try again." }),
      }
    );
  }

  const inputCls =
    "w-full border border-[#CDCAC3] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#9B7A51] bg-white";

  return (
    <div className="bg-white rounded-xl border border-[#CDCAC3] p-5 space-y-4">
      <h2 className="font-semibold text-black mb-4">Update Order</h2>

      {/* Toast */}
      {toast && (
        <div
          className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={16} className="shrink-0 text-green-600" />
          ) : (
            <XCircle size={16} className="shrink-0 text-red-600" />
          )}
          {toast.message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-black/70 mb-1.5">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className={inputCls}>
            {STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-black/70 mb-1.5">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={inputCls}
            placeholder="Internal notes…"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="bg-[#6C3D0C] hover:bg-[#9B7A51] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}