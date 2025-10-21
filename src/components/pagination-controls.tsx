"use client";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}: PaginationControlsProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
      }}
    >
      <div style={{ fontSize: "13px", color: "var(--secondary)" }}>
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} rooms
      </div>

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: "8px 12px",
            fontSize: "13px",
            fontWeight: "600",
            color: currentPage === 1 ? "var(--secondary)" : "var(--primary)",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            opacity: currentPage === 1 ? 0.5 : 1,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            if (currentPage > 1) {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
              (e.currentTarget as HTMLElement).style.background = "var(--primary)";
              (e.currentTarget as HTMLElement).style.color = "white";
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = currentPage === 1 ? "var(--secondary)" : "var(--primary)";
          }}
        >
          ← Previous
        </button>

        <div style={{ display: "flex", gap: "4px" }}>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = Math.max(1, currentPage - 2) + i;
            if (page > totalPages) return null;
            return (
              <button
                key={page}
                onClick={() => onPageChange?.(page)}
                style={{
                  padding: "6px 10px",
                  fontSize: "13px",
                  fontWeight: page === currentPage ? "700" : "500",
                  color: page === currentPage ? "white" : "var(--foreground)",
                  background: page === currentPage ? "var(--primary)" : "transparent",
                  border: page === currentPage ? "none" : "1px solid var(--border)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  minWidth: "32px",
                  textAlign: "center",
                }}
                onMouseEnter={e => {
                  if (page !== currentPage) {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
                  }
                }}
                onMouseLeave={e => {
                  if (page !== currentPage) {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  }
                }}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: "8px 12px",
            fontSize: "13px",
            fontWeight: "600",
            color: currentPage === totalPages ? "var(--secondary)" : "var(--primary)",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            opacity: currentPage === totalPages ? 0.5 : 1,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            if (currentPage < totalPages) {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
              (e.currentTarget as HTMLElement).style.background = "var(--primary)";
              (e.currentTarget as HTMLElement).style.color = "white";
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = currentPage === totalPages ? "var(--secondary)" : "var(--primary)";
          }}
        >
          Next →
        </button>
      </div>

      <select
        value={itemsPerPage}
        onChange={e => onItemsPerPageChange?.(parseInt(e.target.value))}
        style={{
          padding: "8px 12px",
          fontSize: "13px",
          color: "var(--foreground)",
          background: "var(--background)",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        <option value="10">10 per page</option>
        <option value="20">20 per page</option>
        <option value="50">50 per page</option>
        <option value="100">100 per page</option>
      </select>
    </div>
  );
}
