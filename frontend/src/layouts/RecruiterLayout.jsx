import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useJoinRequestStatusChecker } from "@/hooks/useJoinRequestStatusChecker";

const RecruiterLayout = ({ children }) => {
  // Check for join request status updates
  useJoinRequestStatusChecker();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default RecruiterLayout;
