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
          const { token } = res.data;

          get().setToken(token);

          const profile = await api.get("/auth/me");
          const userData = profile.data;
          set({ user: userData, isInitialized: true });

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

          return { success: true };
        } catch (error) {
          console.error("Signup failed:", error);
          throw error;
        }
      },

      login: async (email, password) => {
        console.log("🔑 Login started for:", email);
        try {
          const res = await api.post("/auth/login", { email, password });
          const { token } = res.data;
          console.log("🔑 Login: Token received from server");

          get().setToken(token);

          const profile = await api.get("/auth/me");
          const userData = profile.data;
          console.log("🔑 Login: User profile fetched:", userData);

          set({ user: userData, isInitialized: true });

          // Update company store if user has company data
          if (userData.company && userData.companyRole) {
            console.log("🔑 Login: Setting company data:", {
              company: userData.company,
              companyRole: userData.companyRole,
            });
            // userData.company is already the ID, not an object
            useCompanyStore
              .getState()
              .setCompanyData(userData.company, userData.companyRole);
          } else {
            // Clear company store if user has no company association
            console.log("🔑 Login: Clearing company store");
            useCompanyStore.getState().resetCompany();
          }

          console.log("🔑 Login successful:", { user: userData });
          return { success: true, user: userData };
        } catch (error) {
          console.error("🔑 Login failed:", error);
          // Clean up on error
          localStorage.removeItem("token");
          set({ token: null, user: null });
          delete api.defaults.headers.common["Authorization"];
          throw error;
        }
      },

      logout: () => {
        console.log("🔑 Logout: Starting logout process");

        // Clear token from localStorage
        localStorage.removeItem("token");
        console.log("🔑 Logout: Token removed from localStorage");

        // Clear Authorization header from axios
        delete api.defaults.headers.common["Authorization"];
        console.log("🔑 Logout: Authorization header cleared from axios");

        // Clear Zustand store state and reset initialization flag
        set({ token: null, user: null, isInitialized: false });
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
