import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getMyApplications, deleteApplication } from "@/api/jobApi";
import useAuthStore from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Eye } from "lucide-react";

const MyApplicationsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const { user } = useAuthStore();

  // Fetch applications
  const {
    data: applicationsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myApplications"],
    queryFn: () => getMyApplications(),
    onError: (err) => {
      console.error("Error fetching applications:", err);
    },
    onSuccess: (data) => {
      console.log("Applications fetched successfully:", data);
    },
  });

  // Ensure applications is always an array
  const applications = Array.isArray(applicationsResponse?.data?.data)
    ? applicationsResponse.data.data
    : [];

  // Debug logging to see what we're getting from the API
  console.log("Applications API Response:", {
    applicationsResponse,
    applications,
    isArray: Array.isArray(applications),
    length: applications.length,
    error,
  });

  // Delete application mutation
  const deleteApplicationMutation = useMutation({
    mutationFn: ({ jobId, applicationId }) =>
      deleteApplication(jobId, applicationId),
    onSuccess: () => {
      toast.success("Application deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete application"
      );
    },
  });

  // Filter applications based on active tab
  const filteredApplications = applications.filter((application) => {
    if (activeTab === "all") return true;
    return application.status === activeTab;
  });

  // Safe counts for tabs to avoid filter errors
  const appliedCount = applications.filter(
    (app) => app.status === "applied"
  ).length;
  const interviewCount = applications.filter(
    (app) => app.status === "interview"
  ).length;
  const rejectedCount = applications.filter(
    (app) => app.status === "rejected"
  ).length;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "applied":
        return "secondary";
      case "reviewed":
        return "outline";
      case "interview":
        return "default";
      case "hired":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Get status button styling
  const getStatusButtonStyle = (status) => {
    switch (status) {
      case "applied":
        return "bg-[#e7edf4] text-[#0d151c]";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "interview":
        return "bg-yellow-100 text-yellow-800";
      case "hired":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-[#e7edf4] text-[#0d151c]";
    }
  };

  // Handle delete application
  const handleDeleteApplication = (jobId, applicationId) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      deleteApplicationMutation.mutate({ jobId, applicationId });
    }
  };

  // Handle view job
  const handleViewJob = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Applications
          </h2>
          <p className="text-gray-600 mb-4">
            {error.response?.data?.message || "Failed to load applications"}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{ fontFamily: "Work Sans, Noto Sans, sans-serif" }}
    >
      <div className="flex justify-center py-5">
        <div className="flex max-w-[1320px] w-full gap-6 px-6">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-slate-50 p-4">
              <div className="flex flex-col gap-4">
                {/* User Profile */}
                <div className="flex gap-3">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                    style={{
                      backgroundImage: `url("${
                        user?.profilePicture ||
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuD8Y1j4sCDDJc34jLKt4rAG50IgaoNvDxWK2xme_zIGnauy8KpwXW7C9jpdZB-evYqoVM3NWLTWLM7vQGMkEYHmsF08Va-kQQ7kYj1093C01NaQNVwqQFq_tCDRtEIg7Rp54__Bd2hVOQTa6LcG1VSm86spbxtEdOXIqKLfLlsLoKu3sNgCYXZAuwbwdHqe79NWWCzBdccQiEpi5mpt4waKzO7FXLJAEgpIFpg8k-ICDF01eFKFaiYjGidW0aiTDRKdCI0WL2nP5dw"
                      }")`,
                    }}
                  />
                  <h1 className="text-[#0d151c] text-base font-medium leading-normal">
                    {user?.name || "User"}
                  </h1>
                </div>

                {/* Navigation Menu */}
                <div className="flex flex-col gap-2">
                  <div
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#e7edf4] rounded-full"
                    onClick={() => navigate("/candidate/dashboard")}
                  >
                    <div className="text-[#0d151c]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z" />
                      </svg>
                    </div>
                    <p className="text-[#0d151c] text-sm font-medium leading-normal">
                      Home
                    </p>
                  </div>

                  {/* Active - My Applications */}
                  <div className="flex items-center gap-3 px-3 py-2 rounded-full bg-[#e7edf4]">
                    <div className="text-[#0d151c]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM152,88V44l44,44Z" />
                      </svg>
                    </div>
                    <p className="text-[#0d151c] text-sm font-medium leading-normal">
                      My Applications
                    </p>
                  </div>

                  <div
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#e7edf4] rounded-full"
                    onClick={() => navigate("/candidate/saved-jobs")}
                  >
                    <div className="text-[#0d151c]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,16V161.57l-51.77-32.35a8,8,0,0,0-8.48,0L72,161.56V48ZM132.23,177.22a8,8,0,0,0-8.48,0L72,209.57V180.43l56-35,56,35v29.14Z" />
                      </svg>
                    </div>
                    <p className="text-[#0d151c] text-sm font-medium leading-normal">
                      Saved Jobs
                    </p>
                  </div>

                  <div
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#e7edf4] rounded-full"
                    onClick={() => navigate("/profile")}
                  >
                    <div className="text-[#0d151c]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
                      </svg>
                    </div>
                    <p className="text-[#0d151c] text-sm font-medium leading-normal">
                      Profile
                    </p>
                  </div>

                  <div
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#e7edf4] rounded-full"
                    onClick={() => navigate("/settings")}
                  >
                    <div className="text-[#0d151c]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z" />
                      </svg>
                    </div>
                    <p className="text-[#0d151c] text-sm font-medium leading-normal">
                      Settings
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-[960px]">
            {/* Header */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#0d151c] tracking-light text-[32px] font-bold leading-tight min-w-72">
                My Applications
              </p>
            </div>

            {/* Tabs */}
            <div className="pb-3">
              <div className="flex border-b border-[#cedce8] px-4 gap-8">
                <button
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === "all"
                      ? "border-b-[#0b80ee] text-[#0d151c]"
                      : "border-b-transparent text-[#49749c]"
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                    All ({applications.length})
                  </p>
                </button>
                <button
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === "applied"
                      ? "border-b-[#0b80ee] text-[#0d151c]"
                      : "border-b-transparent text-[#49749c]"
                  }`}
                  onClick={() => setActiveTab("applied")}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                    Applied ({appliedCount})
                  </p>
                </button>
                <button
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === "interview"
                      ? "border-b-[#0b80ee] text-[#0d151c]"
                      : "border-b-transparent text-[#49749c]"
                  }`}
                  onClick={() => setActiveTab("interview")}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                    Interviewing ({interviewCount})
                  </p>
                </button>
                <button
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === "rejected"
                      ? "border-b-[#0b80ee] text-[#0d151c]"
                      : "border-b-transparent text-[#49749c]"
                  }`}
                  onClick={() => setActiveTab("rejected")}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                    Rejected ({rejectedCount})
                  </p>
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-xl border border-[#cedce8] bg-slate-50">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-3 text-left text-[#0d151c] w-[400px] text-sm font-medium leading-normal">
                        Job Title
                      </th>
                      <th className="px-4 py-3 text-left text-[#0d151c] w-[400px] text-sm font-medium leading-normal">
                        Company
                      </th>
                      <th className="px-4 py-3 text-left text-[#0d151c] w-[400px] text-sm font-medium leading-normal">
                        Date Applied
                      </th>
                      <th className="px-4 py-3 text-left text-[#0d151c] w-60 text-sm font-medium leading-normal">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-[#0d151c] w-20 text-sm font-medium leading-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="h-[200px] px-4 py-2 text-center text-[#49749c]"
                        >
                          {activeTab === "all"
                            ? "No applications found. Start applying to jobs!"
                            : `No ${activeTab} applications found.`}
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((application) => (
                        <tr
                          key={application._id}
                          className="border-t border-t-[#cedce8]"
                        >
                          <td className="h-[72px] px-4 py-2 w-[400px] text-[#0d151c] text-sm font-normal leading-normal">
                            {application.job?.title ||
                              "Job Title Not Available"}
                          </td>
                          <td className="h-[72px] px-4 py-2 w-[400px] text-[#49749c] text-sm font-normal leading-normal">
                            {application.job?.company?.name ||
                              application.job?.companyName ||
                              "Company Not Available"}
                          </td>
                          <td className="h-[72px] px-4 py-2 w-[400px] text-[#49749c] text-sm font-normal leading-normal">
                            {formatDate(application.createdAt)}
                          </td>
                          <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                            <button
                              className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 text-sm font-medium leading-normal w-full ${getStatusButtonStyle(
                                application.status
                              )}`}
                            >
                              <span className="truncate capitalize">
                                {application.status}
                              </span>
                            </button>
                          </td>
                          <td className="h-[72px] px-4 py-2 w-20">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleViewJob(application.job?._id)
                                  }
                                  className="cursor-pointer"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Job
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteApplication(
                                      application.job?._id,
                                      application._id
                                    )
                                  }
                                  className="cursor-pointer text-red-600"
                                  disabled={deleteApplicationMutation.isPending}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Application
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyApplicationsPage;
