import api from "@/lib/axios";

export const getCandidateDashboardStats = async () => {
  const response = await api.get("/candidate-dashboard/stats");
  return response.data.data;
};

export const getRecentApplications = async () => {
  const response = await api.get("/candidate-dashboard/recent-applications");
  return response.data.data;
};

export const getRecommendedJobs = async () => {
  const response = await api.get("/candidate-dashboard/recommended-jobs");
  return response.data.data;
};

export const getCandidateMetrics = async () => {
  const response = await api.get("/candidate-dashboard/metrics");
  return response.data.data;
};
