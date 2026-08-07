"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

export default function ImageUploader({ images, onChange, max }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append("images", f));
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.urls) onChange([...images, ...data.urls]);
      else setError(data.error ?? "Upload failed");
    } catch {
      setError("Upload failed — check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  function remove(idx: number) {
    onChange(images.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div className={`${max === 1 ? "flex gap-3" : "grid grid-cols-3 gap-3"} mb-3`}>
        {images.map((src, i) => (
          <div
            key={src}
            className={`relative overflow-hidden bg-gray-card ${
              max === 1 ? "w-28 h-28 shrink-0" : "rounded-lg aspect-square"
            }`}
          >
            <Image src={src} alt={`image-${i}`} fill className="object-cover" unoptimized />
            {i === 0 && max !== 1 && (
              <span className="absolute top-1 left-1 bg-brand-gold text-white text-[10px] px-1.5 py-0.5 font-body font-medium">
                Primary
              </span>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {(!max || images.length < max) && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={`border-2 border-dashed border-gray-card hover:border-brand-navy flex flex-col items-center justify-center gap-1 text-gray-muted hover:text-brand-navy transition-colors disabled:opacity-50 ${
              max === 1 ? "w-28 h-28 shrink-0" : "rounded-lg aspect-square"
            }`}
          >
            <Upload size={18} />
            <span className="text-xs font-body">{uploading ? "Uploading…" : "Add image"}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={!max || max > 1}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-xs text-gray-muted font-body">
        {max === 1 ? "Max 10 MB." : "First image is primary. Max 10 MB per image."}
      </p>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}