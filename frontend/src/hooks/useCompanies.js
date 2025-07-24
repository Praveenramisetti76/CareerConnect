import { useQuery } from "@tanstack/react-query";
import { getAllCompanies, getFilterOptions } from "@/api/companyApi";
import useCompanyFiltersStore from "@/store/companyFiltersStore";

export const useCompanies = () => {
  const { getQueryParams } = useCompanyFiltersStore();

  return useQuery({
    queryKey: ["companies", getQueryParams()],
    queryFn: () => getAllCompanies(getQueryParams()),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
  });
};

export const useFilterOptions = () => {
  return useQuery({
    queryKey: ["filter-options"],
    queryFn: getFilterOptions,
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  });
};
