"use client";

import { useGuests } from "@/store/useGuests";
import { GuestStatus, GuestTag } from "@/types/guest";

export function FiltersBarGuests() {
  const { filters, setFilters } = useGuests();

  const handleStatusChange = (status: GuestStatus | "All") => {
    setFilters({ ...filters, status });
  };

  const handleTagChange = (tag: GuestTag | "All") => {
    setFilters({ ...filters, tag });
  };

  const handleDateFromChange = (date: string) => {
    setFilters({ ...filters, dateFromArrival: date });
  };

  const handleDateToChange = (date: string) => {
    setFilters({ ...filters, dateToArrival: date });
  };

  const handleFloorChange = (floor: any) => {
    setFilters({ ...filters, floor: floor === "All" ? "All" : parseInt(floor) });
  };

  const handleReset = () => {
    setFilters({
      status: "All",
      tag: "All",
      dateFromArrival: "",
      dateToArrival: "",
      floor: "All",
      roomType: "All",
    });
  };

  const statuses: GuestStatus[] = ["Checked-in", "Checked-out", "Reserved", "Cancelled"];
  const tags: GuestTag[] = ["VIP", "Do-not-disturb", "No-smoking", "Wheelchair-accessible", "Extended-stay", "Corporate"];
  const floors = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="filters-section">
      <div className="filters-row">
        <div className="filter-group">
          <label className="form-label">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleStatusChange(e.target.value as any)}
            className="form-input"
          >
            <option value="All">All</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">Tag</label>
          <select
            value={filters.tag}
            onChange={(e) => handleTagChange(e.target.value as any)}
            className="form-input"
          >
            <option value="All">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">Floor</label>
          <select
            value={filters.floor === "All" ? "All" : filters.floor}
            onChange={(e) => handleFloorChange(e.target.value)}
            className="form-input"
          >
            <option value="All">All Floors</option>
            {floors.map((floor) => (
              <option key={floor} value={floor}>
                Floor {floor}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">From</label>
          <input
            type="date"
            value={filters.dateFromArrival}
            onChange={(e) => handleDateFromChange(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="filter-group">
          <label className="form-label">To</label>
          <input
            type="date"
            value={filters.dateToArrival}
            onChange={(e) => handleDateToChange(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="filter-group">
          <label className="form-label">&nbsp;</label>
          <button
            onClick={handleReset}
            className="btn btn-secondary w-full"
            title="Reset all filters"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
