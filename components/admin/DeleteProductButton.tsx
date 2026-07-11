"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useDeleteProduct } from "@/lib/hooks/use-admin-products";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [confirm, setConfirm] = useState(false);
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  if (confirm) {
    return (
      <span className="flex items-center gap-2">
        <button
          onClick={() => deleteProduct(id, { onSuccess: () => setConfirm(false) })}
          disabled={isPending}
          className="text-xs text-red-600 font-medium hover:underline disabled:opacity-50"
        >
          {isPending ? "Deleting…" : "Confirm"}
        </button>
        <button onClick={() => setConfirm(false)} className="text-xs text-black/40 hover:underline">
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      title={`Delete ${name}`}
      className="text-black/30 hover:text-red-500 transition-colors"
    >
      <Trash2 size={14} />
    </button>
  );
}