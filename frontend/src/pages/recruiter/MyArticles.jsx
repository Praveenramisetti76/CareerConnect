import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Eye,
  ThumbsUp,
  MessageCircle,
  Edit,
  Trash2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/store/userStore";
import { getMyArticles, deleteArticle } from "@/api/articleApi";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const MyArticles = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(null); // articleId or null

  // Fetch user's articles
  const {
    data: articles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myArticles"],
    queryFn: getMyArticles,
  });

  // Delete article mutation
  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries(["myArticles"]);
      toast.success("Article deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete article");
    },
  });

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

  const getArticlePreview = (article) => {
    const cleanContent = article.content
      .replace(/[#*_`~]/g, "")
      .substring(0, 200);
    return cleanContent + (article.content.length > 200 ? "..." : "");
  };

  const handleEdit = (articleId) => {
    navigate(`/recruiter/articles/edit/${articleId}`);
  };

  const handleView = (articleId) => {
    navigate(`/recruiter/articles/${articleId}`);
  };

  const handleDelete = (articleId) => {
    setDeleteDialogOpen(articleId);
  };

  const handleConfirmDelete = () => {
    if (deleteDialogOpen) {
      deleteMutation.mutate(deleteDialogOpen);
      setDeleteDialogOpen(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(null);
  };

  const handleCreateNew = () => {
    navigate("/recruiter/articles/create");
  };

  // Filter articles based on search query
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.category &&
        article.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Determine if an article is low quality (customize thresholds as needed)
  const isLowQuality = (article) => {
    const views = article.views || 0;
    const likes = Array.isArray(article.likes) ? article.likes.length : 0;
    const comments = Array.isArray(article.comments)
      ? article.comments.length
      : 0;
    return views < 10 && likes < 2 && comments < 1;
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-200"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-900 border-t-transparent absolute inset-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 py-12"
      style={{ fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif' }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">
                My Articles
              </h1>
              <p className="text-slate-600 font-light text-lg">
                Manage and edit your published articles
              </p>
            </div>
            <Button
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Plus size={20} />
              Create New Article
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Search your articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl text-slate-900 placeholder:text-slate-500 focus:border-slate-300 focus:ring-0"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-6">
              <FileText size={32} className="text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Error loading articles
            </h3>
            <p className="text-slate-600 font-light">
              There was an error loading your articles. Please try again.
            </p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <FileText size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              {articles.length === 0 ? "No articles yet" : "No articles found"}
            </h3>
            <p className="text-slate-600 font-light mb-6">
              {articles.length === 0
                ? "Start sharing your knowledge and insights with the community"
                : "Try adjusting your search terms to find what you're looking for"}
            </p>
            {articles.length === 0 && (
              <Button
                onClick={handleCreateNew}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium"
              >
                <Plus size={16} className="mr-2" />
                Create Your First Article
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-8 md:gap-6 lg:gap-8">
            {filteredArticles.map((article) => (
              <Card
                key={article._id}
                className="group bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Content */}
                    <div className="flex-1 p-8">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          {/* Category Badge */}
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                            {article.category || "General"}
                          </div>

                          {/* Status Badge */}
                          <Badge
                            variant={
                              article.status === "published"
                                ? "default"
                                : "secondary"
                            }
                            className={`${
                              article.status === "published"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            } font-medium`}
                          >
                            {article.status}
                          </Badge>
                        </div>
                        {/* Low Quality Label */}
                        {isLowQuality(article) && (
                          <span className="ml-2 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold border border-red-200 animate-pulse">
                            Low Quality
                          </span>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(article._id);
                            }}
                            size="sm"
                            variant="ghost"
                            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(article._id);
                            }}
                            size="sm"
                            variant="ghost"
                            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          >
                            <Edit size={16} />
                          </Button>
                          <ConfirmDialog
                            open={deleteDialogOpen === article._id}
                            onOpenChange={(open) => {
                              if (!open) setDeleteDialogOpen(null);
                            }}
                            onConfirm={handleConfirmDelete}
                            title="Delete Article?"
                            description="Are you sure you want to delete this article? This action cannot be undone."
                          >
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(article._id);
                              }}
                              size="sm"
                              variant="destructive"
                              className="bg-black text-white hover:bg-zinc-900"
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </ConfirmDialog>
                        </div>
                      </div>

                      {/* Title */}
                      <h2
                        className="text-2xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-slate-700 transition-colors duration-200 line-clamp-2 cursor-pointer"
                        onClick={() => handleView(article._id)}
                      >
                        {article.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-slate-600 mb-6 leading-relaxed line-clamp-3 font-light">
                        {getArticlePreview(article)}
                      </p>

                      {/* Meta Information */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-slate-400" />
                            <span className="font-medium">
                              {formatRelativeTime(
                                article.publishedAt || article.createdAt
                              )}
                            </span>
                          </div>
                          <span>•</span>
                          <span>
                            {Math.ceil((article.content?.length || 0) / 1000)}{" "}
                            min read
                          </span>
                        </div>

                        {/* Engagement Stats */}
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Eye size={14} />
                            <span>{(article.views || 0).toLocaleString()}</span>
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
                      <div className="w-full lg:w-64 lg:flex-shrink-0">
                        <div className="h-48 lg:h-full relative overflow-hidden">
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteDialogOpen !== null && (
          <ConfirmDialog
            open={true}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            title="Confirm Delete"
            description="Are you sure you want to delete this article? This action cannot be undone."
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
          />
        )}
      </div>
    </div>
  );
};

export default MyArticles;
