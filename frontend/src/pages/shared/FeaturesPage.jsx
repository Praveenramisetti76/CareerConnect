import React from "react";
import {
  Users,
  Briefcase,
  Building2,
  Search,
  FileText,
  MessageSquare,
  Shield,
  Zap,
  Globe,
  Heart,
  Target,
  TrendingUp,
  CheckCircle,
  Star,
  Award,
  UserCheck,
} from "lucide-react";

const FeaturesPage = () => {
  const mainFeatures = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Smart Job Search",
      description:
        "Advanced search and filtering system to find the perfect job opportunities that match your skills and preferences.",
      details: [
        "Location-based filtering",
        "Salary range filters",
        "Experience level matching",
        "Industry-specific searches",
      ],
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Dual User Roles",
      description:
        "Comprehensive platform supporting both job seekers (candidates) and employers (recruiters) with tailored experiences.",
      details: [
        "Candidate profiles and portfolios",
        "Recruiter dashboards",
        "Company profiles",
        "Role-based access control",
      ],
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Company Management",
      description:
        "Complete company profile management with team collaboration features and role-based permissions.",
      details: [
        "Company profile creation",
        "Team member management",
        "Role assignments (Admin/Recruiter/Employee)",
        "Company branding",
      ],
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Application Tracking",
      description:
        "End-to-end application management system for both candidates and recruiters to track job applications.",
      details: [
        "Application status tracking",
        "Interview scheduling",
        "Application history",
        "Status updates and notifications",
      ],
    },
  ];

  const candidateFeatures = [
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Profile Management",
      description:
        "Create comprehensive professional profiles with skills, experience, and portfolio showcase.",
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Job Applications",
      description:
        "Apply to jobs with one-click applications and track all your applications in one place.",
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Company Discovery",
      description:
        "Explore companies, view their profiles, culture, and open positions.",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Career Articles",
      description:
        "Access career advice, industry insights, and professional development resources.",
    },
  ];

  const recruiterFeatures = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Job Posting",
      description:
        "Create and manage job listings with detailed requirements and company branding.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Candidate Management",
      description:
        "Review applications, manage candidate pipelines, and track hiring progress.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description:
        "Get insights into job performance, application metrics, and hiring analytics.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Team Collaboration",
      description:
        "Collaborate with team members, assign roles, and manage hiring workflows.",
    },
  ];

  const technicalFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Authentication",
      description:
        "JWT-based authentication with role-based access control and secure user sessions.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Updates",
      description:
        "Live notifications and real-time status updates for applications and messages.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Responsive Design",
      description:
        "Mobile-first responsive design that works seamlessly across all devices.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Modern UI/UX",
      description:
        "Clean, intuitive interface built with modern design principles and accessibility in mind.",
    },
  ];

  return (
    <div className="px-4 md:px-8 lg:px-16 flex flex-1 justify-center py-8">
      <div className="max-w-7xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#111518] mb-6">
            Powerful Features for Modern Hiring
          </h1>
          <p className="text-xl text-[#5d7589] max-w-3xl mx-auto mb-8">
            CareerConnect is a comprehensive job platform that bridges the gap
            between talented professionals and innovative companies. Discover
            how our features make hiring and job searching effortless.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Job Seekers
            </div>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Recruiters
            </div>
            <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-medium">
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Companies
            </div>
          </div>
        </div>

        {/* Main Features */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[#111518] text-center mb-12">
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-[#d5dce2] p-8 hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-600 mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-[#111518] mb-4">
                  {feature.title}
                </h3>
                <p className="text-[#5d7589] mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li
                      key={detailIndex}
                      className="flex items-center text-[#5d7589]"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Candidate Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111518] mb-4">
              For Job Seekers
            </h2>
            <p className="text-[#5d7589] text-lg">
              Everything you need to find your dream job and advance your career
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {candidateFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center"
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[#111518] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#5d7589] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Recruiter Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111518] mb-4">
              For Recruiters
            </h2>
            <p className="text-[#5d7589] text-lg">
              Streamline your hiring process and find the best candidates
              efficiently
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recruiterFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center"
              >
                <div className="text-green-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[#111518] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#5d7589] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111518] mb-4">
              Technical Excellence
            </h2>
            <p className="text-[#5d7589] text-lg">
              Built with modern technologies for performance, security, and
              scalability
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center"
              >
                <div className="text-purple-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[#111518] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#5d7589] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">
                Built with Modern Technology
              </h2>
              <p className="text-gray-300 text-lg">
                Our platform leverages cutting-edge technologies for the best
                user experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-blue-400">
                  Frontend
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-3" />
                    React.js with modern hooks
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-3" />
                    Tailwind CSS for styling
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-3" />
                    Shadcn/ui component library
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-3" />
                    React Query for data management
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-3" />
                    React Router for navigation
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-green-400">
                  Backend
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-3" />
                    Node.js with Express.js
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-3" />
                    MongoDB for database
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-3" />
                    JWT authentication
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-3" />
                    Cloudinary for file uploads
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-3" />
                    Email integration
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111518] mb-4">
              Platform Capabilities
            </h2>
            <p className="text-[#5d7589] text-lg">
              Designed to handle enterprise-scale hiring needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">∞</div>
              <div className="text-lg font-semibold text-[#111518] mb-1">
                Unlimited Jobs
              </div>
              <div className="text-[#5d7589]">
                Post as many jobs as you need
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-lg font-semibold text-[#111518] mb-1">
                Always Available
              </div>
              <div className="text-[#5d7589]">
                Round-the-clock platform access
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                100%
              </div>
              <div className="text-lg font-semibold text-[#111518] mb-1">
                Secure
              </div>
              <div className="text-[#5d7589]">Enterprise-grade security</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">⚡</div>
              <div className="text-lg font-semibold text-[#111518] mb-1">
                Fast
              </div>
              <div className="text-[#5d7589]">Lightning-fast performance</div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals and companies who trust
            CareerConnect for their hiring needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              Sign Up as Job Seeker
            </a>
            <a
              href="/auth/signup"
              className="bg-blue-800 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-900 transition-colors border border-blue-500"
            >
              Sign Up as Recruiter
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FeaturesPage;
