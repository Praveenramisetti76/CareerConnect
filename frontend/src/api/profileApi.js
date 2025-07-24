import axios from "@/lib/axios";

// Get user profile
export const getProfile = () => {
  return axios.get("/profile/view");
};

// Get specific user profile by ID (for recruiters viewing candidate profiles)
export const getUser = (userId) => {
  return axios.get(`/profile/user/${userId}`);
};

// Update user profile
export const updateProfile = (data) => {
  return axios.put("/profile/update", data);
};

// Upload profile avatar
export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  return axios.patch("/profile/update/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Upload resume
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  return axios.patch("/profile/update/resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete resume
export const deleteResume = () => {
  return axios.delete("/profile/delete/resume");
};

// Delete avatar
export const deleteAvatar = () => {
  return axios.delete("/profile/delete/avatar");
};

// Delete profile
export const deleteProfile = () => {
  return axios.delete("/profile/delete");
};
