"use client";

import { useState } from "react";
import { useEquipment } from "@/store/useEquipment";
import { Equipment, Supplier } from "@/types/equipment";

interface Props {
  suppliers: Supplier[];
  equipment: Equipment[];
  onViewChange: (view: "table" | "grid") => void;
  currentView: "table" | "grid";
}

export function EquipmentFilterBar({
  suppliers,
  equipment,
  onViewChange,
  currentView,
}: Props) {
  const { filters, setFilters, searchQuery, setSearchQuery } = useEquipment();
  const [showFilters, setShowFilters] = useState(false);

  const categories = Array.from(new Set(equipment.map((e) => e.category))).sort();
  const locations = Array.from(new Set(equipment.map((e) => e.location || "").filter(Boolean))).sort();
  const statuses: Equipment["status"][] = ["Active", "In Use", "Under Maintenance", "Retired"];

  const handleCategoryChange = (value: string) => {
    setFilters({ ...filters, category: value === "All" ? "All" : value });
  };

  const handleLocationChange = (value: string) => {
    setFilters({ ...filters, location: value === "All" ? "All" : value });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: (value === "All" ? "All" : value) as any });
  };

  const handleSupplierChange = (value: string) => {
    setFilters({ ...filters, supplierId: value === "All" ? "All" : value });
  };

  const handleWarrantyWindow = (value: string) => {
    setFilters({ ...filters, warrantyWindow: (value as any) });
  };

  const handleLowStockOnly = () => {
    setFilters({ ...filters, lowStockOnly: !filters.lowStockOnly });
  };

  const clearFilters = () => {
    setFilters({
      category: "All",
      location: "All",
      status: "All",
      supplierId: "All",
      warrantyWindow: "All",
      lowStockOnly: false,
    });
    setSearchQuery("");
  };

  const activeFilterCount = [
    filters.category !== "All",
    filters.location !== "All",
    filters.status !== "All",
    filters.supplierId !== "All",
    filters.warrantyWindow !== "All",
    filters.lowStockOnly,
    searchQuery.trim() !== "",
  ].filter(Boolean).length;

  return (
    <div className="dashboard-section">
      <div className="flex flex-col gap-4">
        {/* Search and View Toggle */}
        <div className="flex gap-2 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name, SKU, serial number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "36px" }}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary">
              🔍
            </span>
          </div>
          <button
            className={`btn ${currentView === "table" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => onViewChange("table")}
            title="Table View"
          >
            📋
          </button>
          <button
            className={`btn ${currentView === "grid" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => onViewChange("grid")}
            title="Grid View"
          >
            🔲
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            🔽 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-background">
            <div>
              <label className="form-label text-sm">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="form-input text-sm"
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label text-sm">Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="form-input text-sm"
              >
                <option value="All">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label text-sm">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="form-input text-sm"
              >
                <option value="All">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label text-sm">Supplier</label>
              <select
                value={filters.supplierId}
                onChange={(e) => handleSupplierChange(e.target.value)}
                className="form-input text-sm"
              >
                <option value="All">All Suppliers</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label text-sm">Warranty Expiry</label>
              <select
                value={filters.warrantyWindow}
                onChange={(e) => handleWarrantyWindow(e.target.value)}
                className="form-input text-sm"
              >
                <option value="All">All Items</option>
                <option value="30">Expiring in 30 days</option>
                <option value="90">Expiring in 90 days</option>
              </select>
            </div>

            <div>
              <label className="form-label text-sm">Stock Level</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.lowStockOnly}
                  onChange={handleLowStockOnly}
                />
                <span className="text-sm">Low Stock Only</span>
              </label>
            </div>

            {activeFilterCount > 0 && (
              <div className="col-span-full flex gap-2 justify-end">
                <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
