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
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/store/userStore";
import { getArticleById, toggleLike, addComment } from "@/api/articleApi";

const ArticleDetails = () => {
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
      toast.success(
        data?.message || (data?.isLiked ? "Article liked!" : "Like removed!")
      );
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

  const handleEdit = () => {
    navigate(`/recruiter/articles/edit/${articleId}`);
  };

  const handleBack = () => {
    // Navigate back based on user role
    if (user?.role === "candidate") {
      navigate("/candidate/articles");
    } else {
      navigate("/recruiter/articles");
    }
  };

  const isAuthor = article?.author?._id === user?.id;
  const isLiked = article?.likes?.includes(user?.id);

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

  if (error || !article) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={32} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Article not found
          </h2>
          <p className="text-slate-600 mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={handleBack}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Articles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50"
      style={{ fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif' }}
    >
      <article className="mx-auto max-w-6xl px-6 py-12">
        {/* Navigation Header */}
        <div className="mb-12">
          <Button
            onClick={handleBack}
            className="group flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200/60 text-slate-700 hover:bg-white hover:border-slate-300/60 rounded-xl font-medium transition-all duration-200"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to Articles
          </Button>
        </div>

        {/* Article Header */}
        <header className="mb-16">
          {/* Category & Reading Time */}
          <div className="flex items-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 backdrop-blur-sm text-slate-700 border border-slate-200/60 rounded-full font-medium text-sm tracking-wide">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
              {article.category || "General"}
            </div>
            <div className="text-sm text-slate-500 font-medium">
              {Math.ceil((article.content?.length || 0) / 1000)} min read
            </div>
          </div>

          {/* Article Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight mb-12 tracking-tight bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
            {article.title}
          </h1>

          {/* Author & Meta Information */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-lg">
                  {(article.author?.name || article.author?.firstName || "A")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-lg tracking-tight">
                  {article.author?.name ||
                    (article.author?.firstName && article.author?.lastName
                      ? `${article.author.firstName} ${article.author.lastName}`
                      : article.author?.firstName ||
                        article.author?.lastName ||
                        "Anonymous Author")}
                </p>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>
                    {formatDate(article.publishedAt || article.createdAt)}
                  </span>
                  <span>•</span>
                  <span>{(article.views || 0).toLocaleString()} views</span>
                </div>
              </div>
            </div>

            {/* Author Actions */}
            {isAuthor && (
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleEdit}
                  className="group flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200/60 text-slate-700 hover:bg-white hover:border-slate-300/60 rounded-xl font-medium transition-all duration-200"
                >
                  <Edit
                    size={16}
                    className="transition-transform group-hover:scale-110"
                  />
                  Edit
                </Button>
                <Button className="group flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 rounded-xl font-medium transition-all duration-200">
                  <Trash2
                    size={16}
                    className="transition-transform group-hover:scale-110"
                  />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Engagement Actions */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pb-8 border-b border-slate-200/60">
            <Button
              onClick={handleLike}
              className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                isLiked
                  ? "bg-slate-900 text-white shadow-md hover:shadow-lg"
                  : "bg-white/80 backdrop-blur-sm border border-slate-200/60 text-slate-700 hover:bg-white hover:border-slate-300/60"
              }`}
              disabled={likeMutation.isPending}
            >
              <ThumbsUp
                size={16}
                className={`transition-transform group-hover:scale-110 ${
                  isLiked ? "text-white" : ""
                }`}
              />
              <span>{article.likes?.length || 0}</span>
            </Button>
          </div>
        </header>
        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full object-cover"
                style={{
                  width: "100%",
                  height: "400px",
                  maxHeight: "500px",
                  aspectRatio: "16/9",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="mb-16">
          <div
            className="prose prose-xl max-w-none mx-auto"
            style={{ maxWidth: "75ch" }}
          >
            <ReactMarkdown
              components={{
                // Custom styling for markdown elements
                p: ({ children }) => (
                  <p className="mb-6 text-slate-700 leading-relaxed text-lg font-light">
                    {children}
                  </p>
                ),
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-slate-900 mb-6 mt-8">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-slate-900 mb-5 mt-7">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-slate-900 mb-4 mt-6">
                    {children}
                  </h3>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-slate-900">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-slate-700">{children}</em>
                ),
                code: ({ children }) => (
                  <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-slate-100 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-6">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-slate-300 pl-6 italic text-slate-600 mb-6">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 mb-6 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-slate-700 leading-relaxed">{children}</li>
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
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-200/60">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 tracking-tight">
              Related Topics
            </h3>
            <div className="flex flex-wrap gap-3">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100/80 text-slate-700 rounded-full text-sm font-medium hover:bg-slate-200/80 transition-colors cursor-pointer"
                >
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>#
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Comments Section */}
      <div className="mx-auto max-w-6xl px-6">
        <section className="border-t border-slate-200/60 pt-16">
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
              Discussion ({article.comments?.length || 0})
            </h3>
            <p className="text-slate-600 font-light">
              Share your thoughts and engage with the community
            </p>
          </div>{" "}
          {/* Add Comment Form */}
          <form onSubmit={handleComment} className="mb-16">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {(user?.name || user?.firstName || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="What are your thoughts on this article?"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full border-0 bg-transparent focus:ring-0 text-slate-900 placeholder:text-slate-500 text-base font-light px-0 py-3"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-slate-500 font-light">
                      Be respectful and constructive in your feedback
                    </div>
                    <Button
                      type="submit"
                      disabled={!newComment.trim() || commentMutation.isPending}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-50"
                    >
                      {commentMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <>
                          <Send size={16} className="mr-2" />
                          Post Comment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          {/* Comments List */}
          <div className="space-y-8">
            {article.comments && article.comments.length > 0 ? (
              article.comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {(
                          comment.user?.name ||
                          comment.user?.firstName ||
                          comment.author?.name ||
                          "A"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-semibold text-slate-900 text-base tracking-tight">
                          {comment.user?.name ||
                            comment.author?.name ||
                            (comment.user?.firstName && comment.user?.lastName
                              ? `${comment.user.firstName} ${comment.user.lastName}`
                              : comment.user?.firstName ||
                                comment.user?.lastName ||
                                "Anonymous")}
                        </span>
                        <span className="text-sm text-slate-500 font-light">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-base font-light">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
                  <MessageCircle size={32} className="text-slate-400" />
                </div>
                <h4 className="text-xl font-semibold text-slate-900 mb-3">
                  Start the conversation
                </h4>
                <p className="text-slate-600 font-light max-w-md mx-auto">
                  Be the first to share your thoughts and insights about this
                  article
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ArticleDetails;
