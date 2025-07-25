import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/userStore";
import { useCompanyStore } from "@/store/companyStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Bell, Settings as SettingsIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMyJoinRequestStatus } from "@/api/companyApi";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { companyRole } = useCompanyStore();

  const {
    data: joinRequests = [],
    isLoading: loadingRequests,
  } = useQuery({
    queryKey: ["myCompanyJoinRequests"],
    queryFn: getMyJoinRequestStatus,
    enabled: !!user,
  });

  const isAuthPage = location.pathname.startsWith("/auth/");
  const publicPages = ["/", "/about", "/contact", "/features"];
  const isPublicPage = publicPages.includes(location.pathname);

  const shouldShowNavbar = () => {
    if (isAuthPage || isPublicPage) return true;
    if (!user) return false;
    if (user.role === "candidate") return true;
    if (user.role === "recruiter" && companyRole === "employee") return true;
    return false;
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const getNavigationItems = () => {
    if (isAuthPage || (isPublicPage && !user)) {
      return [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Features", href: "/features" },
        { label: "Contact", href: "/contact" },
      ];
    }

    if (user?.role === "candidate") {
      return [
        { label: "Home", href: "/candidate/home" },
        { label: "Jobs", href: "/candidate/jobs" },
        { label: "Companies", href: "/candidate/companies" },
        { label: "Career Advice", href: "/candidate/articles" },
        { label: "Applications", href: "/candidate/applications" },
      ];
    }

    if (user?.role === "recruiter" && companyRole === "employee") {
      return [
        { label: "Dashboard", href: "/recruiter/dashboard" },
        { label: "Jobs", href: "/jobs" },
        { label: "Companies", href: "/recruiter/companies" },
        { label: "Articles", href: "/recruiter/articles" },
        { label: "Profile", href: "/recruiter/profile" },
      ];
    }

    return [];
  };

  if (!shouldShowNavbar()) return null;

  const navigationItems = getNavigationItems();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-slate-900 text-xl font-bold tracking-tight hover:text-slate-700 transition-colors duration-200"
            >
              CareerConnect
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.href
                      ? "bg-slate-100 text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  to={item.href}
                >
                  {item.label}
                </Link>
              ))}

              {/* ✅ Show Login/Sign Up on public pages AND auth pages when NOT logged in */}
              {!user && (isPublicPage || isAuthPage) && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/auth/login")}
                    className={`h-9 px-3 sm:px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                      location.pathname === "/auth/login"
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate("/auth/signup")}
                    className={`h-9 px-3 sm:px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 ${
                      location.pathname === "/auth/signup" ? "opacity-80" : ""
                    }`}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </nav>

            {/* Mobile Menu */}
            <nav className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 hover:bg-slate-100"
                  >
                    <svg
                      className="h-6 w-6 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white/95 backdrop-blur-md border-slate-200/60 shadow-xl rounded-xl p-2"
                >
                  {navigationItems.map((item, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => navigate(item.href)}
                      className={`flex items-center px-3 py-3 rounded-lg transition-colors duration-200 cursor-pointer ${
                        location.pathname === item.href
                          ? "bg-slate-100 text-slate-900"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                    </DropdownMenuItem>
                  ))}
                  {!user && (isPublicPage || isAuthPage) && (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/auth/login")}>
                        Login
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/auth/signup")}>
                        Sign Up
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* ✅ User Profile Dropdown */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white cursor-pointer">
                    {user.firstName?.[0] || user.name?.[0] || "U"}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2">
                  <DropdownMenuItem
                    onClick={() =>
                      navigate(user.role === "candidate" ? "/candidate/profile" : "/recruiter/profile")
                    }
                  >
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  {user.role === "candidate" && (
                    <DropdownMenuItem onClick={() => navigate("/candidate/settings")}>
                      <SettingsIcon className="w-4 h-4 mr-2" /> Settings
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
