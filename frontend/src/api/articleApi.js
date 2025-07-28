import api from "@/lib/axios";

// Get all articles with optional filters
export const getArticles = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append("search", params.search);
    if (params.category) queryParams.append("category", params.category);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.status) queryParams.append("status", params.status);
    if (params.author) queryParams.append("author", params.author);

    console.log(
      "🐛 DEBUG - API request URL:",
      `/article?${queryParams.toString()}`
    );
    console.log("🐛 DEBUG - API request params:", params);

    const response = await api.get(`/article?${queryParams.toString()}`);

    console.log("� DEBUG - API response status:", response.status);
    console.log("🐛 DEBUG - API response data:", response.data);
    console.log("�📰 Articles fetched successfully:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching articles:", error);
    console.error("❌ Error details:", error.response?.data);
    throw error;
  }
};

// Get single article by ID
export const getArticleById = async (articleId) => {
  try {
    const response = await api.get(`/article/${articleId}`);
    console.log("📰 Article fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching article:", error);
    throw error;
  }
};

// Create new article
export const createArticle = async (articleData) => {
  try {
    const response = await api.post("/article", articleData);
    console.log("📰 Article created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating article:", error);
    throw error;
  }
};

// Update article
export const updateArticle = async (articleId, articleData) => {
  try {
    const response = await api.patch(`/article/${articleId}`, articleData);
    console.log("📰 Article updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating article:", error);
    throw error;
  }
};

// Delete article
export const deleteArticle = async (articleId) => {
  try {
    const response = await api.delete(`/article/${articleId}`);
    console.log("📰 Article deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting article:", error);
    throw error;
  }
};

// Like/unlike article
export const toggleArticleLike = async (articleId) => {
  try {
    const response = await api.post(`/article/${articleId}/like`);
    console.log("👍 Article like toggled successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error toggling article like:", error);
    throw error;
  }
};

// Add comment to article
export const addArticleComment = async (articleId, commentData) => {
  try {
    const response = await api.post(
      `/article/${articleId}/comment`,
      commentData
    );
    console.log("💬 Comment added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    throw error;
  }
};

// Get article comments
export const getArticleComments = async (articleId) => {
  try {
    const response = await api.get(`/article/${articleId}/comments`);
    console.log("💬 Comments fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    throw error;
  }
};

// Update article status (published, draft, archived)
export const updateArticleStatus = async (articleId, status) => {
  try {
    const response = await api.patch(`/article/${articleId}/status`, {
      status,
    });
    console.log("📰 Article status updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating article status:", error);
    throw error;
  }
};

// Get trending articles
export const getTrendingArticles = async (limit = 5) => {
  try {
    const response = await api.get(`/article/trending?limit=${limit}`);
    console.log("🔥 Trending articles fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching trending articles:", error);
    throw error;
  }
};

// Get articles by category
export const getArticlesByCategory = async (category, limit = 10) => {
  try {
    const response = await api.get(
      `/article/category/${category}?limit=${limit}`
    );
    console.log("📂 Articles by category fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching articles by category:", error);
    throw error;
  }
};

// Search articles
export const searchArticles = async (query, filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("q", query);

    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const response = await api.get(`/article/search?${queryParams.toString()}`);
    console.log("🔍 Article search completed successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error searching articles:", error);
    throw error;
  }
};

// Toggle like on article
export const toggleLike = async (articleId) => {
  try {
    const response = await api.post(`/article/${articleId}/like`);
    console.log("👍 Article like toggled successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error toggling article like:", error);
    throw error;
  }
};

// Get user's own articles
export const getMyArticles = async () => {
  try {
    const response = await api.get("/article/my");
    console.log("📰 My articles fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching my articles:", error);
    throw error;
  }
};

// Add comment to article
export const addComment = async (articleId, commentData) => {
  try {
    const response = await api.post(
      `/article/${articleId}/comment`,
      commentData
    );
    console.log("💬 Comment added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    throw error;
  }
};

// Verify signup 2FA OTP
export const verifySignup2FA = async (userId, otp) => {
  const response = await api.post("/auth/verify-signup-2fa", { userId, otp });
  return response.data;
};
