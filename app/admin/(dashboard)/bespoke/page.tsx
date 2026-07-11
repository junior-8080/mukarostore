"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  useAdminBespokeRequests,
  useUpdateBespokeRequest,
  useDeleteBespokeRequest,
  type AdminBespokeRequest,
} from "@/lib/hooks/use-admin-bespoke";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-yellow-100 text-yellow-700",
  contacted: "bg-blue-100 text-blue-700",
  closed: "bg-green-100 text-green-700",
};

const STATUSES = ["all", "new", "contacted", "closed"];

function StatusSelect({ request }: { request: AdminBespokeRequest }) {
  const updateRequest = useUpdateBespokeRequest();
  return (
    <select
      value={request.status}
      onChange={(e) =>
        updateRequest.mutate({
          id: request._id,
          data: { status: e.target.value as AdminBespokeRequest["status"] },
        })
      }
      className={`text-xs px-2 py-1 rounded-full font-medium capitalize border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[request.status]}`}
    >
      {STATUSES.filter((s) => s !== "all").map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

function BespokeContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? undefined;

  const { data: requests = [], isLoading } = useAdminBespokeRequests(status);
  const deleteRequest = useDeleteBespokeRequest();

  function handleDelete(id: string) {
    if (window.confirm("Delete this bespoke request? This cannot be undone.")) {
      deleteRequest.mutate(id);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-black mb-5 sm:mb-6">
        Bespoke Requests
      </h1>

      <div className="flex gap-2 mb-5 sm:mb-6 flex-wrap">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "all" ? "/admin/bespoke" : `/admin/bespoke?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${
              (s === "all" && !status) || status === s
                ? "bg-[#9B7A51] border-[#9B7A51] text-white"
                : "border-[#CDCAC3] text-black/60 bg-white hover:border-[#9B7A51]"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {isLoading ? (
        <div className="text-black/40 text-sm py-12 text-center">Loading…</div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#CDCAC3] px-5 py-12 text-center text-black/40 text-sm">
          No bespoke requests found.
        </div>
      ) : (
        <>
          {/* Card list — mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            {requests.map((req) => (
              <div key={req._id} className="bg-white rounded-xl border border-[#CDCAC3] p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-medium text-black text-sm">{req.name}</p>
                  <StatusSelect request={req} />
                </div>
                <a
                  href={`https://wa.me/${req.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#9B7A51] hover:underline"
                >
                  {req.phone}
                </a>
                <p className="text-xs text-black/60 mt-1.5">
                  {req.occasion}
                  {req.preferredDate && ` · Preferred: ${req.preferredDate}`}
                </p>
                {req.vision && (
                  <p className="text-xs text-black/50 mt-1.5 leading-relaxed">{req.vision}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-black/40">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDelete(req._id)}
                    className="text-black/30 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Table — tablet/desktop */}
          <div className="hidden md:block bg-white rounded-xl border border-[#CDCAC3] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#CDCAC3]">
                    {["Name", "Phone", "Occasion", "Preferred Date", "Vision", "Status", "Date", ""].map((h, i) => (
                      <th
                        key={i}
                        className="text-left px-5 py-3 text-xs font-medium text-black/50 uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id} className="border-b border-[#CDCAC3] last:border-0 hover:bg-[#FEFEFD]">
                      <td className="px-5 py-4 font-medium text-black whitespace-nowrap">{req.name}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <a
                          href={`https://wa.me/${req.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#9B7A51] hover:underline"
                        >
                          {req.phone}
                        </a>
                      </td>
                      <td className="px-5 py-4 text-black/60 whitespace-nowrap">{req.occasion}</td>
                      <td className="px-5 py-4 text-black/60 whitespace-nowrap">
                        {req.preferredDate || "—"}
                      </td>
                      <td className="px-5 py-4 text-black/50 text-xs max-w-[240px]">
                        <span className="line-clamp-2">{req.vision || "—"}</span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusSelect request={req} />
                      </td>
                      <td className="px-5 py-4 text-black/50 text-xs whitespace-nowrap">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleDelete(req._id)}
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

export default function BespokePage() {
  return (
    <Suspense>
      <BespokeContent />
    </Suspense>
  );
}