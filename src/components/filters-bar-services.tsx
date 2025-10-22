"use client";

import { useGuestServices } from "@/store/useGuestServices";
import { RequestStatus, Priority, ServiceType } from "@/types/guest-services";

export function FiltersBarServices() {
  const { filters, setFilters, staff } = useGuestServices();

  const handleStatusChange = (status: RequestStatus | "All") => {
    setFilters({ ...filters, status });
  };

  const handlePriorityChange = (priority: Priority | "All") => {
    setFilters({ ...filters, priority });
  };

  const handleServiceTypeChange = (serviceType: ServiceType | "All") => {
    setFilters({ ...filters, serviceType });
  };

  const handleStaffChange = (staffId: string) => {
    setFilters({ ...filters, assignedStaff: staffId });
  };

  const handleDateFromChange = (dateFrom: string) => {
    setFilters({ ...filters, dateFrom });
  };

  const handleDateToChange = (dateTo: string) => {
    setFilters({ ...filters, dateTo });
  };

  const handleReset = () => {
    setFilters({
      status: "All",
      priority: "All",
      serviceType: "All",
      assignedStaff: "All",
      dateFrom: "",
      dateTo: "",
    });
  };

  const serviceTypes: ServiceType[] = ["Room Service", "Housekeeping Request", "Maintenance", "Wake-up Call", "Laundry", "Other"];
  const priorities: Priority[] = ["Low", "Normal", "High", "Urgent"];
  const statuses: RequestStatus[] = ["Open", "In Progress", "Resolved", "Cancelled"];

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
          <label className="form-label">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => handlePriorityChange(e.target.value as any)}
            className="form-input"
          >
            <option value="All">All</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">Service Type</label>
          <select
            value={filters.serviceType}
            onChange={(e) => handleServiceTypeChange(e.target.value as any)}
            className="form-input"
          >
            <option value="All">All</option>
            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">Assigned Staff</label>
          <select
            value={filters.assignedStaff}
            onChange={(e) => handleStaffChange(e.target.value)}
            className="form-input"
          >
            <option value="All">All</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleDateFromChange(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="filter-group">
          <label className="form-label">To</label>
          <input
            type="date"
            value={filters.dateTo}
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
