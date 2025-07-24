import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/profileApi";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Briefcase,
  GraduationCap,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

const ApplicantProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Fetch user profile data
  const {
    data: userResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });

  const userData = userResponse?.data?.data || userResponse?.data;

  // Handle download resume
  const handleDownloadResume = () => {
    if (!userData?.resume) {
      toast.error("No resume available for this applicant");
      return;
    }

    const link = document.createElement("a");
    link.href = userData.resume;
    link.download = `${userData.name}_Resume.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const monthYear = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    return monthYear;
  };

  // Format date range
  const formatDateRange = (startDate, endDate) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : "Present";
    return `${start} - ${end}`;
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
            Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-4">
            {error.response?.data?.message || "Failed to load profile"}
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            User Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested user profile could not be found.
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gray-50"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Breadcrumb */}
            <div className="flex flex-wrap gap-2 p-4">
              <button
                onClick={() => navigate(-1)}
                className="text-[#5c758a] text-base font-medium leading-normal hover:text-[#101518] cursor-pointer"
              >
                Applications
              </button>
              <span className="text-[#5c758a] text-base font-medium leading-normal">
                /
              </span>
              <span className="text-[#101518] text-base font-medium leading-normal">
                Applicant Profile
              </span>
            </div>

            {/* Profile Header */}
            <div className="flex p-4">
              <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                <div className="flex gap-4">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                    style={{
                      backgroundImage: userData.avatarUrl
                        ? `url(${userData.avatarUrl})`
                        : `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                    }}
                  >
                    {!userData.avatarUrl && (
                      <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold rounded-full">
                        {userData.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                      {userData.name || "Unknown User"}
                    </p>
                    {userData.headline && (
                      <p className="text-[#5c758a] text-base font-normal leading-normal">
                        {userData.headline}
                      </p>
                    )}
                    {userData.location && (
                      <p className="text-[#5c758a] text-base font-normal leading-normal">
                        {userData.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="pb-3">
              <div className="flex border-b border-[#d4dce2] px-4 gap-8">
                <div className="flex flex-col items-center justify-center border-b-[3px] border-b-[#3a7aaf] text-[#101518] pb-[13px] pt-4">
                  <p className="text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]">
                    About
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#5c758a] pb-[13px] pt-4">
                  <p className="text-[#5c758a] text-sm font-bold leading-normal tracking-[0.015em]">
                    Activity
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#5c758a] pb-[13px] pt-4">
                  <p className="text-[#5c758a] text-sm font-bold leading-normal tracking-[0.015em]">
                    Notes
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <h2 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Contact
            </h2>
            <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d4dce2] py-5">
                <p className="text-[#5c758a] text-sm font-normal leading-normal">
                  Email
                </p>
                <p className="text-[#101518] text-sm font-normal leading-normal">
                  {userData.email}
                </p>
              </div>
              {userData.phone && (
                <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d4dce2] py-5">
                  <p className="text-[#5c758a] text-sm font-normal leading-normal">
                    Phone
                  </p>
                  <p className="text-[#101518] text-sm font-normal leading-normal">
                    {userData.phone}
                  </p>
                </div>
              )}
              {userData.location && (
                <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d4dce2] py-5">
                  <p className="text-[#5c758a] text-sm font-normal leading-normal">
                    Location
                  </p>
                  <p className="text-[#101518] text-sm font-normal leading-normal">
                    {userData.location}
                  </p>
                </div>
              )}
            </div>

            {/* Resume Section */}
            {userData.resume && (
              <>
                <h2 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                  Resume
                </h2>
                <div className="p-4">
                  <div className="flex items-stretch justify-between gap-4 rounded-xl">
                    <div className="flex flex-col gap-1 flex-[2_2_0px]">
                      <p className="text-[#5c758a] text-sm font-normal leading-normal">
                        Resume
                      </p>
                      <p className="text-[#101518] text-base font-bold leading-tight">
                        {userData.name} - Resume.pdf
                      </p>
                      <p className="text-[#5c758a] text-sm font-normal leading-normal">
                        PDF Document
                      </p>
                    </div>
                    <button
                      onClick={handleDownloadResume}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#3a7aaf] text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2"
                    >
                      <Download className="h-4 w-4" />
                      <span className="truncate">Download</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* About Section */}
            {userData.about && (
              <>
                <h2 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                  About
                </h2>
                <p className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4">
                  {userData.about}
                </p>
              </>
            )}

            {/* Experience Section */}
            {userData.experience && userData.experience.length > 0 && (
              <>
                <h2 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                  Experience
                </h2>
                {userData.experience.map((exp, index) => (
                  <div key={index} className="flex gap-4 bg-gray-50 px-4 py-3">
                    <div className="text-[#101518] flex items-center justify-center rounded-lg bg-[#eaeef1] shrink-0 size-12">
                      <Briefcase size={24} />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="text-[#101518] text-base font-medium leading-normal">
                        {exp.title}
                      </p>
                      <p className="text-[#5c758a] text-sm font-normal leading-normal">
                        {exp.company}
                      </p>
                      {exp.description && (
                        <p className="text-[#5c758a] text-sm font-normal leading-normal">
                          {exp.description}
                        </p>
                      )}
                      <p className="text-[#5c758a] text-sm font-normal leading-normal">
                        {formatDateRange(exp.startDate, exp.endDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Education Section */}
            {userData.education && userData.education.length > 0 && (
              <>
                <h2 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                  Education
                </h2>
                {userData.education.map((edu, index) => (
                  <div key={index} className="flex gap-4 bg-gray-50 px-4 py-3">
                    <div className="text-[#101518] flex items-center justify-center rounded-lg bg-[#eaeef1] shrink-0 size-12">
                      <GraduationCap size={24} />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="text-[#101518] text-base font-medium leading-normal">
                        {edu.degree}{" "}
                        {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                      </p>
                      <p className="text-[#5c758a] text-sm font-normal leading-normal">
                        {edu.institution}
                      </p>
                      {edu.gpa && (
                        <p className="text-[#5c758a] text-sm font-normal leading-normal">
                          GPA: {edu.gpa}
                        </p>
                      )}
                      <p className="text-[#5c758a] text-sm font-normal leading-normal">
                        {formatDateRange(edu.startDate, edu.endDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Skills Section */}
            {userData.skills && userData.skills.length > 0 && (
              <>
                <h2 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                  Skills
                </h2>
                <div className="flex gap-3 p-3 flex-wrap pr-4">
                  {userData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#eaeef1] pl-4 pr-4"
                    >
                      <p className="text-[#101518] text-sm font-medium leading-normal">
                        {skill}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Cover Letter Section */}
            {userData.coverLetter && (
              <>
                <h2 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                  Cover Letter
                </h2>
                <p className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4">
                  {userData.coverLetter}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfile;
