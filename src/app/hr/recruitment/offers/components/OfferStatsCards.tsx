'use client';
import { useMemo } from 'react';
import { useOffers } from '../store/useOffers';

export function OfferStatsCards() {
  const { offers } = useOffers();

  const stats = useMemo(() => {
    const total = offers.length;
    const sent = offers.filter(o=> o.status === 'sent').length;
    const accepted = offers.filter(o=> o.status === 'accepted').length;
    const declined = offers.filter(o=> o.status === 'declined' || o.status === 'withdrawn').length;
    return { total, sent, accepted, declined };
  }, [offers]);

  return (
    <div className="grid grid-cols-4 gap-3 mb-4">
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="text-zinc-400 text-sm">Total Offers</div>
        <div className="text-zinc-100 text-2xl font-semibold">{stats.total}</div>
      </div>
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="text-zinc-400 text-sm">Offers Sent</div>
        <div className="text-zinc-100 text-2xl font-semibold">{stats.sent}</div>
      </div>
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="text-zinc-400 text-sm">Accepted</div>
        <div className="text-zinc-100 text-2xl font-semibold">{stats.accepted}</div>
      </div>
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="text-zinc-400 text-sm">Declined / Withdrawn</div>
        <div className="text-zinc-100 text-2xl font-semibold">{stats.declined}</div>
      </div>
    </div>
  );
}
