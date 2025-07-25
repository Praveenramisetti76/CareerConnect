import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  FileText,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  Calendar,
  Target,
  Activity,
  Building2,
  UserCheck,
  MessageSquare,
  Heart,
  Filter,
  Search,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/userStore";
import { useCompanyStore } from "@/store/companyStore";
import {
  getDashboardStats,
  getRecentActivities,
  getTopJobs,
} from "@/api/dashboardApi";

const RecruiterHomepage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { companyData, companyRole } = useCompanyStore();
  const [timeFilter, setTimeFilter] = useState("week");

  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats", timeFilter],
    queryFn: getDashboardStats,
  });

  const { data: topJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["top-jobs"],
    queryFn: getTopJobs,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "closed":
        return "text-gray-600 bg-gray-50";
      case "draft":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getQualityIndicator = (quality) => {
    switch (quality) {
      case "high":
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case "medium":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      case "low":
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-300 rounded-full"></div>;
    }
  };

  if (statsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div
      className="bg-gray-50"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.name?.split(" ")[0]}
                </h1>
                <p className="text-gray-600 mt-2">
                  Here's what's happening with your recruitment activities
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/80 backdrop-blur px-3 py-2 rounded-full">
                  <Calendar size={16} />
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <Button
                  onClick={() => navigate("/recruiter/post-job")}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
                >
                  <Briefcase size={18} />
                  Post New Job
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Jobs */}
          <div className="bg-gradient-to-br from-white to-blue-50/30 p-6 rounded-2xl border border-gray-200/50 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.totalJobs || 0}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp size={16} className="text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">
                    {stats?.growth?.jobsPercentage || 0}% growth
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Briefcase size={24} className="text-white" />
              </div>
            </div>
          </div>

          {/* Applications */}
          <div className="bg-gradient-to-br from-white to-green-50/30 p-6 rounded-2xl border border-gray-200/50 hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Applications
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.totalApplications || 0}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp size={16} className="text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">
                    +{stats?.applicationsThisWeek || 0} this week
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users size={24} className="text-white" />
              </div>
            </div>
          </div>

          {/* Articles */}
          <div className="bg-gradient-to-br from-white to-orange-50/30 p-6 rounded-2xl border border-gray-200/50 hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Published Articles
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.totalArticles || 0}
                </p>
                <div className="flex items-center mt-2">
                  <Eye size={16} className="text-blue-600 mr-1" />
                  <span className="text-sm text-blue-600 font-medium">
                    {stats?.totalArticleViews || 0} total views
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FileText size={24} className="text-white" />
              </div>
            </div>
          </div>

          {/* Company Profile */}
          <div className="bg-gradient-to-br from-white to-purple-50/30 p-6 rounded-2xl border border-gray-200/50 hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.activeJobs || 0}
                </p>
                <div className="flex items-center mt-2">
                  <CheckCircle size={16} className="text-purple-600 mr-1" />
                  <span className="text-sm text-purple-600 font-medium">
                    {stats?.totalJobs > 0
                      ? Math.round((stats?.activeJobs / stats?.totalJobs) * 100)
                      : 0}
                    % active
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Target size={24} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Performing Jobs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200/50 h-full overflow-hidden backdrop-blur-sm">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50/50 to-transparent">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Top Performing Jobs
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/jobs")}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                  >
                    View All
                    <ArrowUpRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>

              {/* Jobs List */}
              <div className="p-6">
                <div className="space-y-4">
                  {topJobs?.map((job, index) => (
                    <div
                      key={job._id}
                      className="flex items-center justify-between p-4 hover:bg-blue-50/50 rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/30 to-transparent cursor-pointer transition-all duration-200 hover:scale-[1.02] group"
                      onClick={() => navigate(`/recruiter/jobs/${job._id}`)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm rounded-full group-hover:scale-110 transition-transform duration-200">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {job.title}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-600">
                              {job.applicationCount || 0} applications
                            </span>
                            <span className="text-sm text-gray-600">
                              {job.views || 0} views
                            </span>
                            <div className="flex items-center space-x-1">
                              {getQualityIndicator(job.applicantQuality)}
                              <span className="text-sm text-gray-600 capitalize">
                                {job.applicantQuality} quality
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            job.status
                          )}`}
                        >
                          {job.status}
                        </span>
                        <MoreHorizontal
                          size={16}
                          className="text-gray-400 group-hover:text-gray-600 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200/50 h-full overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50/50 to-transparent">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h3>
              </div>

              {/* Coming Soon Content */}
              <div className="p-6 flex flex-col items-center justify-center h-64">
                <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-4">
                  <Activity size={32} className="text-gray-500" />
                </div>
                <h4 className="text-lg font-medium text-gray-600 mb-2">
                  Coming Soon
                </h4>
                <p className="text-sm text-gray-500 text-center leading-relaxed">
                  We're working on bringing you real-time activity updates
                  including applications, job postings, and team activities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="mt-8 bg-gradient-to-r from-white to-gray-50/50 rounded-2xl border border-gray-200/50 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2 h-12 hover:bg-blue-50 hover:border-blue-300 rounded-xl border-gray-200 transition-all duration-200 transform hover:scale-105 group"
              onClick={() => navigate("/recruiter/post-job")}
            >
              <Briefcase
                size={18}
                className="group-hover:text-blue-600 transition-colors"
              />
              <span className="group-hover:text-blue-600 transition-colors">
                Post Job
              </span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2 h-12 hover:bg-green-50 hover:border-green-300 rounded-xl border-gray-200 transition-all duration-200 transform hover:scale-105 group"
              onClick={() => navigate("/recruiter/applications")}
            >
              <Users
                size={18}
                className="group-hover:text-green-600 transition-colors"
              />
              <span className="group-hover:text-green-600 transition-colors">
                Review Applications
              </span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2 h-12 hover:bg-orange-50 hover:border-orange-300 rounded-xl border-gray-200 transition-all duration-200 transform hover:scale-105 group"
              onClick={() => navigate("/recruiter/articles/create")}
            >
              <FileText
                size={18}
                className="group-hover:text-orange-600 transition-colors"
              />
              <span className="group-hover:text-orange-600 transition-colors">
                Write Article
              </span>
            </Button>

            {/* Edit Company Button - Only for admin role */}
            {companyRole === "admin" && (
              <Button
                variant="outline"
                className="flex items-center justify-center space-x-2 h-12 hover:bg-purple-50 hover:border-purple-300 rounded-xl border-gray-200 transition-all duration-200 transform hover:scale-105 group"
                onClick={() => navigate("/recruiter/edit-company")}
              >
                <Building2
                  size={18}
                  className="group-hover:text-purple-600 transition-colors"
                />
                <span className="group-hover:text-purple-600 transition-colors">
                  Edit Company
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterHomepage;
