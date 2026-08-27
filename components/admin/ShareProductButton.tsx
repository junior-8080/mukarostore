"use client";

import { useState } from "react";
import { Share2, Check, Loader2 } from "lucide-react";

async function fetchImageFile(imageUrl: string, filename: string): Promise<File | null> {
  try {
    const proxied = `/api/share-image?url=${encodeURIComponent(imageUrl)}`;
    const res = await fetch(proxied);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || "image/jpeg" });
  } catch {
    return null;
  }
}

export default function ShareProductButton({
  slug,
  name,
  price,
  image,
}: {
  slug: string;
  name: string;
  price: number;
  image?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/product/${slug}`;
    const summary = `${name} — ₵${price.toLocaleString()}`;
    const text = `${summary}\n${url}`;

    if (typeof navigator.share === "function") {
      // Try to attach the actual product photo so it posts as a photo status,
      // not just a text link (WhatsApp Status doesn't unfurl link previews).
      if (image) {
        setLoading(true);
        const file = await fetchImageFile(image, `${slug}.jpg`);
        setLoading(false);
        if (file && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: name, text: summary });
            return;
          } catch {
            // user dismissed the share sheet
            return;
          }
        }
      }

      try {
        await navigator.share({ title: name, text: summary, url });
      } catch {
        // user dismissed the share sheet
      }
      return;
    }

    // Desktop fallback: open WhatsApp's share dialog and copy the message
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={loading}
      title="Share to WhatsApp Status"
      className="inline-flex items-center gap-1 text-xs font-body text-brand-gold hover:underline shrink-0 disabled:opacity-60"
    >
      {loading ? (
        <Loader2 size={13} className="animate-spin" />
      ) : copied ? (
        <Check size={13} className="text-green-600" />
      ) : (
        <Share2 size={13} />
      )}
      {loading ? "Preparing…" : copied ? "Copied" : "Share"}
    </button>
  );
}