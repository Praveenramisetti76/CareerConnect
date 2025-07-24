import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { toast } from "sonner";
import { createArticle } from "@/api/articleApi";
import useAuthStore from "@/store/userStore";

const CreateArticle = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    category: "",
    featuredImage: "",
    tags: "",
    status: "draft",
  });

  const categories = [
    "Interview Tips",
    "Resume Writing",
    "Career Development",
    "Industry Trends",
    "Job Search",
    "Networking",
    "Professional Skills",
    "Workplace Culture",
  ];

  const createArticleMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: (data) => {
      toast.success("Article created successfully!");
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      navigate("/recruiter/articles");
    },
    onError: (error) => {
      console.error("Error creating article:", error);
      toast.error(error?.response?.data?.message || "Failed to create article");
    },
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (status = "draft") => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Please enter article content");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    const articleData = {
      ...formData,
      status,
      tags: formData.tags
        ? formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
    };

    createArticleMutation.mutate(articleData);
  };

  const handleSaveDraft = () => {
    handleSubmit("draft");
  };

  const handlePublish = () => {
    handleSubmit("published");
  };

  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50"
      style={{ fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif' }}
    >
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/recruiter/articles")}
                className="group flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm border-slate-200/60 text-slate-700 hover:bg-white hover:border-slate-300/60 rounded-xl font-medium transition-all duration-200"
              >
                <ArrowLeft
                  size={16}
                  className="transition-transform group-hover:-translate-x-0.5"
                />
                Back to Articles
              </Button>
              <div>
                <div className="mb-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 backdrop-blur-sm text-slate-600 border border-slate-200/60 rounded-full font-medium text-sm tracking-wide">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                    Article Editor
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Create New Article
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={createArticleMutation.isPending}
                className="group flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-sm border-slate-200/60 text-slate-700 hover:bg-white hover:border-slate-300/60 rounded-xl font-medium transition-all duration-200"
              >
                <Save
                  size={16}
                  className="transition-transform group-hover:scale-110"
                />
                Save Draft
              </Button>
              <Button
                onClick={handlePublish}
                disabled={createArticleMutation.isPending}
                className="group relative overflow-hidden bg-slate-900 hover:bg-slate-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl font-medium"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2">
                  <Eye
                    size={16}
                    className="transition-transform group-hover:scale-110"
                  />
                  Publish Article
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title Input */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-8">
                <Label
                  htmlFor="title"
                  className="text-lg font-semibold text-slate-900 mb-4 block tracking-tight"
                >
                  Article Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter a compelling title that captures your reader's attention..."
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full text-2xl font-bold text-slate-900 placeholder:text-slate-400 border-0 bg-transparent focus:ring-0 px-0 py-4 leading-tight tracking-tight"
                />
                <div className="h-px bg-gradient-to-r from-slate-200 to-transparent mt-4"></div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-8">
                <Label
                  htmlFor="summary"
                  className="text-lg font-semibold text-slate-900 mb-4 block tracking-tight"
                >
                  Article Summary
                </Label>
                <Textarea
                  id="summary"
                  placeholder="Write a brief, engaging summary that will appear in article previews and search results..."
                  value={formData.summary}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                  rows={4}
                  className="w-full text-base text-slate-700 placeholder:text-slate-400 border-0 bg-transparent focus:ring-0 px-0 py-2 leading-relaxed resize-none"
                />
                <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
                  <span>Keep it concise and descriptive</span>
                  <span>{formData.summary.length}/200</span>
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
              <div className="border-b border-slate-200/60 px-8 py-6">
                <Label
                  htmlFor="content"
                  className="text-lg font-semibold text-slate-900 tracking-tight"
                >
                  Article Content
                </Label>
                <p className="text-sm text-slate-600 mt-2 font-light">
                  Write your article using Markdown syntax for rich formatting
                </p>
              </div>
              <div className="p-8">
                <Textarea
                  id="content"
                  placeholder="# Your Article Heading

Start writing your article here. You can use Markdown formatting:

- **Bold text** and *italic text*
- [Links](https://example.com)
- `Code snippets`

## Subheadings

Write engaging, informative content that provides value to your readers..."
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  rows={20}
                  className="w-full text-base text-slate-700 placeholder:text-slate-400 border-0 bg-transparent focus:ring-0 px-0 py-2 leading-relaxed font-light resize-none"
                />
                <div className="flex items-center justify-between mt-6 text-sm text-slate-500">
                  <div className="flex items-center gap-4">
                    <span>Markdown supported</span>
                    <span>•</span>
                    <span>
                      {Math.ceil(formData.content.length / 1000)} min read
                    </span>
                  </div>
                  <span>
                    {formData.content.length.toLocaleString()} characters
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Article Settings */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200/60 bg-gradient-to-r from-slate-50/80 to-zinc-50/80">
                <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                  Publishing Settings
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <Label
                    htmlFor="category"
                    className="text-sm font-semibold text-slate-700 mb-3 block tracking-wide uppercase"
                  >
                    Category
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger className="w-full h-12 bg-slate-50/50 border-slate-200/60 rounded-xl hover:border-slate-300/60 focus:border-slate-400 text-slate-900 font-medium transition-all duration-200">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 rounded-xl shadow-xl">
                      {categories.map((category) => (
                        <SelectItem
                          key={category}
                          value={category}
                          className="text-slate-700 hover:bg-slate-50 font-medium py-3"
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="tags"
                    className="text-sm font-semibold text-slate-700 mb-3 block tracking-wide uppercase"
                  >
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    placeholder="career, interview, tips"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    className="w-full h-12 bg-slate-50/50 border-slate-200/60 rounded-xl hover:border-slate-300/60 focus:border-slate-400 text-slate-900 font-medium transition-all duration-200"
                  />
                  <p className="text-xs text-slate-500 mt-2 font-light">
                    Separate multiple tags with commas
                  </p>
                  {formData.tags && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.split(",").map(
                        (tag, index) =>
                          tag.trim() && (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                            >
                              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                              #{tag.trim()}
                            </span>
                          )
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="featuredImage"
                    className="text-sm font-semibold text-slate-700 mb-3 block tracking-wide uppercase"
                  >
                    Featured Image
                  </Label>
                  <Input
                    id="featuredImage"
                    placeholder="https://example.com/image.jpg"
                    value={formData.featuredImage}
                    onChange={(e) =>
                      handleInputChange("featuredImage", e.target.value)
                    }
                    className="w-full h-12 bg-slate-50/50 border-slate-200/60 rounded-xl hover:border-slate-300/60 focus:border-slate-400 text-slate-900 font-medium transition-all duration-200"
                  />
                  <p className="text-xs text-slate-500 mt-2 font-light">
                    Add a compelling image to make your article stand out
                  </p>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {formData.featuredImage && (
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200/60 bg-gradient-to-r from-slate-50/80 to-zinc-50/80">
                  <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                    Image Preview
                  </h3>
                </div>
                <div className="p-6">
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={formData.featuredImage}
                      alt="Featured"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Author Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200/60 bg-gradient-to-r from-slate-50/80 to-zinc-50/80">
                <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                  Author
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-lg">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-lg tracking-tight">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-slate-600 font-light">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
