"use client";

import { useState } from "react";
import { Share2, Check, Loader2 } from "lucide-react";

const TEAL = "#0D9488";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function isMobileDevice(): boolean {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function truncateToWidth(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let s = text;
  while (s.length > 1 && ctx.measureText(`${s}…`).width > maxWidth) {
    s = s.slice(0, -1);
  }
  return `${s}…`;
}

// Draws the product photo onto a canvas with a branded banner (name, price,
// shop link) burned in — WhatsApp Status doesn't reliably render tappable
// links in captions, so the link needs to be visible on the image itself.
async function buildShareImage(
  imageUrl: string,
  name: string,
  price: number,
  productUrl: string
): Promise<File | null> {
  try {
    const proxied = `/api/share-image?url=${encodeURIComponent(imageUrl)}`;
    const img = await loadImage(proxied);

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(img, 0, 0);

    const bannerHeight = Math.round(canvas.height * 0.17);
    const bannerY = canvas.height - bannerHeight;
    ctx.fillStyle = "rgba(24, 24, 27, 0.88)";
    ctx.fillRect(0, bannerY, canvas.width, bannerHeight);

    const pad = Math.round(canvas.width * 0.045);
    const maxTextWidth = canvas.width - pad * 2;
    const nameSize = Math.max(14, Math.round(bannerHeight * 0.3));
    const priceSize = Math.max(13, Math.round(bannerHeight * 0.27));
    const linkSize = Math.max(11, Math.round(bannerHeight * 0.2));

    ctx.textBaseline = "top";

    ctx.fillStyle = "#FFFFFF";
    ctx.font = `700 ${nameSize}px sans-serif`;
    const nameY = bannerY + pad * 0.7;
    ctx.fillText(truncateToWidth(ctx, name, maxTextWidth), pad, nameY);

    ctx.fillStyle = TEAL;
    ctx.font = `700 ${priceSize}px sans-serif`;
    const priceY = nameY + nameSize + pad * 0.35;
    ctx.fillText(`₵${price.toLocaleString()}`, pad, priceY);

    ctx.fillStyle = "#E4E4E7";
    ctx.font = `500 ${linkSize}px sans-serif`;
    const displayUrl = productUrl.replace(/^https?:\/\//, "");
    const linkY = canvas.height - linkSize - pad * 0.55;
    ctx.fillText(truncateToWidth(ctx, `Shop now → ${displayUrl}`, maxTextWidth), pad, linkY);

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
    if (!blob) return null;
    return new File([blob], "share.jpg", { type: "image/jpeg" });
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

    // The desktop OS share sheet (Mac/Windows) hands shared files off to
    // whatever target the user picks, and targets like WhatsApp Desktop
    // don't consume them properly — they just paste the temp file's local
    // path as text. So file-based sharing is mobile-only; desktop downloads
    // the branded image instead and opens WhatsApp Web with the caption ready.
    if (isMobileDevice() && typeof navigator.share === "function") {
      if (image) {
        setLoading(true);
        const file = await buildShareImage(image, name, price, url);
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
      const file = await buildShareImage(image, name, price, url);
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