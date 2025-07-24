import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById } from "@/api/jobApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit, ExternalLink, ArrowLeft, Lock } from "lucide-react";
import useAuthStore from "@/store/userStore";

const RecruiterJobDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Fetch job details
  const {
    data: jobResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJobById(jobId),
    enabled: !!jobId,
  });

  const job = jobResponse?.data || jobResponse;

  // Check if current user can edit this job
  const canEdit =
    job && user && (job.postedBy === user.id || job.postedBy === user._id);

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

  // Handle edit job
  const handleEditJob = () => {
    if (canEdit) {
      navigate(`/recruiter/edit-job/${jobId}`);
    }
  };

  // Handle back navigation
  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/recruiter/jobs")}>
            Back to Jobs Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors duration-200 relative group"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
            <span className="absolute bottom-0 left-0 w-0 h-px bg-gray-900 transition-all duration-200 group-hover:w-full"></span>
          </button>

          {canEdit ? (
            <button
              onClick={handleEditJob}
              className="group relative px-6 py-3 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-blue-500/25"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Job
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-500 rounded-full border border-gray-200">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">View Only</span>
            </div>
          )}
        </div>

        {/* Header Section */}
        <header className="pb-12 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* Left: Job Info */}
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
                {job.title}
              </h1>

              <div className="flex items-center gap-2 text-lg text-gray-600 mb-6">
                <span className="font-medium">
                  {job.company?.name || job.companyName}
                </span>
                <span className="text-gray-300">•</span>
                <span>{job.location}</span>
              </div>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span>Posted {formatDate(job.createdAt)}</span>
                {job.type && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="capitalize">
                      {job.type.replace("-", " ")}
                    </span>
                  </>
                )}
                {job.status && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span
                      className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === "active"
                          ? "bg-green-50 text-green-700"
                          : job.status === "closed"
                          ? "bg-red-50 text-red-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {job.status}
                    </span>
                  </>
                )}
                {job.applicationsCount !== undefined && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {job.applicationsCount} applications
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="lg:flex-shrink-0 flex gap-3">
              {canEdit && (
                <button
                  onClick={handleEditJob}
                  className="group relative px-6 py-3 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-blue-500/25"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Job
                  </span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}
              <button
                onClick={() =>
                  navigate(`/recruiter/applications?jobId=${jobId}`)
                }
                className="group relative px-6 py-3 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Applications
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Company Info Strip */}
        <section className="py-8 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {job.company?.logoUrl && (
                <img
                  src={job.company.logoUrl}
                  alt={job.company?.name || job.companyName}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              )}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-medium text-gray-900">
                  {job.company?.name || job.companyName}
                </span>
                <span className="text-gray-300">•</span>
                <span>{job.company?.employeeCount || "50-100"} employees</span>
                <span className="text-gray-300">•</span>
                <span>
                  {job.company?.industry ||
                    job.industry ||
                    "Information Technology"}
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                navigate(
                  `/recruiter/company/${job.company?._id || job.companyId}`
                )
              }
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 relative group"
            >
              View Company Profile →
              <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </button>
          </div>
        </section>

        {/* Main Content */}
        <main className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-3 space-y-16">
              {/* About the Job */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">
                  About the role
                </h2>
                <div className="prose prose-lg prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
              </section>

              {/* Qualifications */}
              {job.requirements && (
                <section className="border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">
                    What we're looking for
                  </h2>
                  <div className="space-y-4">
                    {Array.isArray(job.requirements) ? (
                      job.requirements.map((requirement, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 group"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-3 flex-shrink-0 group-hover:scale-125 transition-transform duration-200"></div>
                          <p className="text-gray-700 leading-relaxed text-lg">
                            {requirement}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-start gap-4 group">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-3 flex-shrink-0 group-hover:scale-125 transition-transform duration-200"></div>
                        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                          {job.requirements}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Responsibilities */}
              {job.responsibilities && (
                <section className="border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">
                    What you'll do
                  </h2>
                  <div className="space-y-4">
                    {Array.isArray(job.responsibilities) ? (
                      job.responsibilities.map((responsibility, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 group"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-3 flex-shrink-0 group-hover:scale-125 transition-transform duration-200"></div>
                          <p className="text-gray-700 leading-relaxed text-lg">
                            {responsibility}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-start gap-4 group">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-3 flex-shrink-0 group-hover:scale-125 transition-transform duration-200"></div>
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {job.responsibilities}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* How to Apply */}
              {job.applicationInstructions && (
                <section className="border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">
                    How to apply
                  </h2>
                  <div className="prose prose-lg prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                      {job.applicationInstructions}
                    </p>
                  </div>
                </section>
              )}

              {/* Compensation & Job Details Section */}
              <section className="border-t border-gray-100 pt-12">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 min-h-[180px] p-4 md:p-6 lg:p-8">
                  {/* Left Column - Compensation (40% width) */}
                  {job.salaryRange &&
                    (job.salaryRange.min || job.salaryRange.max) && (
                      <div className="w-full md:w-[280px] md:flex-shrink-0">
                        <h3 className="text-lg font-semibold text-green-700 mb-4">
                          Compensation
                        </h3>
                        <div className="px-6 py-4 bg-emerald-50 rounded-2xl">
                          <div className="text-center">
                            {job.salaryRange.min && job.salaryRange.max ? (
                              <>
                                <p className="text-2xl font-bold text-green-800 mb-1 leading-tight">
                                  ${job.salaryRange.min?.toLocaleString()} - $
                                  {job.salaryRange.max?.toLocaleString()}
                                </p>
                              </>
                            ) : job.salaryRange.min ? (
                              <p className="text-2xl font-bold text-green-800 mb-1 leading-tight">
                                From ${job.salaryRange.min?.toLocaleString()}
                              </p>
                            ) : (
                              <p className="text-2xl font-bold text-green-800 mb-1 leading-tight">
                                Up to ${job.salaryRange.max?.toLocaleString()}
                              </p>
                            )}
                            <p className="text-sm text-green-600 mt-1">
                              {job.salaryRange.currency || "USD"} per year
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Right Column - Job Details (60% width) */}
                  <div className="flex-1 max-w-[420px]">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Job Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm md:text-base border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Employment Type</span>
                        <span className="font-medium text-gray-800 capitalize">
                          {job.type?.replace("-", " ") || "Full-time"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm md:text-base border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Location</span>
                        <span className="font-medium text-gray-800">
                          {job.location}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm md:text-base border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Industry</span>
                        <span className="font-medium text-gray-800">
                          {job.industry || "Technology"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm md:text-base border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Posted</span>
                        <span className="font-medium text-gray-800">
                          {formatDate(job.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-12">
                {/* Job Performance Stats */}
                <div className="group">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
                    Job Performance
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 group-hover:shadow-md transition-all duration-300">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Applications
                        </span>
                        <span className="font-bold text-2xl text-blue-700">
                          {job.applicationsCount || 0}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Views</span>
                        <span className="font-bold text-2xl text-green-700">
                          {job.viewsCount || 0}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Status</span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            job.status === "active"
                              ? "bg-green-100 text-green-700"
                              : job.status === "closed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Info */}
                {job.company?.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
                      About {job.company?.name || job.companyName}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {job.company.description}
                    </p>
                  </div>
                )}

                {/* Benefits */}
                {job.benefits && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
                      Benefits & Perks
                    </h3>
                    <div className="space-y-3">
                      {Array.isArray(job.benefits) ? (
                        job.benefits.map((benefit, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 group"
                          >
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-200"></div>
                            <p className="text-gray-700 leading-relaxed">
                              {benefit}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-start gap-3 group">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-200"></div>
                          <p className="text-gray-700 leading-relaxed">
                            {job.benefits}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    {canEdit ? (
                      <button
                        onClick={handleEditJob}
                        className="w-full group relative px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-blue-500/25"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Edit className="w-4 h-4" />
                          Edit Job
                        </span>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    ) : (
                      <div className="w-full flex items-center justify-center px-4 py-3 bg-gray-50 text-gray-500 rounded-xl border border-gray-200">
                        <Lock className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">
                          Edit Restricted - Not Your Job
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() =>
                        navigate(`/recruiter/applications?jobId=${jobId}`)
                      }
                      className="w-full group relative px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        View Applications
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer Section */}
        <footer className="border-t border-gray-100 pt-12 pb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-500">Share this job:</span>
              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200 hover:bg-blue-50 rounded-lg">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors duration-200 hover:bg-blue-50 rounded-lg">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
              </div>
            </div>
            <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors duration-200 relative group">
              Report this job
              <span className="absolute bottom-0 left-0 w-0 h-px bg-gray-400 transition-all duration-200 group-hover:w-full"></span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default RecruiterJobDetailPage;
