import { useEffect, useState } from 'react';
import { OffersTable } from './components/OffersTable';
import { OfferStatsCards } from './components/OfferStatsCards';
import { NewOfferModal } from './components/NewOfferModal';
import { OfferDetailsDrawer } from './components/OfferDetailsDrawer';
import { ToastContainer, useToast } from '@/components/toast';
import { useOffers } from './store/useOffers';

export function OffersPageClient() {
  const { loadDemoData, offers, selectedOfferId, selectOffer, checkExpiry } = useOffers();
  const { showToast, toasts, removeToast } = useToast();
  const [openNew, setOpenNew] = useState(false);

  useEffect(() => { if (offers.length === 0) loadDemoData(); }, [offers.length, loadDemoData]);
  useEffect(() => { const t = setInterval(() => checkExpiry(), 1000 * 60); return () => clearInterval(t); }, [checkExpiry]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-content">
        <div>
          <h1 className="dashboard-page-title">Offers</h1>
          <p className="dashboard-subtitle">Create and manage job offer letters</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setOpenNew(true)} className="px-3 py-2 rounded-xl bg-violet-500 text-black">+ New Offer</button>
        </div>
      </div>

      <OfferStatsCards />

      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* simple filters could be added here if needed */}
            <div className="text-zinc-400 text-sm">Filters</div>
          </div>
        </div>

        <OffersTable onView={(id)=> selectOffer(id)} onEdit={(id)=> { selectOffer(id); setOpenNew(true); }} />
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {openNew && <NewOfferModal open={openNew} onClose={() => setOpenNew(false)} onSaved={() => { setOpenNew(false); showToast('Offer saved'); }} />}

      {selectedOfferId && <OfferDetailsDrawer offerId={selectedOfferId} onClose={() => selectOffer(null)} />}
    </div>
  );
}
