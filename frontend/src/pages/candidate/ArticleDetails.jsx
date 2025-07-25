import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/store/userStore";
import { getArticleById, toggleLike, addComment } from "@/api/articleApi";

const CandidateArticleDetails = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  // Fetch article details
  const {
    data: article,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => getArticleById(articleId),
    enabled: !!articleId,
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: () => toggleLike(articleId),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["article", articleId]);
      toast.success(data?.message || (data?.isLiked ? "Article liked!" : "Like removed!"));
    },
    onError: () => {
      toast.error("Failed to like article");
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: (comment) => addComment(articleId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(["article", articleId]);
      setNewComment("");
      toast.success("Comment added!");
    },
    onError: () => {
      toast.error("Failed to add comment");
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

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      commentMutation.mutate({ comment: newComment.trim() });
    }
  };

  const handleBack = () => {
    navigate("/candidate/articles");
  };

  const isLiked = article?.likes?.includes(user?.id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">
          Article not found
        </h2>
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft size={16} className="mr-2" />
          Back to Articles
        </Button>
      </div>
    );
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-8 lg:px-16 xl:px-32 flex flex-1 justify-center py-8">
          <div className="layout-content-container flex flex-col max-w-4xl flex-1">
            {/* Back Button */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                onClick={handleBack}
                variant="ghost"
                className="flex items-center gap-2 text-[#5d7589] hover:text-[#111518]"
              >
                <ArrowLeft size={20} />
                Back to Articles
              </Button>
            </div>

            {/* Article Header */}
            <div className="mb-12">
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-6">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-sm px-3 py-1"
                >
                  {article.category || "General"}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111518] leading-tight mb-8 tracking-tight">
                {article.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-8 text-base text-[#5d7589] mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#111518]">
                      {article.author?.name || "Unknown Author"}
                    </p>
                    <p className="text-sm text-[#5d7589]">Author</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>
                    {formatDate(article.publishedAt || article.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={18} />
                  <span>{(article.views || 0).toLocaleString()} views</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pb-8 border-b border-gray-200">
                <Button
                  onClick={handleLike}
                  variant={isLiked ? "default" : "outline"}
                  className={`flex items-center gap-2 px-4 py-2 ${
                    isLiked
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border-gray-300 hover:border-blue-600 hover:text-blue-600"
                  }`}
                  disabled={likeMutation.isPending}
                >
                  <ThumbsUp size={18} />
                  <span>{article.likes?.length || 0}</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 px-4 py-2"
                >
                  <MessageCircle size={18} />
                  <span>{article.comments?.length || 0} Comments</span>
                </Button>
              </div>
            </div>

            {/* Featured Image */}
            {article.featuredImage && (
              <div className="w-full mb-12">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-sm"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="mb-16">
              <ReactMarkdown
                components={{
                  // Custom styling for markdown elements
                  p: ({ children }) => (
                    <p className="mb-6 text-[#111518] leading-relaxed text-lg">
                      {children}
                    </p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-[#111518] mb-6 mt-8">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-[#111518] mb-5 mt-7">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-[#111518] mb-4 mt-6">
                      {children}
                    </h3>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-[#111518]">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-[#111518]">{children}</em>
                  ),
                  code: ({ children }) => (
                    <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-6">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-6 italic text-gray-600 mb-6">
                      {children}
                    </blockquote>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 mb-6 space-y-2">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-[#111518] leading-relaxed">
                      {children}
                    </li>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-blue-600 hover:text-blue-800 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-[#5d7589] mb-4">
                    Tags:
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {article.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-gray-100 text-[#5d7589] border-gray-300 hover:bg-gray-200 px-3 py-1 text-sm"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-200 pt-12">
              <h3 className="text-2xl font-bold text-[#111518] mb-8">
                Comments ({article.comments?.length || 0})
              </h3>

              {/* Add Comment Form */}
              <form onSubmit={handleComment} className="mb-12">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full border-gray-300 focus:border-blue-600 focus:ring-blue-600 py-3 px-4 text-base"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!newComment.trim() || commentMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-8">
                {article.comments && article.comments.length > 0 ? (
                  article.comments.map((comment, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={18} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-medium text-[#111518] text-base">
                            {comment.user?.name || "Anonymous"}
                          </span>
                          <span className="text-sm text-[#5d7589]">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-[#111518] leading-relaxed text-base">
                          {comment.comment}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle
                      size={64}
                      className="text-gray-400 mx-auto mb-6"
                    />
                    <p className="text-[#5d7589] text-xl mb-2">
                      No comments yet
                    </p>
                    <p className="text-[#5d7589] text-base">
                      Be the first to share your thoughts!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateArticleDetails;
