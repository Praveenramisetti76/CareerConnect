import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Plus,
  Calendar,
  User,
  Eye,
  ThumbsUp,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/store/userStore";
import { getArticles } from "@/api/articleApi";

const ArticlesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Determine user role and set appropriate navigation paths
  const isRecruiter = user?.role === "recruiter";
  const isCandidate = user?.role === "candidate";

  const categories = [
    "All",
    "Interview Tips",
    "Resume Writing",
    "Career Development",
    "Industry Trends",
    "Job Search",
    "Networking",
    "Professional Skills",
    "Workplace Culture",
  ];

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to page 1 when search changes
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Fetch articles
  const {
    data: articlesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["articles", debouncedSearchQuery, selectedCategory, currentPage],
    queryFn: () =>
      getArticles({
        search: debouncedSearchQuery,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        page: currentPage,
        limit: 10, // Set limit to 10 articles per page
        status: "published",
      }),
    refetchOnWindowFocus: false,
  });

  const articles = articlesResponse?.articles || [];
  const totalArticles = articlesResponse?.totalArticles || 0;
  const totalPages =
    articlesResponse?.totalPages || Math.ceil(totalArticles / 10);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else {
      return formatDate(dateString);
    }
  };

  const handleArticleClick = (articleId) => {
    // Navigate to the correct article details route based on user role
    if (isRecruiter) {
      navigate(`/recruiter/articles/${articleId}`);
    } else if (isCandidate) {
      navigate(`/candidate/articles/${articleId}`);
    } else {
      navigate(`/recruiter/articles/${articleId}`); // fallback
    }
  };

  const handleCreateArticle = () => {
    navigate("/recruiter/articles/create");
  };

  // Helper function to create clean text preview from markdown
  const getArticlePreview = (article) => {
    if (article.summary) {
      return article.summary;
    }

    if (article.content) {
      // Remove markdown syntax for a clean preview
      const cleanText = article.content
        .replace(/#{1,6}\s+/g, "") // Remove headings
        .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
        .replace(/\*(.*?)\*/g, "$1") // Remove italic
        .replace(/`(.*?)`/g, "$1") // Remove inline code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links, keep text
        .replace(/^\s*[-+*]\s+/gm, "") // Remove list markers
        .replace(/^\s*\d+\.\s+/gm, "") // Remove numbered list markers
        .replace(/^\s*>\s+/gm, "") // Remove blockquotes
        .replace(/\n+/g, " ") // Replace newlines with spaces
        .trim();

      return (
        cleanText.substring(0, 200) + (cleanText.length > 200 ? "..." : "")
      );
    }

    return "No preview available";
  };

  if (error) {
    toast.error("Failed to load articles");
  }

  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50"
      style={{ fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif' }}
    >
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 backdrop-blur-sm text-slate-600 border border-slate-200/60 rounded-full font-medium text-sm tracking-wide">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  Publishing Platform
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                Career Insights & Advice
              </h1>
              <p className="text-lg text-slate-600 font-light leading-relaxed max-w-2xl">
                Discover expert insights, industry trends, and career guidance
                to accelerate your professional growth
              </p>
            </div>
            {isRecruiter && (
              <div className="ml-8 lg:ml-8 md:ml-4 sm:ml-0 sm:mt-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button
                    onClick={() => navigate("/recruiter/my-articles")}
                    className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-slate-200/60 text-slate-700 hover:bg-white hover:border-slate-300/60 shadow-sm hover:shadow-md transition-all duration-300 px-6 py-3 rounded-xl font-medium w-full sm:w-auto"
                  >
                    <div className="relative flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 transition-transform group-hover:scale-110"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H216V88H40ZM40,200V104H216V200Zm32-80a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H80A8,8,0,0,1,72,120Zm0,32a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H80A8,8,0,0,1,72,152Zm48-32a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H128A8,8,0,0,1,120,120Zm0,32a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H128A8,8,0,0,1,120,152Z" />
                      </svg>
                      My Articles
                    </div>
                  </Button>
                  <Button
                    onClick={handleCreateArticle}
                    className="group relative overflow-hidden bg-slate-900 hover:bg-slate-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl font-medium w-full sm:w-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-2">
                      <Plus
                        size={18}
                        className="transition-transform group-hover:scale-110"
                      />
                      Create Article
                    </div>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
            {/* Search Bar */}
            <div className="p-6 border-b border-slate-200/60">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-slate-400" />
                </div>
                <Input
                  placeholder="Search articles, topics, authors..."
                  className="w-full pl-12 pr-4 h-12 border-0 bg-slate-50/50 focus:bg-white text-slate-900 placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-slate-200 transition-all duration-200 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 tracking-wide uppercase">
                Categories
              </h3>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`group relative overflow-hidden px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-slate-900 text-white shadow-md"
                        : "bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 opacity-0 transition-opacity duration-200 ${
                        selectedCategory === category
                          ? "opacity-100"
                          : "group-hover:opacity-10"
                      }`}
                    ></div>
                    <span className="relative tracking-wide">{category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="mb-12">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-900 border-t-transparent absolute inset-0"></div>
              </div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <MessageCircle size={32} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                No articles found
              </h3>
              <p className="text-slate-600 leading-relaxed max-w-md mx-auto">
                {searchQuery || selectedCategory !== "All"
                  ? "Try adjusting your search or filters to find what you're looking for"
                  : "Start creating engaging content for your audience"}
              </p>
              {!searchQuery && selectedCategory === "All" && isRecruiter && (
                <Button
                  onClick={handleCreateArticle}
                  className="mt-6 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium"
                >
                  Create Your First Article
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Article count info */}
              {totalArticles > 0 && (
                <div className="mb-8 text-center">
                  <p className="text-sm text-slate-600">
                    Showing {(currentPage - 1) * 10 + 1} to{" "}
                    {Math.min(currentPage * 10, totalArticles)} of{" "}
                    {totalArticles} articles
                    {totalArticles > 10 &&
                      ` • Page ${currentPage} of ${totalPages}`}
                  </p>
                </div>
              )}

              <div className="grid gap-8">
                {articles.map((article, index) => (
                  <article
                    key={article._id}
                    className="group cursor-pointer"
                    onClick={() => handleArticleClick(article._id)}
                  >
                    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300/60 transition-all duration-500">
                      <div className="flex items-stretch">
                        {/* Content */}
                        <div className="flex-1 p-8">
                          {/* Author & Date */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-semibold text-sm">
                                {(
                                  article.author?.name ||
                                  article.author?.firstName ||
                                  "A"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900">
                                  {article.author?.name ||
                                    (article.author?.firstName &&
                                    article.author?.lastName
                                      ? `${article.author.firstName} ${article.author.lastName}`
                                      : article.author?.firstName ||
                                        article.author?.lastName ||
                                        "Anonymous")}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar
                                      size={12}
                                      className="text-slate-400"
                                    />
                                    <span className="font-medium">
                                      {formatRelativeTime(
                                        article.publishedAt || article.createdAt
                                      )}
                                    </span>
                                  </div>
                                  <span>•</span>
                                  <span>
                                    {Math.ceil(
                                      (article.content?.length || 0) / 1000
                                    )}{" "}
                                    min read
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Title */}
                          <h2 className="text-2xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-slate-700 transition-colors duration-200 line-clamp-2">
                            {article.title}
                          </h2>

                          {/* Excerpt */}
                          <p className="text-slate-600 mb-6 leading-relaxed line-clamp-3 font-light">
                            {getArticlePreview(article)}
                          </p>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {/* Category Badge */}
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                {article.category || "General"}
                              </div>

                              {/* Tags */}
                              {article.tags && article.tags.length > 0 && (
                                <div className="flex items-center gap-2">
                                  {article.tags
                                    .slice(0, 2)
                                    .map((tag, tagIndex) => (
                                      <span
                                        key={tagIndex}
                                        className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-50 rounded-md"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  {article.tags.length > 2 && (
                                    <span className="text-xs text-slate-400">
                                      +{article.tags.length - 2} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Engagement Stats */}
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <Eye size={14} />
                                <span>
                                  {(article.views || 0).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <ThumbsUp size={14} />
                                <span>{article.likes?.length || 0}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MessageCircle size={14} />
                                <span>{article.comments?.length || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Featured Image */}
                        {article.featuredImage && (
                          <div className="w-64 flex-shrink-0">
                            <div className="h-full relative overflow-hidden">
                              <img
                                src={article.featuredImage}
                                alt={article.title}
                                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                style={{
                                  width: "256px",
                                  height: "240px",
                                  aspectRatio: "16/9",
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination - Only show if total articles > 10 */}
        {totalArticles > 10 && (
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl p-2 shadow-sm">
              {/* Previous button */}
              <button
                className="flex w-10 h-10 items-center justify-center hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} className="text-slate-600" />
              </button>

              {/* Page numbers */}
              {(() => {
                const pages = [];
                const maxVisiblePages = 5;
                let startPage = Math.max(
                  1,
                  currentPage - Math.floor(maxVisiblePages / 2)
                );
                let endPage = Math.min(
                  totalPages,
                  startPage + maxVisiblePages - 1
                );

                // Adjust if we're near the end
                if (endPage - startPage < maxVisiblePages - 1) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }

                // Add first page and ellipsis if needed
                if (startPage > 1) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium text-sm transition-all duration-200 ${
                        currentPage === 1
                          ? "bg-slate-900 text-white shadow-md"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      1
                    </button>
                  );
                  if (startPage > 2) {
                    pages.push(
                      <span
                        key="ellipsis1"
                        className="w-10 h-10 flex items-center justify-center text-slate-400 text-sm"
                      >
                        ...
                      </span>
                    );
                  }
                }

                // Add visible pages
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium text-sm transition-all duration-200 ${
                        currentPage === i
                          ? "bg-slate-900 text-white shadow-md"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {i}
                    </button>
                  );
                }

                // Add ellipsis and last page if needed
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span
                        key="ellipsis2"
                        className="w-10 h-10 flex items-center justify-center text-slate-400 text-sm"
                      >
                        ...
                      </span>
                    );
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium text-sm transition-all duration-200 ${
                        currentPage === totalPages
                          ? "bg-slate-900 text-white shadow-md"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}

              {/* Next button */}
              <button
                className="flex w-10 h-10 items-center justify-center hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={18} className="text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
