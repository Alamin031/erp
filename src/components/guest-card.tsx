"use client";

import { Guest } from "@/types/guest";

interface GuestCardProps {
  guest: Guest;
  onClick: () => void;
}

const statusColors: Record<string, string> = {
  "Checked-in": "bg-green-100 text-green-800",
  "Checked-out": "bg-gray-100 text-gray-800",
  "Reserved": "bg-blue-100 text-blue-800",
  "Cancelled": "bg-red-100 text-red-800",
};

export function GuestCard({ guest, onClick }: GuestCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (id: string) => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-cyan-500", "bg-indigo-500"];
    return colors[id.charCodeAt(0) % colors.length];
  };

  return (
    <div
      onClick={onClick}
      className="bg-card-bg border border-border rounded-lg shadow-sm p-4 cursor-pointer transition-all hover:border-primary hover:shadow-md"
    >
      <div className="flex gap-3 mb-3">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${getAvatarColor(guest.id)}`}
        >
          {getInitials(guest.firstName, guest.lastName)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground truncate">
            {guest.firstName} {guest.lastName}
          </h3>
          <p className="text-xs text-secondary truncate">{guest.email}</p>
          {guest.currentRoomNumber && (
            <p className="text-xs font-semibold text-primary">Room {guest.currentRoomNumber}</p>
          )}
        </div>
      </div>

      <div className="flex gap-1 flex-wrap mb-3">
        {guest.tags.length > 0 ? (
          guest.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 bg-background rounded text-foreground">
              {tag === "VIP" ? "⭐" : tag === "Do-not-disturb" ? "🔇" : tag === "No-smoking" ? "🚭" : "•"} {tag}
            </span>
          ))
        ) : (
          <span className="text-xs text-secondary">No tags</span>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs px-2 py-1 rounded font-semibold ${statusColors[guest.status]}`}>
          {guest.status}
        </span>
        <span className="text-xs text-secondary">{guest.paymentStatus}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="flex-1 btn btn-primary text-xs py-1"
        >
          View
        </button>
        {guest.status === "Checked-in" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex-1 btn btn-secondary text-xs py-1"
          >
            Check-out
          </button>
        )}
      </div>
    </div>
  );
}
