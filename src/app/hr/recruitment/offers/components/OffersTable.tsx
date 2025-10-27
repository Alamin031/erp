import { useMemo } from 'react';
import { useOffers } from '../store/useOffers';
import { useApplicants } from '../../applicants/store/useApplicants';
import { useJobs } from '../../jobs/store/useJobs';
import { Download, Mail, Edit2, XCircle } from 'lucide-react';
import { useToast } from '@/components/toast';

export function OffersTable({ onView, onEdit }: { onView?: (id:string)=>void; onEdit?: (id:string)=>void }) {
  const { offers, sendOffer, withdrawOffer } = useOffers();
  const { applicants } = useApplicants();
  const { jobs } = useJobs();
  const { showToast } = useToast();

  const rows = useMemo(() => offers.slice(), [offers]);

  function handleSend(id:string) { sendOffer(id); showToast({ title: 'Offer sent', type: 'success' }); }
  function handleWithdraw(id:string) { withdrawOffer(id); showToast({ title: 'Offer withdrawn', type: 'success' }); }

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="text-zinc-400 text-xs">
          <tr>
            <th className="px-3 py-2 text-left">Offer ID</th>
            <th className="px-3 py-2 text-left">Candidate</th>
            <th className="px-3 py-2 text-left">Job Title</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Sent Date</th>
            <th className="px-3 py-2 text-left">Valid Until</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-t border-zinc-800 hover:bg-zinc-800/40">
              <td className="px-3 py-2 text-zinc-200">{r.id}</td>
              <td className="px-3 py-2 text-zinc-100">{applicants.find(a=> a.id === r.applicantId)?.name || '-'}</td>
              <td className="px-3 py-2 text-zinc-300">{jobs.find(j=> j.id === r.jobId)?.title || '-'}</td>
              <td className="px-3 py-2">
                <span className={`px-2 py-1 rounded-md text-xs ${r.status==='draft'? 'bg-zinc-700 text-zinc-300': r.status==='sent'? 'bg-blue-700 text-blue-100': r.status==='accepted'? 'bg-green-700 text-green-100': r.status==='declined'? 'bg-rose-700 text-rose-100': r.status==='expired'? 'bg-amber-700 text-amber-100': 'bg-zinc-700 text-zinc-300'}`}>
                  {r.status}
                </span>
              </td>
              <td className="px-3 py-2 text-zinc-300">{r.sentAt ? new Date(r.sentAt).toLocaleDateString() : '-'}</td>
              <td className="px-3 py-2 text-zinc-300">{r.expiryDate ? new Date(r.expiryDate).toLocaleDateString() : '-'}</td>
              <td className="px-3 py-2 text-right">
                <button onClick={()=> onView?.(r.id)} className="text-zinc-300 hover:text-zinc-100 mr-3">View</button>
                <button onClick={()=> onEdit?.(r.id)} className="text-amber-400 hover:text-amber-300 mr-3"><Edit2 className="inline h-4 w-4" /></button>
                {r.status === 'draft' && <button onClick={()=> handleSend(r.id)} className="text-blue-400 hover:text-blue-300 mr-3"><Mail className="inline h-4 w-4" /></button>}
                <button onClick={()=> { /* download logic: open attachment if present */ const a = r.attachments?.[0]; if (a && a.url) { const win = window.open(a.url); if (!win) alert('Unable to open file'); } else { showToast({ title: 'No attachment available', type: 'info' }); } }} className="text-zinc-300 hover:text-zinc-100 mr-3"><Download className="inline h-4 w-4" /></button>
                <button onClick={()=> handleWithdraw(r.id)} className="text-rose-400 hover:text-rose-300"><XCircle className="inline h-4 w-4" /></button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-zinc-400">No offers</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
