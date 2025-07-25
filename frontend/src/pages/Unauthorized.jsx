import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Unauthorized = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds <= 0) {
      navigate("/auth/login", { replace: true });
      return;
    }
    const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h2>
        <p className="text-gray-600 mb-2">You don't have permission to access this page.</p>
        <p className="text-gray-500 text-sm mb-4">Redirecting to login in {seconds} second{seconds !== 1 ? "s" : ""}...</p>
        <Button onClick={() => navigate("/auth/login", { replace: true })} className="mt-2">
          Go to Login Page
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized; 