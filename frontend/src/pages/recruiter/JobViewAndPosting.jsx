import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Edit2 } from "lucide-react";
import { getAllJobs, getMyJobPosts } from "@/api/jobApi";
import useAuthStore from "@/store/userStore";
import { useCompanyStore } from "@/store/companyStore";
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

const JobViewAndPosting = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { companyRole } = useCompanyStore();
  const [jobView, setJobView] = useState("all"); // "all" or "my-posts"

  // Industry search state
  const [industrySearch, setIndustrySearch] = useState("");

  // Fetch all jobs or user's job posts based on view
  const {
    data: jobsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jobs", jobView],
    queryFn: jobView === "all" ? getAllJobs : getMyJobPosts,
    refetchOnWindowFocus: false,
  });

  const jobs = jobsResponse?.data?.jobs || [];

  // Filtered jobs by industry search
  const filteredJobs = industrySearch
    ? jobs.filter(
        (job) =>
          job.industry &&
          job.industry.toLowerCase().includes(industrySearch.toLowerCase())
      )
    : jobs;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30)
      return `${Math.ceil(diffDays / 7)} week${
        Math.ceil(diffDays / 7) > 1 ? "s" : ""
      } ago`;
    return `${Math.ceil(diffDays / 30)} month${
      Math.ceil(diffDays / 30) > 1 ? "s" : ""
    } ago`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Jobs
          </h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50">
      {/* Industry Search Filter */}
      <div className="px-6 pt-6 max-w-[960px] mx-auto">
        <input
          type="text"
          value={industrySearch}
          onChange={(e) => setIndustrySearch(e.target.value)}
          placeholder="Search by industry..."
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 mb-4"
        />
      </div>

      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          {/* Main Content */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <h1 className="text-[#0d151c] tracking-light text-[32px] font-bold leading-tight min-w-72">
                Jobs Dashboard
              </h1>
              {user?.role === "recruiter" &&
                (companyRole === "admin" || companyRole === "recruiter") && (
                  <Button
                    onClick={() => navigate("/recruiter/post-job")}
                    className="bg-[#1284e7] hover:bg-[#0f6bb8] text-white h-10 px-4"
                  >
                    Post New Job
                  </Button>
                )}
            </div>

            {/* View Toggle Buttons */}
            <div className="flex gap-2 px-4 pb-4">
              <Button
                variant={jobView === "all" ? "default" : "outline"}
                onClick={() => setJobView("all")}
                className="min-w-[120px]"
              >
                All Jobs
              </Button>
              {user?.role === "recruiter" && (
                <Button
                  variant={jobView === "my-posts" ? "default" : "outline"}
                  onClick={() => setJobView("my-posts")}
                  className="min-w-[120px]"
                >
                  My Job Posts
                </Button>
              )}
            </div>

            <h2 className="text-[#0d151c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              {jobView === "all" ? "Available Jobs" : "My Job Postings"}
            </h2>

            {/* Jobs Table */}
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-xl border border-[#cedce8] bg-slate-50">
                <Table className="flex-1">
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="px-4 py-3 text-left text-[#0d151c] w-[400px] text-sm font-medium leading-normal">
                        Job Title
                      </TableHead>
                      <TableHead className="px-4 py-3 text-left text-[#0d151c] w-60 text-sm font-medium leading-normal">
                        Company
                      </TableHead>
                      <TableHead className="px-4 py-3 text-left text-[#0d151c] w-60 text-sm font-medium leading-normal">
                        Status
                      </TableHead>
                      <TableHead className="px-4 py-3 text-left text-[#0d151c] w-[200px] text-sm font-medium leading-normal">
                        Type
                      </TableHead>
                      <TableHead className="px-4 py-3 text-left text-[#0d151c] w-[200px] text-sm font-medium leading-normal">
                        Posted
                      </TableHead>
                      {jobView === "my-posts" && (
                        <>
                          <TableHead className="px-4 py-3 text-left text-[#0d151c] w-[200px] text-sm font-medium leading-normal">
                            Applications
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left text-[#0d151c] w-[120px] text-sm font-medium leading-normal">
                            Actions
                          </TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={jobView === "my-posts" ? 7 : 5}
                          className="text-center py-8"
                        >
                          <p className="text-gray-500">No jobs found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredJobs.map((job) => (
                        <TableRow
                          key={job._id}
                          className="border-t border-t-[#cedce8] hover:bg-gray-50"
                        >
                          <TableCell
                            className="h-[72px] px-4 py-2 w-[400px] text-[#0d151c] text-sm font-normal leading-normal cursor-pointer"
                            onClick={() => {
                              if (jobView === "my-posts") {
                                navigate(`/recruiter/edit-job/${job._id}`);
                              } else {
                                navigate(`/job/${job._id}`);
                              }
                            }}
                          >
                            <div>
                              <p className="font-medium">{job.title}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {job.salaryRange &&
                                  (job.salaryRange.min ||
                                    job.salaryRange.max) &&
                                  `$${
                                    job.salaryRange.min?.toLocaleString() ||
                                    "N/A"
                                  } - $${
                                    job.salaryRange.max?.toLocaleString() ||
                                    "N/A"
                                  }`}
                                {job.location && ` • ${job.location}`}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="h-[72px] px-4 py-2 w-60 text-[#0d151c] text-sm font-normal leading-normal">
                            {job.companyName ||
                              job.company?.name ||
                              "Unknown Company"}
                          </TableCell>
                          <TableCell className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                            <Badge
                              className={`${getStatusColor(
                                job.status
                              )} border-0`}
                            >
                              {job.status || "Active"}
                            </Badge>
                          </TableCell>
                          <TableCell className="h-[72px] px-4 py-2 w-[200px] text-[#49749c] text-sm font-normal leading-normal">
                            {job.type || "Full-time"}
                          </TableCell>
                          <TableCell className="h-[72px] px-4 py-2 w-[200px] text-[#49749c] text-sm font-normal leading-normal">
                            {formatDate(job.createdAt)}
                          </TableCell>
                          {jobView === "my-posts" && (
                            <>
                              <TableCell className="h-[72px] px-4 py-2 w-[200px] text-[#49749c] text-sm font-normal leading-normal">
                                {job.applicationsCount || 0}
                              </TableCell>
                              <TableCell className="h-[72px] px-4 py-2 w-[120px] text-sm font-normal leading-normal">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/recruiter/edit-job/${job._id}`);
                                  }}
                                  className="flex items-center space-x-1"
                                >
                                  <Edit2 className="h-3 w-3" />
                                  <span>Edit</span>
                                </Button>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Post Job Button - Only show for recruiters */}
            {user?.role === "recruiter" &&
              (companyRole === "admin" || companyRole === "recruiter") && (
                <div className="flex px-4 py-3 justify-end">
                  <Button
                    onClick={() => navigate("/recruiter/post-job")}
                    className="bg-[#0b80ee] hover:bg-[#0969da] text-white"
                  >
                    Post a Job
                  </Button>
                </div>
              )}

            {/* Quick Stats - Only show for my posts */}
            {jobView === "my-posts" && jobs.length > 0 && (
              <>
                <h2 className="text-[#0d151c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                  Quick Overview
                </h2>
                <div className="flex flex-wrap gap-4 px-4 py-6">
                  <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#cedce8] p-6">
                    <p className="text-[#0d151c] text-base font-medium leading-normal">
                      Total Jobs Posted
                    </p>
                    <p className="text-[#0d151c] tracking-light text-[32px] font-bold leading-tight truncate">
                      {jobs.length}
                    </p>
                    <p className="text-[#49749c] text-base font-normal leading-normal">
                      All time
                    </p>
                  </div>

                  <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#cedce8] p-6">
                    <p className="text-[#0d151c] text-base font-medium leading-normal">
                      Active Jobs
                    </p>
                    <p className="text-[#0d151c] tracking-light text-[32px] font-bold leading-tight truncate">
                      {
                        jobs.filter(
                          (job) =>
                            job.status?.toLowerCase() === "active" ||
                            !job.status
                        ).length
                      }
                    </p>
                    <p className="text-[#49749c] text-base font-normal leading-normal">
                      Currently open
                    </p>
                  </div>

                  <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#cedce8] p-6">
                    <p className="text-[#0d151c] text-base font-medium leading-normal">
                      Total Applications
                    </p>
                    <p className="text-[#0d151c] tracking-light text-[32px] font-bold leading-tight truncate">
                      {jobs.reduce(
                        (total, job) => total + (job.applicationsCount || 0),
                        0
                      )}
                    </p>
                    <p className="text-[#49749c] text-base font-normal leading-normal">
                      Across all jobs
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobViewAndPosting;
