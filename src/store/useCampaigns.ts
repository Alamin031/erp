import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Campaign, CampaignFilters } from "@/types/campaigns";

interface CampaignsStore {
  campaigns: Campaign[];
  filters: CampaignFilters;
  selectedCampaign: Campaign | null;
  setCampaigns: (campaigns: Campaign[]) => void;
  setFilters: (filters: CampaignFilters) => void;
  setSelectedCampaign: (campaign: Campaign | null) => void;
  addCampaign: (campaign: Campaign) => void;
  editCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  filterCampaigns: () => Campaign[];
  getCampaignStats: () => {
    totalCampaigns: number;
    activeCampaigns: number;
    completedCampaigns: number;
    totalBudget: number;
    avgCTR: number;
    avgROI: number;
  };
  exportCampaigns: (format: "csv" | "json" | "pdf") => string;
}

export const useCampaigns = create<CampaignsStore>()(
  persist(
    (set, get) => ({
      campaigns: [],
      filters: {
        status: "",
        channel: "",
        searchQuery: "",
        dateFrom: "",
        dateTo: "",
        roiFrom: 0,
        roiTo: 500,
      },
      selectedCampaign: null,

      setCampaigns: (campaigns) => set({ campaigns }),

      setFilters: (filters) => set({ filters }),

      setSelectedCampaign: (campaign) => set({ selectedCampaign: campaign }),

      addCampaign: (campaign) => {
        set(state => ({
          campaigns: [...state.campaigns, campaign],
        }));
      },

      editCampaign: (id, updates) => {
        set(state => ({
          campaigns: state.campaigns.map(campaign =>
            campaign.id === id
              ? {
                  ...campaign,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : campaign
          ),
        }));
      },

      deleteCampaign: (id) => {
        set(state => ({
          campaigns: state.campaigns.filter(campaign => campaign.id !== id),
        }));
      },

      filterCampaigns: () => {
        const { campaigns, filters } = get();
        let filtered = campaigns;

        if (filters.status) {
          filtered = filtered.filter(campaign => campaign.status === filters.status);
        }

        if (filters.channel) {
          filtered = filtered.filter(campaign => campaign.channel === filters.channel);
        }

        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(
            campaign =>
              campaign.name.toLowerCase().includes(query) ||
              campaign.channel.toLowerCase().includes(query) ||
              campaign.description.toLowerCase().includes(query)
          );
        }

        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom).getTime();
          filtered = filtered.filter(
            campaign => new Date(campaign.startDate).getTime() >= fromDate
          );
        }

        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo).getTime();
          filtered = filtered.filter(
            campaign => new Date(campaign.startDate).getTime() <= toDate
          );
        }

        if (filters.roiFrom !== undefined) {
          filtered = filtered.filter(campaign => campaign.roi >= filters.roiFrom);
        }

        if (filters.roiTo !== undefined) {
          filtered = filtered.filter(campaign => campaign.roi <= filters.roiTo);
        }

        return filtered;
      },

      getCampaignStats: () => {
        const campaigns = get().campaigns;

        const totalCampaigns = campaigns.length;
        const activeCampaigns = campaigns.filter(c => c.status === "Active").length;
        const completedCampaigns = campaigns.filter(c => c.status === "Completed").length;
        const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);

        const avgCTR =
          totalCampaigns > 0
            ? campaigns.reduce((sum, c) => sum + c.ctr, 0) / totalCampaigns
            : 0;

        const avgROI =
          totalCampaigns > 0
            ? campaigns.reduce((sum, c) => sum + c.roi, 0) / totalCampaigns
            : 0;

        return {
          totalCampaigns,
          activeCampaigns,
          completedCampaigns,
          totalBudget,
          avgCTR,
          avgROI,
        };
      },

      exportCampaigns: (format) => {
        const campaigns = get().filterCampaigns();

        if (format === "json") {
          return JSON.stringify(campaigns, null, 2);
        }

        if (format === "csv") {
          const headers = [
            "Campaign ID",
            "Name",
            "Channel",
            "Status",
            "Start Date",
            "End Date",
            "Budget",
            "Spend",
            "CTR",
            "ROI",
            "Impressions",
            "Clicks",
            "Conversions",
          ];

          const rows = campaigns.map(campaign => [
            campaign.id,
            campaign.name,
            campaign.channel,
            campaign.status,
            new Date(campaign.startDate).toLocaleDateString(),
            new Date(campaign.endDate).toLocaleDateString(),
            campaign.budget.toFixed(2),
            campaign.spend.toFixed(2),
            campaign.ctr.toFixed(2),
            campaign.roi.toFixed(2),
            campaign.impressions,
            campaign.clicks,
            campaign.conversions,
          ]);

          const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
          ].join("\n");

          return csvContent;
        }

        return "";
      },
    }),
    {
      name: "campaigns-store",
    }
  )
);
