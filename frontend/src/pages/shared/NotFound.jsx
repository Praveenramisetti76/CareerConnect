import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 px-4">
      <h1 className="text-7xl font-extrabold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h2>
      <p className="text-slate-600 mb-6 text-center max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Button onClick={() => navigate("/auth/login")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium">
        Go to Login
      </Button>
    </div>
  );
};

export default NotFound; 