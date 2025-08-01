import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/axios";
import { useCompanyStore } from "./companyStore";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isInitialized: false,
      resumeUrl: null,
      autoSendStatusEmail: false,
      setAutoSendStatusEmail: (value) => set({ autoSendStatusEmail: value }),

      setToken: (token) => {
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          delete api.defaults.headers.common["Authorization"];
        }
        set({ token });
      },

      setUser: (user) => {
        set({
          user,
          resumeUrl: user?.resumeUrl || null,
        });
      },

      setResumeUrl: (resumeUrl) => set({ resumeUrl }),

      setInitialized: (isInitialized) => set({ isInitialized }),

      initializeAuth: async () => {
        const { token } = get();
        console.log("🔑 InitializeAuth started:", { hasToken: !!token });

        if (!token) {
          console.log(
            "🔑 InitializeAuth: No token found, setting initialized to true"
          );
          set({ isInitialized: true });
          return;
        }

        try {
          // Set the token in axios headers
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Fetch user profile
          console.log("🔑 InitializeAuth: Fetching user profile...");
          const response = await api.get("/auth/me");
          const userData = response.data;
          console.log("🔑 InitializeAuth: User profile fetched:", userData);

          set({ user: userData, isInitialized: true });

          // Update company store if user has company data
          if (userData.company && userData.companyRole) {
            console.log("🔑 InitializeAuth: Setting company data:", {
              company: userData.company,
              companyRole: userData.companyRole,
            });
            // userData.company is already the ID, not an object
            useCompanyStore
              .getState()
              .setCompanyData(userData.company, userData.companyRole);
          } else {
            // Clear company store if user has no company association
            console.log("🔑 InitializeAuth: Clearing company store");
            useCompanyStore.getState().resetCompany();
          }
        } catch (error) {
          console.error("🔑 InitializeAuth failed:", error);
          // Clear invalid token
          localStorage.removeItem("token");
          set({ token: null, user: null, isInitialized: true });
          delete api.defaults.headers.common["Authorization"];
        }
      },

      signup: async (name, email, password, role) => {
        try {
          const res = await api.post("/auth/register", {
            name,
            email,
            password,
            role,
          });
          if (res.data.twoFactorRequired) {
            // Do not set token or fetch profile yet
            return res.data;
          }
          const { token } = res.data;
          get().setToken(token);
          const profile = await api.get("/auth/me");
          const userData = profile.data;
          set({ user: userData, isInitialized: true });
          // Update company store if user has company data
          if (userData.company && userData.companyRole) {
            useCompanyStore
              .getState()
              .setCompanyData(userData.company, userData.companyRole);
          } else {
            useCompanyStore.getState().resetCompany();
          }
          return { success: true };
        } catch (error) {
          console.error("Signup failed:", error);
          throw error;
        }
      },

      login: async (email, password, otp) => {
        console.log("🔑 Login started for:", email);
        try {
          const payload = otp ? { email, password, otp } : { email, password };
          console.log("🔑 Login payload:", payload);
          const res = await api.post("/auth/login", payload);
          if (res.data.twoFactorRequired) {
            // Do not set token or fetch profile yet
            return { twoFactorRequired: true, email, password };
          }
          const { token } = res.data;
          get().setToken(token);
          const profile = await api.get("/auth/me");
          const userData = profile.data;
          set({
            user: userData,
            isInitialized: true,
            resumeUrl: userData.resumeUrl || null,
          });
          // Save resumeUrl to localStorage
          if (userData.resumeUrl) {
            localStorage.setItem("resumeUrl", userData.resumeUrl);
          } else {
            localStorage.removeItem("resumeUrl");
          }
          // Update company store if user has company data
          if (userData.company && userData.companyRole) {
            useCompanyStore
              .getState()
              .setCompanyData(userData.company, userData.companyRole);
          } else {
            useCompanyStore.getState().resetCompany();
          }
          console.log("🔑 Login successful:", { user: userData });
          return { success: true, user: userData };
        } catch (error) {
          console.error("🔑 Login failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("resumeUrl");
          set({ token: null, user: null, resumeUrl: null });
          delete api.defaults.headers.common["Authorization"];
          throw error;
        }
      },

      logout: () => {
        console.log("🔑 Logout: Starting logout process");

        // Clear all localStorage
        localStorage.clear();
        console.log("🔑 Logout: All localStorage cleared");

        // Clear Authorization header from axios
        delete api.defaults.headers.common["Authorization"];
        console.log("🔑 Logout: Authorization header cleared from axios");

        // Clear Zustand store state and reset initialization flag
        set({
          token: null,
          user: null,
          isInitialized: false,
          resumeUrl: null,
          autoSendStatusEmail: false,
        });
        console.log(
          "🔑 Logout: Zustand store cleared and isInitialized set to false"
        );

        // Also clear company store data
        useCompanyStore.getState().resetCompany();
        console.log("🔑 Logout: Company store cleared");

        console.log("🔑 Logout: Process completed");
      },

      fetchProfile: async () => {
        try {
          const res = await api.get("/auth/me");
          const userData = res.data;
          set({ user: userData });

          // Update company store if user has company data
          if (userData.company && userData.companyRole) {
            // userData.company is already the ID, not an object
            useCompanyStore
              .getState()
              .setCompanyData(userData.company, userData.companyRole);
          } else {
            // Clear company store if user has no company association
            useCompanyStore.getState().resetCompany();
          }

          return userData;
        } catch (error) {
          console.error("Fetch profile failed:", error);
          throw error;
        }
      },

      refreshUserData: async () => {
        try {
          console.log("🔄 Refreshing user data...");
          const response = await api.get("/auth/me");
          const userData = response.data;
          set({ user: userData });

          console.log("🔄 User data refreshed:", {
            hasCompany: !!userData.company,
            companyRole: userData.companyRole,
            companyId: userData.company,
          });

          // Update company store if user has company data
          if (userData.company && userData.companyRole) {
            console.log(
              "🏢 Setting company data in store:",
              userData.company,
              userData.companyRole
            );
            // userData.company is already the ID, not an object
            useCompanyStore
              .getState()
              .setCompanyData(userData.company, userData.companyRole);
          } else {
            console.log("🏢 Resetting company store");
            useCompanyStore.getState().resetCompany();
          }

          return userData;
        } catch (error) {
          console.error("Failed to refresh user data:", error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        resumeUrl: state.resumeUrl, // Persist resumeUrl
        autoSendStatusEmail: state.autoSendStatusEmail,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${state.token}`;
        }
      },
    }
  )
);

export default useAuthStore;
