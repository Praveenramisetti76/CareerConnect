import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCompanyStore = create(
  persist(
    (set) => ({
      companyId: null,
      companyRole: null,
      resumeId: null,

      setCompanyId: (id) => set({ companyId: id }),
      setCompanyRole: (role) => set({ companyRole: role }),
      setResumeId: (id) => set({ resumeId: id }),

      setCompanyData: (companyId, companyRole) =>
        set({ companyId, companyRole }),

      resetCompany: () =>
        set({ companyId: null, companyRole: null, resumeId: null }),
    }),
    {
      name: "company-storage",
      partialize: (state) => ({
        companyId: state.companyId,
        companyRole: state.companyRole,
        resumeId: state.resumeId,
      }),
    }
  )
);
