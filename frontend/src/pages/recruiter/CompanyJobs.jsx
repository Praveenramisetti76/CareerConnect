import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCompanyById } from "@/api/companyApi";
import { getJobsByCompany } from "@/api/jobApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Search } from "lucide-react";
import useAuthStore from "@/store/userStore";

const CompanyJobs = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("jobs");

  // Fetch company details
  const {
    data: companyResponse,
    isLoading: companyLoading,
    error: companyError,
  } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getCompanyById(companyId),
    enabled: !!companyId,
    refetchOnWindowFocus: false,
  });

  // Fetch company jobs
  const {
    data: jobsResponse,
    isLoading: jobsLoading,
    error: jobsError,
  } = useQuery({
    queryKey: ["companyJobs", companyId],
    queryFn: () => getJobsByCompany(companyId),
    enabled: !!companyId,
    refetchOnWindowFocus: false,
  });

  const company = companyResponse?.company || companyResponse?.data;
  const allJobs = jobsResponse?.data?.jobs || jobsResponse?.jobs || [];

  // Filter jobs based on user role and search/filters
  const filteredJobs = allJobs
    .filter((job) =>
      user?.role === "candidate" ? job.status === "active" : true
    )
    .filter((job) => {
      if (
        searchQuery &&
        !job.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      if (
        locationFilter !== "all" &&
        !job.location?.toLowerCase().includes(locationFilter.toLowerCase())
      )
        return false;
      if (typeFilter !== "all" && job.type !== typeFilter) return false;
      return true;
    });

  const handleJobClick = (jobId) => {
    if (user?.role === "candidate") {
      navigate(`/job/${jobId}`);
    } else if (user?.role === "recruiter") {
      navigate(`/recruiter/applications?job=${jobId}`);
    } else {
      navigate(`/job/${jobId}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 21) return "2 weeks ago";
    if (diffDays < 28) return "3 weeks ago";
    return "1 month ago";
  };

  const getUniqueValues = (jobs, field) => {
    return [...new Set(jobs.map((job) => job[field]).filter(Boolean))];
  };

  if (companyLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (companyError || !company) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Company
          </h2>
          <p className="text-gray-600 mb-4">
            {companyError?.response?.data?.message || "Company not found"}
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Company Header */}
        <div className="px-40 flex justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex p-4">
              <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between">
                <div className="flex gap-4">
                  <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg min-h-32 w-32 bg-gray-100 flex items-center justify-center">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <Building2 size={48} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                      {company.name}
                    </p>
                    <p className="text-[#5d7589] text-base font-normal leading-normal max-w-md">
                      {company.description ||
                        `${company.name} is a leading ${company.industry} company based in ${company.location}.`}
                    </p>
                    <p className="text-[#5d7589] text-base font-normal leading-normal">
                      {company.size} employees
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="pb-3">
              <div className="flex border-b border-[#d5dce2] px-4 gap-8">
                <button
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === "about"
                      ? "border-b-transparent text-[#5d7589]"
                      : "border-b-transparent text-[#5d7589]"
                  }`}
                  onClick={() => navigate(`/recruiter/company/${companyId}`)}
                >
                  <p className="text-[#5d7589] text-sm font-bold leading-normal tracking-[0.015em]">
                    About
                  </p>
                </button>
                <button
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === "jobs"
                      ? "border-b-[#4485ba] text-[#111518]"
                      : "border-b-transparent text-[#5d7589]"
                  }`}
                  onClick={() => setActiveTab("jobs")}
                >
                  <p className="text-[#111518] text-sm font-bold leading-normal tracking-[0.015em]">
                    Jobs
                  </p>
                </button>
                <button
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === "people"
                      ? "border-b-[#4485ba] text-[#111518]"
                      : "border-b-transparent text-[#5d7589]"
                  }`}
                  onClick={() => setActiveTab("people")}
                >
                  <p className="text-[#5d7589] text-sm font-bold leading-normal tracking-[0.015em]">
                    People
                  </p>
                </button>
              </div>
            </div>

            {/* Jobs Content */}
            <h2 className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Open Positions
            </h2>

            {/* Search Bar */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <Input
                  placeholder="Search open positions"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111518] focus:outline-0 focus:ring-0 border border-[#d5dce2] bg-gray-50 focus:border-[#d5dce2] h-14 placeholder:text-[#5d7589] p-[15px] text-base font-normal leading-normal"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </label>
            </div>

            {/* Filter Tags */}
            <div className="flex gap-3 p-3 flex-wrap pr-4">
              <button
                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-4 ${
                  locationFilter === "remote" ? "bg-blue-200" : "bg-[#eaedf1]"
                }`}
                onClick={() =>
                  setLocationFilter(
                    locationFilter === "remote" ? "all" : "remote"
                  )
                }
              >
                <p className="text-[#111518] text-sm font-medium leading-normal">
                  Remote
                </p>
              </button>
              <button
                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-4 ${
                  typeFilter === "full-time" ? "bg-blue-200" : "bg-[#eaedf1]"
                }`}
                onClick={() =>
                  setTypeFilter(
                    typeFilter === "full-time" ? "all" : "full-time"
                  )
                }
              >
                <p className="text-[#111518] text-sm font-medium leading-normal">
                  Full-time
                </p>
              </button>
              <button
                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-4 ${
                  typeFilter === "part-time" ? "bg-blue-200" : "bg-[#eaedf1]"
                }`}
                onClick={() =>
                  setTypeFilter(
                    typeFilter === "part-time" ? "all" : "part-time"
                  )
                }
              >
                <p className="text-[#111518] text-sm font-medium leading-normal">
                  Part-time
                </p>
              </button>
              <button
                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-4 ${
                  typeFilter === "internship" ? "bg-blue-200" : "bg-[#eaedf1]"
                }`}
                onClick={() =>
                  setTypeFilter(
                    typeFilter === "internship" ? "all" : "internship"
                  )
                }
              >
                <p className="text-[#111518] text-sm font-medium leading-normal">
                  Internship
                </p>
              </button>
            </div>

            {/* Jobs Table */}
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-lg border border-[#d5dce2] bg-gray-50">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                        Job Title
                      </th>
                      <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                        Salary
                      </th>
                      <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                        Posted
                      </th>
                      {user?.role === "recruiter" && (
                        <th className="px-4 py-3 text-left text-[#111518] w-[200px] text-sm font-medium leading-normal">
                          Status
                        </th>
                      )}
                      <th className="px-4 py-3 text-left text-[#111518] w-[200px] text-sm font-medium leading-normal">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobsLoading ? (
                      <tr>
                        <td colSpan="7" className="h-[200px] text-center">
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredJobs.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="h-[200px] text-center">
                          <div className="flex flex-col items-center justify-center py-8">
                            <Building2
                              size={48}
                              className="text-gray-400 mb-4"
                            />
                            <p className="text-[#5d7589] text-lg font-medium">
                              No jobs found
                            </p>
                            <p className="text-[#5d7589] text-sm">
                              Try adjusting your search or filters
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredJobs.map((job) => (
                        <tr
                          key={job._id}
                          className="border-t border-t-[#d5dce2] hover:bg-gray-100 cursor-pointer"
                        >
                          <td
                            className="h-[72px] px-4 py-2 w-[400px] text-[#111518] text-sm font-normal leading-normal"
                            onClick={() => handleJobClick(job._id)}
                          >
                            <div className="font-medium hover:text-blue-600">
                              {job.title}
                            </div>
                            {job.industry && (
                              <div className="text-xs text-gray-500 mt-1">
                                {job.industry}
                              </div>
                            )}
                          </td>
                          <td className="h-[72px] px-4 py-2 w-[400px] text-[#5d7589] text-sm font-normal leading-normal">
                            {job.location || "Not specified"}
                          </td>
                          <td className="h-[72px] px-4 py-2 w-[400px] text-[#5d7589] text-sm font-normal leading-normal">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                              {job.type.replace("-", " ")}
                            </span>
                          </td>
                          <td className="h-[72px] px-4 py-2 w-[400px] text-[#5d7589] text-sm font-normal leading-normal">
                            {job.salaryRange &&
                            (job.salaryRange.min || job.salaryRange.max)
                              ? job.salaryRange.min && job.salaryRange.max
                                ? `$${job.salaryRange.min.toLocaleString()} - $${job.salaryRange.max.toLocaleString()}`
                                : job.salaryRange.min
                                ? `From $${job.salaryRange.min.toLocaleString()}`
                                : `Up to $${job.salaryRange.max.toLocaleString()}`
                              : "Not disclosed"}
                          </td>
                          <td className="h-[72px] px-4 py-2 w-[400px] text-[#5d7589] text-sm font-normal leading-normal">
                            {formatDate(job.createdAt)}
                          </td>
                          {user?.role === "recruiter" && (
                            <td className="h-[72px] px-4 py-2 w-[200px] text-[#5d7589] text-sm font-normal leading-normal">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  job.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : job.status === "closed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {job.status}
                              </span>
                            </td>
                          )}
                          <td className="h-[72px] px-4 py-2 w-[200px]">
                            <Button
                              size="sm"
                              className="bg-blue-600 text-white hover:bg-blue-700"
                              onClick={() => handleJobClick(job._id)}
                            >
                              {user?.role === "candidate" ? "Apply" : "Manage"}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            {!jobsLoading && filteredJobs.length > 0 && (
              <div className="px-4 py-2 text-sm text-gray-600">
                Showing {filteredJobs.length} of {allJobs.length} positions
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyJobs;
