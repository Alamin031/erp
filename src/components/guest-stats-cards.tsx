"use client";

import { useGuests } from "@/store/useGuests";

export function GuestStatsCards() {
  const { guests, getStats } = useGuests();
  const stats = getStats();

  const getTopNationalities = () => {
    const nationalities: Record<string, number> = {};
    guests.forEach((g) => {
      nationalities[g.nationality] = (nationalities[g.nationality] || 0) + 1;
    });
    return Object.entries(nationalities)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([nat]) => nat);
  };

  const getAvgLengthOfStay = () => {
    const completed = guests.filter((g) => g.checkOutDate && g.totalNights);
    if (completed.length === 0) return 0;
    const avg = completed.reduce((sum, g) => sum + (g.totalNights || 0), 0) / completed.length;
    return avg.toFixed(1);
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Guest Analytics</h3>

      <div className="stat-card">
        <div className="stat-label">Guests by Status</div>
        <div className="text-xs space-y-1 mt-2">
          <div className="flex justify-between">
            <span>Checked-in</span>
            <span className="font-semibold text-primary">{stats.checkedInGuests}</span>
          </div>
          <div className="flex justify-between">
            <span>Reserved</span>
            <span className="font-semibold">
              {guests.filter((g) => g.status === "Reserved").length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Checked-out</span>
            <span className="font-semibold">
              {guests.filter((g) => g.status === "Checked-out").length}
            </span>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Top Nationalities</div>
        <div className="text-xs space-y-1 mt-2">
          {getTopNationalities().map((nat, i) => (
            <div key={nat} className="flex justify-between">
              <span>{i + 1}. {nat}</span>
              <span className="font-semibold">
                {guests.filter((g) => g.nationality === nat).length}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Avg. Length of Stay</div>
        <div className="stat-value text-primary">{getAvgLengthOfStay()}</div>
        <div className="stat-change text-xs">nights</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="stat-card">
          <div className="stat-label">VIP Guests</div>
          <div className="stat-value text-primary text-2xl">⭐ {stats.vipGuests}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">New Today</div>
          <div className="stat-value text-success text-2xl">{stats.newGuestsToday}</div>
        </div>
      </div>
    </div>
  );
}
