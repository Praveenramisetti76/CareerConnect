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
  MapPin,
  DollarSign,
  Star,
  BookmarkPlus,
  Send,
  User,
  Award,
  TrendingUpIcon,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useAuthStore from "@/store/userStore";
import {
  getCandidateDashboardStats,
  getRecentApplications,
  getRecommendedJobs,
  getCandidateMetrics,
} from "@/api/candidateDashboardApi";

const CandidateHomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [timeFilter, setTimeFilter] = useState("week");

  // Fetch candidate dashboard data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["candidate-dashboard-stats", timeFilter],
    queryFn: getCandidateDashboardStats,
  });

  const { data: recentApplications, isLoading: applicationsLoading } = useQuery(
    {
      queryKey: ["recent-applications"],
      queryFn: getRecentApplications,
    }
  );

  const { data: recommendedJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["recommended-jobs"],
    queryFn: getRecommendedJobs,
  });

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["candidate-metrics"],
    queryFn: getCandidateMetrics,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "hired":
        return "bg-green-100 text-green-800";
      case "interview":
        return "bg-blue-100 text-blue-800";
      case "reviewed":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "applied":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "hired":
        return <CheckCircle size={16} className="text-green-600" />;
      case "interview":
        return <Users size={16} className="text-blue-600" />;
      case "reviewed":
        return <Eye size={16} className="text-yellow-600" />;
      case "rejected":
        return <XCircle size={16} className="text-red-600" />;
      case "applied":
        return <Clock size={16} className="text-gray-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  if (statsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {user?.name?.split(" ")[0]}! 👋
                </h1>
                <p className="text-blue-100 mt-2">
                  Ready to take the next step in your career journey?
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-blue-100 bg-white/20 backdrop-blur px-3 py-2 rounded-full">
                  <Calendar size={16} />
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <Button
                  onClick={() => navigate("/candidate/jobs")}
                  className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 transform hover:scale-105 font-medium"
                >
                  <Search size={18} />
                  Find Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Applications */}
          <div className="bg-gradient-to-br from-white to-blue-50/30 p-6 rounded-2xl border border-gray-200/50 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 group">
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
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FileText size={24} className="text-white" />
              </div>
            </div>
          </div>

          {/* Response Rate */}
          <div className="bg-gradient-to-br from-white to-green-50/30 p-6 rounded-2xl border border-gray-200/50 hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Response Rate
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {metrics?.responseRate || 0}%
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUpIcon size={16} className="text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">
                    {stats?.statusCounts?.reviewed +
                      stats?.statusCounts?.interview +
                      stats?.statusCounts?.hired +
                      stats?.statusCounts?.rejected || 0}{" "}
                    responses
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart3 size={24} className="text-white" />
              </div>
            </div>
          </div>

          {/* Interview Rate */}
          <div className="bg-gradient-to-br from-white to-purple-50/30 p-6 rounded-2xl border border-gray-200/50 hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Interview Rate
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {metrics?.interviewRate || 0}%
                </p>
                <div className="flex items-center mt-2">
                  <Users size={16} className="text-purple-600 mr-1" />
                  <span className="text-sm text-purple-600 font-medium">
                    {stats?.statusCounts?.interview || 0} interviews
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users size={24} className="text-white" />
              </div>
            </div>
          </div>

          {/* Success Rate */}
          <div className="bg-gradient-to-br from-white to-orange-50/30 p-6 rounded-2xl border border-gray-200/50 hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Success Rate
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {metrics?.successRate || 0}%
                </p>
                <div className="flex items-center mt-2">
                  <Award size={16} className="text-orange-600 mr-1" />
                  <span className="text-sm text-orange-600 font-medium">
                    {stats?.statusCounts?.hired || 0} offers
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Award size={24} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recommended Jobs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200/50 h-full overflow-hidden backdrop-blur-sm">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50/50 to-transparent">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Recommended for You
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/candidate/jobs")}
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
                  {recommendedJobs?.slice(0, 5).map((job, index) => (
                    <div
                      key={job._id}
                      className="flex items-center justify-between p-4 hover:bg-blue-50/50 rounded-xl border border-gray-100 hover:border-blue-200 cursor-pointer transition-all duration-200 hover:scale-[1.02] group"
                      onClick={() => navigate(`/job/${job._id}`)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          {job.company?.logoUrl ? (
                            <img
                              src={job.company.logoUrl}
                              alt={job.company.name}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                          ) : (
                            <Building2 size={20} className="text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {job.title}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <Building2 size={14} />
                              {job.company?.name || job.companyName}
                            </span>
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin size={14} />
                              {job.location}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star
                                size={14}
                                className="text-yellow-500 fill-current"
                              />
                              <span className="text-sm text-gray-600">
                                {job.recommendationScore}% match
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          {job.type}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle bookmark action
                          }}
                        >
                          <BookmarkPlus size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200/50 h-full overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50/50 to-transparent">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Recent Applications
                </h3>
              </div>

              {/* Applications List */}
              <div className="p-6">
                {recentApplications?.length > 0 ? (
                  <div className="space-y-4">
                    {recentApplications.slice(0, 4).map((application) =>
                      application.job ? (
                        <div
                          key={application._id}
                          className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer"
                          onClick={() =>
                            navigate(`/job/${application.job._id}`)
                          }
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {application.job.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {application.job.company?.name ||
                                  application.job.companyName}
                              </p>
                              <div className="flex items-center mt-2">
                                {getStatusIcon(application.status)}
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ml-2 ${getStatusColor(
                                    application.status
                                  )}`}
                                >
                                  {application.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No applications yet</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => navigate("/candidate/jobs")}
                    >
                      Start Applying
                    </Button>
                  </div>
                )}
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
              onClick={() => navigate("/candidate/jobs")}
            >
              <Search
                size={18}
                className="group-hover:text-blue-600 transition-colors"
              />
              <span className="group-hover:text-blue-600 transition-colors">
                Browse Jobs
              </span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2 h-12 hover:bg-green-50 hover:border-green-300 rounded-xl border-gray-200 transition-all duration-200 transform hover:scale-105 group"
              onClick={() => navigate("/candidate/applications")}
            >
              <FileText
                size={18}
                className="group-hover:text-green-600 transition-colors"
              />
              <span className="group-hover:text-green-600 transition-colors">
                My Applications
              </span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2 h-12 hover:bg-purple-50 hover:border-purple-300 rounded-xl border-gray-200 transition-all duration-200 transform hover:scale-105 group"
              onClick={() => navigate("/candidate/companies")}
            >
              <Building2
                size={18}
                className="group-hover:text-purple-600 transition-colors"
              />
              <span className="group-hover:text-purple-600 transition-colors">
                Explore Companies
              </span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2 h-12 hover:bg-orange-50 hover:border-orange-300 rounded-xl border-gray-200 transition-all duration-200 transform hover:scale-105 group"
              onClick={() => navigate("/candidate/profile")}
            >
              <User
                size={18}
                className="group-hover:text-orange-600 transition-colors"
              />
              <span className="group-hover:text-orange-600 transition-colors">
                Update Profile
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateHomePage;
