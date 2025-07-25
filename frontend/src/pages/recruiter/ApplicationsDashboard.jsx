import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  getMyJobPosts,
  getApplicationsForJob,
  getAllApplicationsForCompany,
  updateApplicationStatus,
  sendApplicationStatusEmail,
} from "@/api/jobApi";
import { getUser } from "@/api/profileApi";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  Briefcase,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ApplicationsDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, autoSendStatusEmail } = useAuthStore();
  const [selectedJob, setSelectedJob] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingStatusChange, setPendingStatusChange] = useState(null); // { applicationId, newStatus }
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Fetch jobs posted by the company
  const {
    data: jobsResponse,
    isLoading: jobsLoading,
    error: jobsError,
  } = useQuery({
    queryKey: ["myJobPosts"],
    queryFn: getMyJobPosts,
    refetchOnWindowFocus: false,
  });

  const jobs = jobsResponse?.data?.jobs || [];

  // Fetch applications for selected job or all applications
  const {
    data: applicationsResponse,
    isLoading: applicationsLoading,
    error: applicationsError,
  } = useQuery({
    queryKey: ["applications", selectedJob],
    queryFn: () => {
      if (selectedJob === "all") {
        return getAllApplicationsForCompany();
      } else if (selectedJob) {
        return getApplicationsForJob(user?.company, selectedJob);
      }
      return Promise.resolve({ data: { data: [] } });
    },
    enabled: !!user?.company,
    refetchOnWindowFocus: false,
  });

  const applications = applicationsResponse?.data?.data || [];

  // Update application status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ applicationId, status }) =>
      updateApplicationStatus(user?.company, applicationId, status),
    onSuccess: () => {
      toast.success("Application status updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["applications", selectedJob],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update application status"
      );
    },
  });

  // Send email mutation
  const sendEmailMutation = useMutation({
    mutationFn: (applicationId) => sendApplicationStatusEmail(applicationId),
    onSuccess: () => {
      toast.success("Status update email sent to applicant!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to send status update email"
      );
    },
  });

  // Filter applications based on status
  const filteredApplications = applications.filter((application) => {
    if (statusFilter === "all") return true;
    return application.status === statusFilter;
  });

  // Handle status change (show confirmation modal)
  const handleStatusChange = (applicationId, newStatus) => {
    setPendingStatusChange({ applicationId, newStatus });
    setConfirmOpen(true);
  };

  // Confirm status change
  const confirmStatusChange = () => {
    if (pendingStatusChange) {
      updateStatusMutation.mutate({
        applicationId: pendingStatusChange.applicationId,
        status: pendingStatusChange.newStatus,
      }, {
        onSuccess: () => {
          if (autoSendStatusEmail) {
            sendEmailMutation.mutate(pendingStatusChange.applicationId);
          }
        }
      });
    }
    setConfirmOpen(false);
    setPendingStatusChange(null);
  };

  // Cancel status change
  const cancelStatusChange = () => {
    setConfirmOpen(false);
    setPendingStatusChange(null);
  };

  // Handle view profile
  const handleViewProfile = (userId) => {
    navigate(`/recruiter/applicant/${userId}`);
  };

  // Handle download resume
  const handleDownloadResume = (resumeUrl, applicantName) => {
    if (!resumeUrl) {
      toast.error("No resume available for this applicant");
      return;
    }

    // Create a temporary link to download the resume
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = `${applicantName}_Resume.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "reviewed":
        return "bg-yellow-100 text-yellow-800";
      case "interview":
        return "bg-purple-100 text-purple-800";
      case "hired":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate stats
  const totalApplications = applications.length;
  const appliedCount = applications.filter(
    (app) => app.status === "applied"
  ).length;
  const interviewCount = applications.filter(
    (app) => app.status === "interview"
  ).length;
  const hiredCount = applications.filter(
    (app) => app.status === "hired"
  ).length;

  if (jobsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (jobsError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Jobs
          </h2>
          <p className="text-gray-600 mb-4">
            {jobsError.response?.data?.message || "Failed to load jobs"}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Applications Dashboard
          </h1>
          <p className="text-gray-600">
            Manage and review job applications from candidates
          </p>
        </div>

        {/* Job Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Select Job to View Applications
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a job posting..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>All Applications</span>
                      <Badge variant="secondary" className="ml-auto">
                        {jobs.reduce(
                          (total, job) => total + (job.applicationsCount || 0),
                          0
                        )}{" "}
                        total
                      </Badge>
                    </div>
                  </SelectItem>
                  {jobs.map((job) => (
                    <SelectItem key={job._id} value={job._id}>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>{job.title}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {job.applicationsCount || 0} applications
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedJob && (
              <div className="flex-1">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        {selectedJob && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Applications
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {totalApplications}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        New Applications
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {appliedCount}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Interviews
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {interviewCount}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Hired
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {hiredCount}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Applications Table */}
        {selectedJob && (
          <>
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to update the application status?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={cancelStatusChange}>
                    Cancel
                  </Button>
                  <Button onClick={confirmStatusChange} disabled={updateStatusMutation.isPending}>
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {applicationsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : applicationsError ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-red-600 mb-2">
                    Error Loading Applications
                  </h3>
                  <p className="text-gray-500">
                    {applicationsError.response?.data?.message ||
                      "Failed to load applications"}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      {selectedJob === "all" && <TableHead>Job Title</TableHead>}
                      <TableHead>Email</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Update Status</TableHead>
                      <TableHead className="w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={selectedJob === "all" ? 7 : 6}
                          className="h-32 text-center"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <Users className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {statusFilter === "all"
                                ? "No applications yet"
                                : `No ${statusFilter} applications`}
                            </h3>
                            <p className="text-gray-500">
                              {statusFilter === "all"
                                ? "Applications will appear here when candidates apply"
                                : `No applications with ${statusFilter} status found`}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications.map((application) => (
                        <TableRow key={application._id}>
                          <TableCell className="font-medium">
                            {application.user?.name || "Name Not Available"}
                          </TableCell>
                          {selectedJob === "all" && (
                            <TableCell className="font-medium">
                              {application.job?.title ||
                                "Job Title Not Available"}
                            </TableCell>
                          )}
                          <TableCell>
                            {application.user?.email || "Email Not Available"}
                          </TableCell>
                          <TableCell>
                            {formatDate(application.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(application.status)}>
                              {application.status.charAt(0).toUpperCase() +
                                application.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={application.status}
                              onValueChange={(newStatus) =>
                                handleStatusChange(application._id, newStatus)
                              }
                              disabled={updateStatusMutation.isPending}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="applied">Applied</SelectItem>
                                <SelectItem value="reviewed">Reviewed</SelectItem>
                                <SelectItem value="interview">
                                  Interview
                                </SelectItem>
                                <SelectItem value="hired">Hired</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleViewProfile(application.user?._id)
                                  }
                                  className="cursor-pointer"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDownloadResume(
                                      application.resume,
                                      application.user?.name
                                    )
                                  }
                                  className="cursor-pointer"
                                  disabled={!application.resume}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Resume
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => sendEmailMutation.mutate(application._id)}
                                  className="cursor-pointer"
                                  disabled={sendEmailMutation.isPending}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                                  Send Email
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </>
        )}

        {/* Empty State */}
        {!selectedJob && jobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Job Postings
            </h3>
            <p className="text-gray-500 mb-4">
              You need to post jobs before you can view applications.
            </p>
            <Button onClick={() => navigate("/recruiter/jobs")}>
              Post Your First Job
            </Button>
          </div>
        )}

        {!selectedJob && jobs.length > 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Select a Job to View Applications
            </h3>
            <p className="text-gray-500">
              Choose a job posting from the dropdown above to see all
              applications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsDashboard;
