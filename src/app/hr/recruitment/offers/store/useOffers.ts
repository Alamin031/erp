import { persist } from 'zustand/middleware';
import type { Offer, OfferFilters, OfferTimelineItem } from '../types';

interface OffersState {
  offers: Offer[];
  selectedOfferId?: string | null;
  filters: OfferFilters;
  loading: boolean;

  loadDemoData: () => Promise<void>;
  createOffer: (payload: Partial<Offer>) => void;
  updateOffer: (id: string, payload: Partial<Offer>) => void;
  sendOffer: (id: string) => void;
  markAccepted: (id: string) => void;
  markDeclined: (id: string) => void;
  withdrawOffer: (id: string) => void;
  selectOffer: (id?: string | null) => void;
  filterOffers: (filters: Partial<OfferFilters>) => void;
  checkExpiry: () => void;
}

function uid(prefix = 'of') { return `${prefix}-${Math.random().toString(36).slice(2,8)}-${Date.now().toString(36)}`; }

export const useOffers = create<OffersState>()(
  persist((set, get) => ({
    offers: [],
    selectedOfferId: null,
    filters: { status: 'all' },
    loading: false,

    async loadDemoData() {
      set({ loading: true });
      try {
        const offers = await fetch('/demo/demoOffers.json').then(r => r.json()).catch(() => []);
        const now = new Date().toISOString();
        const normalized = (offers || []).map((o:any) => ({ id: o.id || uid('of'), createdAt: o.createdAt || now, updatedAt: o.updatedAt || now, timeline: o.timeline || [], ...o }));
        set({ offers: normalized, loading: false });
      } catch (e) { console.error(e); set({ loading: false }); }
    },

    createOffer(payload) {
      const now = new Date().toISOString();
      const offer: Offer = { id: uid('of'), createdAt: now, updatedAt: now, status: 'draft', timeline: [{ id: uid('tl'), status: 'draft', text: 'Created draft', at: now }], ...payload } as Offer;
      set(state => ({ offers: [offer, ...state.offers] }));
    },

    updateOffer(id, payload) {
      const now = new Date().toISOString();
      set(state => ({ offers: state.offers.map(o => o.id === id ? { ...o, ...payload, updatedAt: now, timeline: [...(o.timeline||[]), { id: uid('tl'), status: 'updated', text: 'Offer updated', at: now }] } : o) }));
    },

    sendOffer(id) {
      const now = new Date().toISOString();
      set(state => ({ offers: state.offers.map(o => {
        if (o.id !== id) return o;
        if (o.status === 'sent' || o.status === 'accepted') return o;
        return { ...o, status: 'sent', sentAt: now, updatedAt: now, timeline: [...(o.timeline||[]), { id: uid('tl'), status: 'sent', text: 'Offer sent to candidate', at: now }] };
      }) }));
    },

    markAccepted(id) {
      const now = new Date().toISOString();
      set(state => ({ offers: state.offers.map(o => o.id === id ? { ...o, status: 'accepted', updatedAt: now, timeline: [...(o.timeline||[]), { id: uid('tl'), status: 'accepted', text: 'Offer accepted by candidate', at: now }] } : o) }));
    },

    markDeclined(id) {
      const now = new Date().toISOString();
      set(state => ({ offers: state.offers.map(o => o.id === id ? { ...o, status: 'declined', updatedAt: now, timeline: [...(o.timeline||[]), { id: uid('tl'), status: 'declined', text: 'Offer declined by candidate', at: now }] } : o) }));
    },

    withdrawOffer(id) {
      const now = new Date().toISOString();
      set(state => ({ offers: state.offers.map(o => o.id === id ? { ...o, status: 'withdrawn', updatedAt: now, timeline: [...(o.timeline||[]), { id: uid('tl'), status: 'withdrawn', text: 'Offer withdrawn by HR', at: now }] } : o) }));
    },

    selectOffer(id) { set({ selectedOfferId: id || null }); },

    filterOffers(filters) { set({ filters: { ...get().filters, ...filters } }); },

    checkExpiry() {
      const now = new Date();
      set(state => ({ offers: state.offers.map(o => {
        if (!o.expiryDate) return o;
        if (o.status === 'expired' || o.status === 'accepted' || o.status === 'declined' || o.status === 'withdrawn') return o;
        const expiry = new Date(o.expiryDate);
        if (expiry < now) {
          const at = new Date().toISOString();
          return { ...o, status: 'expired', updatedAt: at, timeline: [...(o.timeline||[]), { id: uid('tl'), status: 'expired', text: 'Offer expired', at }] };
        }
        return o;
      }) }));
    }

  }), { name: 'offers-store' })
);
