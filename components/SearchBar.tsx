"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  initialValue?: string;
}

export default function SearchBar({ initialValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  function clear() {
    setQuery("");
    router.push("/shop");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center border border-gray-card bg-white h-10 w-full max-w-sm">
      <Search size={15} className="ml-3 text-gray-muted shrink-0" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products…"
        className="flex-1 px-2.5 text-sm font-body text-brand-navy placeholder:text-gray-muted focus:outline-none bg-transparent"
      />
      {query && (
        <button
          type="button"
          onClick={clear}
          className="px-2 text-gray-muted hover:text-brand-navy transition-colors"
        >
          <X size={14} />
        </button>
      )}
      <button
        type="submit"
        className="h-full px-4 bg-brand-navy text-white text-xs font-body font-medium hover:opacity-90 transition-opacity shrink-0"
      >
        Search
      </button>
    </form>
  );
}
