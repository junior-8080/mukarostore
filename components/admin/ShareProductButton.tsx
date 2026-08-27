"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareProductButton({
  slug,
  name,
  price,
}: {
  slug: string;
  name: string;
  price: number;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/product/${slug}`;
    const summary = `${name} — ₵${price.toLocaleString()}`;
    const text = `${summary}\n${url}`;

    if (typeof navigator.share === "function") {
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
      title="Share to WhatsApp Status"
      className="inline-flex items-center gap-1 text-xs font-body text-brand-gold hover:underline shrink-0"
    >
      {copied ? <Check size={13} className="text-green-600" /> : <Share2 size={13} />}
      {copied ? "Copied" : "Share"}
    </button>
  );
}