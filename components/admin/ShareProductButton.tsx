"use client";

import { useState } from "react";
import { Share2, Check, Loader2 } from "lucide-react";

const SITE_URL = "https://www.mukarostore.com";

function isMobileDevice(): boolean {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Fetches the product photo through our same-origin proxy (R2 doesn't send
// CORS headers, so a direct cross-origin fetch would be blocked) so it can
// be attached as a file to navigator.share.
async function fetchShareImage(imageUrl: string): Promise<File | null> {
  try {
    const proxied = `/api/share-image?url=${encodeURIComponent(imageUrl)}`;
    const res = await fetch(proxied);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new File([blob], "share.jpg", { type: blob.type || "image/jpeg" });
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
    const url = `${SITE_URL}/product/${slug}`;
    const summary = `${name} — ₵${price.toLocaleString()}`;
    const text = `${summary}\n${url}`;

    // The desktop OS share sheet (Mac/Windows) hands shared files off to
    // whatever target the user picks, and targets like WhatsApp Desktop
    // don't consume them properly — they just paste the temp file's local
    // path as text. So file-based sharing is mobile-only; desktop downloads
    // the product photo instead and opens WhatsApp Web with the caption ready.
    if (isMobileDevice() && typeof navigator.share === "function") {
      if (image) {
        setLoading(true);
        const file = await fetchShareImage(image);
        setLoading(false);
        if (file && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: name, text });
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

    if (image) {
      setLoading(true);
      const file = await fetchShareImage(image);
      setLoading(false);
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = `${slug}.jpg`;
        a.click();
        URL.revokeObjectURL(objectUrl);
      }
    }

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