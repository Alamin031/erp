'use client';
import { useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useOffers } from '../store/useOffers';
import { useApplicants } from '../../applicants/store/useApplicants';
import { useJobs } from '../../jobs/store/useJobs';
import { useToast } from '@/components/toast';
import { Download, Mail, CheckCircle, XCircle, Edit2 } from 'lucide-react';

export function OfferDetailsDrawer({ offerId, onClose }: { offerId: string; onClose: ()=>void }) {
  const { offers, updateOffer, sendOffer, markAccepted, markDeclined, withdrawOffer, selectOffer } = useOffers();
  const { applicants } = useApplicants();
  const { jobs } = useJobs();
  const { showToast } = useToast();

  const offer = offers.find(o=> o.id === offerId);
  useEffect(()=> { if (!offer) selectOffer(null); }, [offer]);
  if (!offer) return null;

  const candidate = applicants.find(a=> a.id === offer.applicantId);
  const job = jobs.find(j=> j.id === offer.jobId);

  function handleSend() { if (!offer) return; sendOffer(offer.id); showToast('Offer sent'); }
  function handleAccept() { if (!offer) return; markAccepted(offer.id); showToast('Marked accepted'); }
  function handleDecline() { if (!offer) return; markDeclined(offer.id); showToast('Marked declined'); }
  function handleWithdraw() { if (!offer) return; withdrawOffer(offer.id); showToast('Offer withdrawn'); }
  function handleDownload() { if (!offer) return; const a = offer.attachments?.[0]; if (a && a.url) { const win = window.open(a.url); if (!win) alert('Unable to open file'); } else { showToast('No attachment'); } }

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-end justify-end min-h-screen">
        <div className="fixed inset-0 bg-black/40" aria-hidden />
        <div className="relative w-full max-w-xl bg-zinc-900 border-l border-zinc-800 p-6 z-50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-zinc-100">Offer {offer.id}</h3>
              <p className="text-zinc-400 text-sm">{candidate?.name} — {job?.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleDownload} className="text-zinc-300 hover:text-zinc-100"><Download className="h-4 w-4" /></button>
              <button onClick={()=> { /* open edit */ selectOffer(offer.id); }} className="text-amber-400 hover:text-amber-300"><Edit2 className="h-4 w-4" /></button>
              <button onClick={onClose} className="text-zinc-400">Close</button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-zinc-800 border border-zinc-700 rounded-md p-3">
              <h4 className="text-zinc-200 text-sm font-medium">Candidate</h4>
              <div className="text-zinc-100 mt-2">{candidate?.name}</div>
              <div className="text-zinc-400 text-sm">{candidate?.email}</div>
              <div className="text-zinc-400 text-sm">{candidate?.phone}</div>
            </div>
            <div className="bg-zinc-800 border border-zinc-700 rounded-md p-3">
              <h4 className="text-zinc-200 text-sm font-medium">Offer Summary</h4>
              <div className="text-zinc-100 mt-2">Salary: {offer.baseSalary ? `$${offer.baseSalary}` : '-'}</div>
              <div className="text-zinc-400 text-sm">Joining: {offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : '-'}</div>
              <div className="text-zinc-400 text-sm">Expiry: {offer.expiryDate ? new Date(offer.expiryDate).toLocaleDateString() : '-'}</div>
              <div className="text-zinc-400 text-sm">Status: {offer.status}</div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-zinc-200 text-sm font-medium">Notes</h4>
            <div className="text-zinc-300 mt-2 whitespace-pre-wrap">{offer.notes || '-'}</div>
          </div>

          <div className="mt-4">
            <h4 className="text-zinc-200 text-sm font-medium">Timeline</h4>
            <div className="mt-2 space-y-2">
              {(offer.timeline || []).slice().reverse().map(t => (
                <div key={t.id} className="text-zinc-400 text-sm">{new Date(t.at).toLocaleString()} — {t.text}</div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            {offer.status !== 'sent' && offer.status !== 'accepted' && <button onClick={handleSend} className="px-3 py-2 rounded-md bg-blue-600 text-white">Send Offer</button>}
            {offer.status === 'sent' && <button onClick={handleAccept} className="px-3 py-2 rounded-md bg-green-600 text-white">Mark Accepted</button>}
            {offer.status === 'sent' && <button onClick={handleDecline} className="px-3 py-2 rounded-md bg-rose-600 text-white">Mark Declined</button>}
            <button onClick={handleWithdraw} className="px-3 py-2 rounded-md border border-zinc-700 text-zinc-200">Withdraw</button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
