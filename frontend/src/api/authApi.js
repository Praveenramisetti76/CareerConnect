import api from "@/lib/axios";

// Verify signup 2FA
export const verifySignup2FA = async (email, otp) => {
  try {
    const response = await api.post("/auth/verify-signup-2fa", { email, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
