'use client';
import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';

export function OfferTemplatePreview({ open, onClose, template }: { open: boolean; onClose: ()=>void; template?: any }) {
  const [html, setHtml] = useState('');

  useEffect(()=> {
    const tpl = template?.body || 'Dear {candidate_name},\n\nWe are pleased to offer you the position of {job_title}...';
    const sample = tpl.replace(/\{candidate_name\}/g, 'Jane Doe').replace(/\{job_title\}/g, 'Senior Engineer').replace(/\{salary\}/g, '$120,000').replace(/\{joining_date\}/g, new Date().toLocaleDateString());
    setHtml(sample);
  }, [template]);

  if (!open) return null;
  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <div className="relative w-full max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 z-50">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Offer Preview</h3>
          <div className="prose prose-invert max-h-[60vh] overflow-auto text-zinc-100 whitespace-pre-wrap">{html}</div>
          <div className="mt-4 text-right"><button onClick={onClose} className="px-3 py-2 rounded-md border border-zinc-700 text-zinc-200">Close</button></div>
        </div>
      </div>
    </Dialog>
  );
}
