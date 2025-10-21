"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { redirect } from "next/navigation";
import { Campaign } from "@/types/campaigns";
import { useCampaigns } from "@/store/useCampaigns";
import { CampaignSummaryCards } from "@/components/campaign-summary-cards";
import { CampaignFilterBar } from "@/components/campaign-filter-bar";
import { CampaignModal } from "@/components/campaign-modal";
import { CampaignTable } from "@/components/campaign-table";
import { CampaignDetailModal } from "@/components/campaign-detail-modal";
import { CampaignExportModal } from "@/components/campaign-export-modal";
import { CampaignAnalytics } from "@/components/campaign-analytics";
import { useToast } from "@/components/toast";

type Tab = "All" | "Active" | "Completed" | "Drafts";

export default function CampaignsPage() {
  const { showToast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [selectedTab, setSelectedTab] = useState<Tab>("All");
  const [session, setSession] = useState<any>(null);

  const {
    campaigns,
    filters,
    selectedCampaign,
    setCampaigns,
    setFilters,
    setSelectedCampaign,
    addCampaign,
    editCampaign,
    deleteCampaign,
    filterCampaigns,
    getCampaignStats,
  } = useCampaigns();

  useEffect(() => {
    setIsClient(true);
    getSession().then((sess) => {
      if (!sess) {
        redirect("/login");
      }
      setSession(sess);
      const userRole = (sess.user as any).role;
      const allowedRoles = ["super_admin", "general_manager", "sales_marketing"];
      if (!allowedRoles.includes(userRole)) {
        redirect("/unauthorized");
      }

      // Load mock campaigns if empty
      if (campaigns.length === 0) {
        const mockCampaigns = [
          {
            id: "CMP-001",
            name: "Facebook Awareness Boost",
            channel: "Facebook" as const,
            startDate: "2025-09-01",
            endDate: "2025-09-15",
            budget: 1500,
            spend: 1200,
            goal: "Brand Awareness" as const,
            status: "Active" as const,
            ctr: 2.4,
            roi: 130,
            impressions: 125000,
            clicks: 3000,
            conversions: 450,
            description: "Social media campaign to increase brand awareness among target audience",
            createdAt: "2025-08-15T10:30:00Z",
            updatedAt: "2025-09-10T14:20:00Z",
          },
          {
            id: "CMP-002",
            name: "Google Search Leads Q3",
            channel: "Google" as const,
            startDate: "2025-08-10",
            endDate: "2025-08-30",
            budget: 2800,
            spend: 2800,
            goal: "Conversions" as const,
            status: "Completed" as const,
            ctr: 3.8,
            roi: 150,
            impressions: 85000,
            clicks: 3230,
            conversions: 315,
            description: "Google Ads search campaign to drive qualified leads",
            createdAt: "2025-07-20T09:15:00Z",
            updatedAt: "2025-08-30T16:45:00Z",
          },
          {
            id: "CMP-003",
            name: "Email Newsletter - Summer",
            channel: "Email" as const,
            startDate: "2025-09-05",
            endDate: "2025-09-20",
            budget: 500,
            spend: 350,
            goal: "Engagement" as const,
            status: "Active" as const,
            ctr: 5.2,
            roi: 280,
            impressions: 15000,
            clicks: 780,
            conversions: 95,
            description: "Email campaign for summer promotions and engagement",
            createdAt: "2025-08-25T11:00:00Z",
            updatedAt: "2025-09-08T13:30:00Z",
          },
          {
            id: "CMP-004",
            name: "Instagram Influencer Collab",
            channel: "Others" as const,
            startDate: "2025-08-15",
            endDate: "2025-08-25",
            budget: 3200,
            spend: 3200,
            goal: "Brand Awareness" as const,
            status: "Completed" as const,
            ctr: 4.1,
            roi: 185,
            impressions: 450000,
            clicks: 18450,
            conversions: 2210,
            description: "Influencer collaboration campaign on Instagram",
            createdAt: "2025-07-30T08:20:00Z",
            updatedAt: "2025-08-25T17:10:00Z",
          },
          {
            id: "CMP-005",
            name: "Q4 Holiday Campaign",
            channel: "Facebook" as const,
            startDate: "2025-09-15",
            endDate: "2025-10-15",
            budget: 5000,
            spend: 0,
            goal: "Conversions" as const,
            status: "Draft" as const,
            ctr: 0,
            roi: 0,
            impressions: 0,
            clicks: 0,
            conversions: 0,
            description: "Holiday season promotional campaign",
            createdAt: "2025-09-01T10:00:00Z",
            updatedAt: "2025-09-01T10:00:00Z",
          },
          {
            id: "CMP-006",
            name: "LinkedIn B2B Outreach",
            channel: "Others" as const,
            startDate: "2025-09-10",
            endDate: "2025-10-10",
            budget: 2200,
            spend: 800,
            goal: "Brand Awareness" as const,
            status: "Active" as const,
            ctr: 2.1,
            roi: 95,
            impressions: 42000,
            clicks: 882,
            conversions: 120,
            description: "B2B outreach through LinkedIn advertisements",
            createdAt: "2025-08-28T14:45:00Z",
            updatedAt: "2025-09-09T15:20:00Z",
          },
        ];
        setCampaigns(mockCampaigns);
      }
    });
  }, []);

  if (!isClient || !session) {
    return null;
  }

  const stats = getCampaignStats();

  const filteredCampaigns = filterCampaigns().filter((campaign) => {
    if (selectedTab === "All") return true;
    if (selectedTab === "Active") return campaign.status === "Active";
    if (selectedTab === "Completed") return campaign.status === "Completed";
    if (selectedTab === "Drafts") return campaign.status === "Draft";
    return true;
  });

  const handleAddCampaign = () => {
    setEditingCampaign(null);
    setIsModalOpen(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleSaveCampaign = (campaign: Campaign) => {
    if (editingCampaign) {
      editCampaign(editingCampaign.id, campaign);
      showToast("Campaign updated successfully", "success");
    } else {
      addCampaign(campaign);
      showToast("Campaign created successfully", "success");
    }
    setIsModalOpen(false);
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = (id: string) => {
    deleteCampaign(id);
    showToast("Campaign deleted successfully", "success");
  };

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDetailModalOpen(true);
  };

  const handleExportCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDetailModalOpen(false);
    setIsExportModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header-content">
          <h1 className="dashboard-page-title">🎯 Marketing Campaigns</h1>
          <p className="dashboard-subtitle">Manage marketing campaigns</p>
        </div>

        <CampaignSummaryCards
          activeCampaigns={stats.activeCampaigns}
          totalBudget={stats.totalBudget}
          avgCTR={stats.avgCTR}
          avgROI={stats.avgROI}
        />

        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {(["All", "Active", "Completed", "Drafts"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: selectedTab === tab ? "white" : "var(--secondary)",
                  background: selectedTab === tab ? "var(--primary)" : "transparent",
                  border: selectedTab === tab ? "none" : "1px solid var(--border)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {tab} Campaigns
              </button>
            ))}
          </div>

          <button
            onClick={handleAddCampaign}
            style={{
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: "600",
              color: "white",
              background: "var(--primary)",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            + New Campaign
          </button>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-section" style={{ gridColumn: "1 / -1" }}>
            <CampaignFilterBar onFilterChange={setFilters} />
          </div>

          <div className="dashboard-section" style={{ gridColumn: "1 / -1" }}>
            <CampaignTable
              campaigns={filteredCampaigns}
              onRowClick={handleViewCampaign}
              onEdit={handleEditCampaign}
              onDelete={handleDeleteCampaign}
            />
          </div>

          <div className="dashboard-section" style={{ gridColumn: "1 / -1" }}>
            <CampaignAnalytics campaigns={filteredCampaigns} />
          </div>
        </div>
      </div>

      <CampaignModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCampaign(null);
        }}
        campaign={editingCampaign}
        onSave={handleSaveCampaign}
      />

      <CampaignDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCampaign(null);
        }}
        campaign={selectedCampaign}
        onEdit={handleEditCampaign}
        onExport={handleExportCampaign}
      />

      <CampaignExportModal
        isOpen={isExportModalOpen}
        onClose={() => {
          setIsExportModalOpen(false);
          setSelectedCampaign(null);
        }}
        campaign={selectedCampaign}
      />
    </DashboardLayout>
  );
}
