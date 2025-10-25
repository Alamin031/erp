"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CRMPreferences {
  enableEmailNotifications: boolean;
  autoAssignLeads: boolean;
  showInactiveLeads: boolean;
  defaultCurrency: string;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: string[];
  createdDate: string;
}

export interface CustomField {
  id: string;
  name: string;
  type: "text" | "date" | "dropdown" | "checkbox";
  appliesToEntity: "lead" | "contact" | "deal";
  options?: string[];
}

interface CRMSettingsState {
  preferences: CRMPreferences;
  pipelines: Pipeline[];
  customFields: CustomField[];
  isSaving: boolean;

  updatePreference: (data: Partial<CRMPreferences>) => Promise<void>;
  addPipeline: (pipeline: Omit<Pipeline, "id" | "createdDate">) => Promise<void>;
  updatePipeline: (id: string, pipeline: Omit<Pipeline, "id" | "createdDate">) => Promise<void>;
  deletePipeline: (id: string) => Promise<void>;
  addCustomField: (field: Omit<CustomField, "id">) => Promise<void>;
  updateCustomField: (id: string, field: Omit<CustomField, "id">) => Promise<void>;
  deleteCustomField: (id: string) => Promise<void>;
}

const defaultPreferences: CRMPreferences = {
  enableEmailNotifications: true,
  autoAssignLeads: false,
  showInactiveLeads: false,
  defaultCurrency: "USD",
};

const defaultPipelines: Pipeline[] = [
  {
    id: "1",
    name: "Sales Pipeline",
    stages: ["Lead", "Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"],
    createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    name: "Support Pipeline",
    stages: ["New", "In Progress", "Waiting for Customer", "Resolved", "Closed"],
    createdDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const defaultCustomFields: CustomField[] = [
  {
    id: "1",
    name: "Industry",
    type: "dropdown",
    appliesToEntity: "lead",
    options: ["Technology", "Healthcare", "Finance", "Retail", "Manufacturing"],
  },
  {
    id: "2",
    name: "Lead Source",
    type: "dropdown",
    appliesToEntity: "lead",
    options: ["Website", "Referral", "Social Media", "Advertisement", "Direct Contact"],
  },
  {
    id: "3",
    name: "Budget Approved",
    type: "checkbox",
    appliesToEntity: "deal",
  },
];

export const useCRMSettings = create<CRMSettingsState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      pipelines: defaultPipelines,
      customFields: defaultCustomFields,
      isSaving: false,

      updatePreference: async (data: Partial<CRMPreferences>) => {
        set({ isSaving: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          set((state) => ({
            preferences: { ...state.preferences, ...data },
            isSaving: false,
          }));
        } catch (error) {
          set({ isSaving: false });
          throw error;
        }
      },

      addPipeline: async (pipeline: Omit<Pipeline, "id" | "createdDate">) => {
        set({ isSaving: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const newPipeline: Pipeline = {
            ...pipeline,
            id: Date.now().toString(),
            createdDate: new Date().toISOString(),
          };
          set((state) => ({
            pipelines: [...state.pipelines, newPipeline],
            isSaving: false,
          }));
        } catch (error) {
          set({ isSaving: false });
          throw error;
        }
      },

      updatePipeline: async (id: string, pipeline: Omit<Pipeline, "id" | "createdDate">) => {
        set({ isSaving: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          set((state) => ({
            pipelines: state.pipelines.map((p) =>
              p.id === id ? { ...p, ...pipeline } : p
            ),
            isSaving: false,
          }));
        } catch (error) {
          set({ isSaving: false });
          throw error;
        }
      },

      deletePipeline: async (id: string) => {
        set({ isSaving: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          set((state) => ({
            pipelines: state.pipelines.filter((p) => p.id !== id),
            isSaving: false,
          }));
        } catch (error) {
          set({ isSaving: false });
          throw error;
        }
      },

      addCustomField: async (field: Omit<CustomField, "id">) => {
        set({ isSaving: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const newField: CustomField = {
            ...field,
            id: Date.now().toString(),
          };
          set((state) => ({
            customFields: [...state.customFields, newField],
            isSaving: false,
          }));
        } catch (error) {
          set({ isSaving: false });
          throw error;
        }
      },

      updateCustomField: async (id: string, field: Omit<CustomField, "id">) => {
        set({ isSaving: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          set((state) => ({
            customFields: state.customFields.map((f) =>
              f.id === id ? { ...f, ...field } : f
            ),
            isSaving: false,
          }));
        } catch (error) {
          set({ isSaving: false });
          throw error;
        }
      },

      deleteCustomField: async (id: string) => {
        set({ isSaving: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          set((state) => ({
            customFields: state.customFields.filter((f) => f.id !== id),
            isSaving: false,
          }));
        } catch (error) {
          set({ isSaving: false });
          throw error;
        }
      },
    }),
    {
      name: "crm-settings-store",
    }
  )
);
