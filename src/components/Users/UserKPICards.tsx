"use client";

import { useUsers } from "@/store/useUsers";

export function UserKPICards() {
  const { users, getActiveUsers, getAdmins, getPendingInvites, getActiveSessions } = useUsers();

  const totalUsers = users.length;
  const activeUsers = getActiveUsers().length;
  const admins = getAdmins().length;
  const pendingInvites = getPendingInvites().length;
  const activeSessions = getActiveSessions();

  const cards = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: "👥",
      color: "bg-blue-100 text-blue-800",
    },
    {
      label: "Active Sessions",
      value: activeSessions,
      icon: "🔒",
      color: "bg-green-100 text-green-800",
    },
    {
      label: "Admins",
      value: admins,
      icon: "👨‍💼",
      color: "bg-red-100 text-red-800",
    },
    {
      label: "Pending Invites",
      value: pendingInvites,
      icon: "📧",
      color: "bg-yellow-100 text-yellow-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`dashboard-section p-4 rounded-lg border ${card.color}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium opacity-75">{card.label}</p>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>
            <span className="text-3xl">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
