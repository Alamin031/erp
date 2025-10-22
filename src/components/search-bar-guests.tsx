"use client";

import { useState } from "react";

interface SearchBarGuestsProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBarGuests({
  onSearch,
  placeholder = "Search by name, room number, email, or phone...",
}: SearchBarGuestsProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative flex-1">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="form-input w-full pr-10"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground"
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
