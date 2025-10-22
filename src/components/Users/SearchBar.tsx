"use client";

import { useUsers } from "@/store/useUsers";

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useUsers();

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="form-input pl-10"
        style={{ paddingLeft: "36px" }}
      />
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary">
        🔍
      </span>
    </div>
  );
}
