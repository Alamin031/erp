"use client";

import { useState } from 'react';

interface Props { onApply: (f: any)=>void; onReset: ()=>void }

export function FiltersBar({ onApply, onReset }: Props) {
  const [owner, setOwner] = useState('All');
  const [stage, setStage] = useState('All');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
      <select className="form-input" value={owner} onChange={(e)=>setOwner(e.target.value)}>
        <option>All</option>
        <option>Mike Thompson</option>
        <option>Emily Davis</option>
      </select>
      <select className="form-input" value={stage} onChange={(e)=>setStage(e.target.value)}>
        <option>All</option>
        <option>Prospecting</option>
        <option>Qualification</option>
        <option>Proposal</option>
        <option>Negotiation</option>
        <option>Closed Won</option>
        <option>Closed Lost</option>
      </select>
      <input type="date" className="form-input" value={from} onChange={(e)=>setFrom(e.target.value)} />
      <input type="date" className="form-input" value={to} onChange={(e)=>setTo(e.target.value)} />
      <input type="number" className="form-input" placeholder="Min value" value={min} onChange={(e)=>setMin(e.target.value)} />
      <input type="number" className="form-input" placeholder="Max value" value={max} onChange={(e)=>setMax(e.target.value)} />
      <button className="btn btn-secondary" onClick={()=>onApply({ owner, stage, from, to, min, max })}>Apply</button>
      <button className="btn" onClick={onReset}>Reset</button>
    </div>
  );
}
