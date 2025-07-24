import Sidebar from "@/components/Sidebar";
import { useJoinRequestStatusChecker } from "@/hooks/useJoinRequestStatusChecker";

const SidebarOnlyLayout = ({ children }) => {
  // Check for join request status updates
  useJoinRequestStatusChecker();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default SidebarOnlyLayout;
