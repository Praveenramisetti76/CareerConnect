import { useEffect } from "react";
import useAuthStore from "../store/userStore";

export function useInitializeAuth() {
  const { initializeAuth, isInitialized } = useAuthStore();

  useEffect(() => {
    console.log(
      "🔄 useInitializeAuth: Effect triggered, isInitialized:",
      isInitialized
    );
    if (!isInitialized) {
      console.log("🔄 useInitializeAuth: Calling initializeAuth...");
      initializeAuth();
    } else {
      console.log("🔄 useInitializeAuth: Already initialized, skipping");
    }
  }, [initializeAuth, isInitialized]);

  console.log("🔄 useInitializeAuth: Returning loading:", !isInitialized);
  return { loading: !isInitialized };
}
