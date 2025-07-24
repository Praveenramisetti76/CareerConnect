import Navbar from "@/components/Navbar";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default AuthLayout;
