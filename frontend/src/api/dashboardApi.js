import api from "@/lib/axios";

export const getDashboardStats = async () => {
  const response = await api.get("/dashboard/stats");
  return response.data.data;
};

export const getRecentActivities = async () => {
  const response = await api.get("/dashboard/activities");
  return response.data.data;
};

export const getTopJobs = async () => {
  const response = await api.get("/dashboard/top-jobs");
  return response.data.data;
};

export const getApplicationsOverview = async () => {
  const response = await api.get("/dashboard/applications-overview");
  return response.data.data;
};

export const getCompanyMetrics = async () => {
  const response = await api.get("/dashboard/company-metrics");
  return response.data.data;
};

export const submitContactForm = async (formData) => {
  const response = await api.post("/dashboard/contact", formData);
  return response.data;
};
