import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCompanyFiltersStore = create(
  persist(
    (set, get) => ({
      // Filter state
      searchQuery: "",
      selectedIndustries: [],
      selectedLocations: [],
      selectedSizes: [],
      sortBy: "name_asc",
      hasJobs: false,
      currentPage: 1,

      // Available options (will be populated from API)
      availableIndustries: [],
      availableLocations: [],
      availableSizes: [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1000+",
      ],

      // Actions
      setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),

      setSelectedIndustries: (industries) =>
        set({ selectedIndustries: industries, currentPage: 1 }),

      setSelectedLocations: (locations) =>
        set({ selectedLocations: locations, currentPage: 1 }),

      setSelectedSizes: (sizes) =>
        set({ selectedSizes: sizes, currentPage: 1 }),

      setSortBy: (sort) => set({ sortBy: sort, currentPage: 1 }),

      setHasJobs: (hasJobs) => set({ hasJobs, currentPage: 1 }),

      setCurrentPage: (page) => set({ currentPage: page }),

      // Utility actions
      clearAllFilters: () =>
        set({
          searchQuery: "",
          selectedIndustries: [],
          selectedLocations: [],
          selectedSizes: [],
          hasJobs: false,
          currentPage: 1,
        }),

      toggleIndustry: (industry) => {
        const current = get().selectedIndustries;
        const updated = current.includes(industry)
          ? current.filter((i) => i !== industry)
          : [...current, industry];
        set({ selectedIndustries: updated, currentPage: 1 });
      },

      toggleLocation: (location) => {
        const current = get().selectedLocations;
        const updated = current.includes(location)
          ? current.filter((l) => l !== location)
          : [...current, location];
        set({ selectedLocations: updated, currentPage: 1 });
      },

      toggleSize: (size) => {
        const current = get().selectedSizes;
        const updated = current.includes(size)
          ? current.filter((s) => s !== size)
          : [...current, size];
        set({ selectedSizes: updated, currentPage: 1 });
      },

      // Get query params for API
      getQueryParams: () => {
        const state = get();
        const params = new URLSearchParams();

        if (state.searchQuery.trim()) {
          params.append("search", state.searchQuery.trim());
        }

        if (state.selectedIndustries.length > 0) {
          params.append("industry", state.selectedIndustries.join(","));
        }

        if (state.selectedLocations.length > 0) {
          params.append("location", state.selectedLocations.join(","));
        }

        if (state.selectedSizes.length > 0) {
          params.append("size", state.selectedSizes.join(","));
        }

        if (state.hasJobs) {
          params.append("hasJobs", "true");
        }

        params.append("sort", state.sortBy);
        params.append("page", state.currentPage.toString());
        params.append("limit", "12");

        return params.toString();
      },

      // Set available options
      setAvailableIndustries: (industries) =>
        set({ availableIndustries: industries }),
      setAvailableLocations: (locations) =>
        set({ availableLocations: locations }),
    }),
    {
      name: "company-filters-storage",
      partialize: (state) => ({
        selectedIndustries: state.selectedIndustries,
        selectedLocations: state.selectedLocations,
        selectedSizes: state.selectedSizes,
        sortBy: state.sortBy,
        hasJobs: state.hasJobs,
      }),
    }
  )
);

export default useCompanyFiltersStore;
