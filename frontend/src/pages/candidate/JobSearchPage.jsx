import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getAllJobs } from "@/api/jobApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const JobSearchPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    experience: "",
    salary: "",
    industry: "",
    companySize: "",
    remote: "",
  });
  const [sortBy, setSortBy] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  // Remove filteredJobs state, use useMemo instead

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch all jobs
  const {
    data: jobsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allJobs", debouncedSearchTerm],
    queryFn: () => getAllJobs(debouncedSearchTerm),
    refetchOnWindowFocus: false,
  });

  const jobs = jobsResponse?.data?.jobs || [];

  const filteredJobs = React.useMemo(() => {
    let filtered = jobs.slice();
    if (filters.location && filters.location !== "all") {
      filtered = filtered.filter((job) =>
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.jobType && filters.jobType !== "all") {
      filtered = filtered.filter((job) => job.type === filters.jobType);
    }
    if (filters.industry && filters.industry !== "all") {
      filtered = filtered.filter((job) => job.industry === filters.industry);
    }
    if (filters.remote && filters.remote !== "all") {
      if (filters.remote === "remote") {
        filtered = filtered.filter((job) =>
          job.location?.toLowerCase().includes("remote")
        );
      } else if (filters.remote === "onsite") {
        filtered = filtered.filter(
          (job) => !job.location?.toLowerCase().includes("remote")
        );
      }
    }
    if (sortBy === "newest") {
      filtered = filtered
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "salary") {
      filtered = filtered
        .slice()
        .sort((a, b) => (b.salaryRange?.max || 0) - (a.salaryRange?.max || 0));
    }
    return filtered;
  }, [jobs, filters, sortBy]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Posted 1 day ago";
    if (diffDays < 7) return `Posted ${diffDays} days ago`;
    if (diffDays < 30)
      return `Posted ${Math.ceil(diffDays / 7)} week${
        Math.ceil(diffDays / 7) > 1 ? "s" : ""
      } ago`;
    return `Posted ${Math.ceil(diffDays / 30)} month${
      Math.ceil(diffDays / 30) > 1 ? "s" : ""
    } ago`;
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      location: "",
      jobType: "",
      experience: "",
      salary: "",
      industry: "",
      companySize: "",
      remote: "",
    });
    setSearchTerm("");
    setSortBy("relevance");
  };

  // Job type options
  const jobTypes = [
    { value: "all", label: "Any job type" },
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "freelance", label: "Freelance" },
  ];

  // Industry options
  const industries = [
    { value: "all", label: "Any industry" },
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "education", label: "Education" },
    { value: "retail", label: "Retail" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "consulting", label: "Consulting" },
    { value: "media", label: "Media & Entertainment" },
    { value: "other", label: "Other" },
  ];

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

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
            Error Loading Jobs
          </h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gray-50">
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          {/* Filters Sidebar */}
          <div className="layout-content-container flex flex-col w-80">
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Filters
            </h3>

            {/* Remote/Location Filter */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <Select
                  value={filters.remote}
                  onValueChange={(value) => handleFilterChange("remote", value)}
                >
                  <SelectTrigger className="h-14 bg-gray-50 border-[#d4dce2] focus:border-[#d4dce2]">
                    <SelectValue placeholder="Remote/On-site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>

            {/* Job Type Filter */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <Select
                  value={filters.jobType}
                  onValueChange={(value) =>
                    handleFilterChange("jobType", value)
                  }
                >
                  <SelectTrigger className="h-14 bg-gray-50 border-[#d4dce2] focus:border-[#d4dce2]">
                    <SelectValue placeholder="Any job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>

            {/* Industry Filter */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <Select
                  value={filters.industry}
                  onValueChange={(value) =>
                    handleFilterChange("industry", value)
                  }
                >
                  <SelectTrigger className="h-14 bg-gray-50 border-[#d4dce2] focus:border-[#d4dce2]">
                    <SelectValue placeholder="Any industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>

            {/* Location Input */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <Input
                  placeholder="Location (e.g., New York, CA)"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                  className="h-14 bg-gray-50 border-[#d4dce2] focus:border-[#d4dce2]"
                />
              </label>
            </div>

            {/* Clear Filters Button */}
            <div className="flex px-4 py-3">
              <Button
                onClick={clearFilters}
                variant="outline"
                className="flex-1"
              >
                Clear all filters
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight min-w-72">
                Jobs ({filteredJobs.length})
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <Input
                  placeholder="Search jobs by title, company, or keywords"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-14 bg-gray-50 border-[#d4dce2] focus:border-[#d4dce2] text-base"
                />
              </label>
            </div>

            {/* Sort By */}
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Sort by
            </h3>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-14 bg-gray-50 border-[#d4dce2] focus:border-[#d4dce2]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="salary">Highest Salary</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              {currentJobs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No jobs found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Try adjusting your search criteria
                  </p>
                </div>
              ) : (
                currentJobs.map((job) => (
                  <Card
                    key={job._id}
                    className="mx-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/job/${job._id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-stretch justify-between gap-4">
                        <div className="flex flex-col gap-1 flex-[2_2_0px]">
                          <p className="text-[#5c758a] text-sm font-normal leading-normal">
                            {formatDate(job.createdAt)}
                          </p>
                          <p className="text-[#101518] text-base font-bold leading-tight">
                            {job.title}
                          </p>
                          <p className="text-[#5c758a] text-sm font-normal leading-normal">
                            {job.company?.name || job.companyName} •{" "}
                            {job.location}
                          </p>
                          {job.salaryRange &&
                            (job.salaryRange.min || job.salaryRange.max) && (
                              <p className="text-[#101518] text-sm font-medium">
                                $
                                {job.salaryRange.min?.toLocaleString() || "N/A"}{" "}
                                - $
                                {job.salaryRange.max?.toLocaleString() || "N/A"}
                              </p>
                            )}
                          {job.description && (
                            <p className="text-[#5c758a] text-sm leading-normal mt-2 line-clamp-2">
                              {job.description.substring(0, 150)}
                              {job.description.length > 150 ? "..." : ""}
                            </p>
                          )}
                          <div className="flex gap-2 mt-2">
                            {job.type && (
                              <Badge variant="secondary" className="text-xs">
                                {job.type}
                              </Badge>
                            )}
                            {job.industry && (
                              <Badge variant="outline" className="text-xs">
                                {job.industry}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {job.company?.logoUrl && (
                          <div
                            className="w-16 h-16 bg-center bg-no-repeat bg-cover rounded-lg flex-shrink-0"
                            style={{
                              backgroundImage: `url(${job.company.logoUrl})`,
                            }}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center p-4 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </Button>

                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                    className="w-10"
                  >
                    {i + 1}
                  </Button>
                ))}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next →
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
