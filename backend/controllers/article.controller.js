import Article from "../models/Article.js";
import { AppError } from "../utils/AppError.js";
import { catchAndWrap } from "../utils/catchAndWrap.js";
import {
  createArticleSchema,
  updateArticleSchema,
  getArticleSchema,
} from "../zodSchema/article.validation.js";

export const createArticle = async (req, res) => {
  const parsed = createArticleSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError("Validation failed", 400, parsed.error.errors);
  }

  //   console.log(parsed.data, req.user.id);

  const article = await catchAndWrap(
    () =>
      Article.create({
        ...parsed.data,
        authorType: req.user.company ? "company" : "user",
        author: req.user.id,
      }),
    "Failed to create article"
  );

  res.status(201).json(article);
};

export const getMyArticles = async (req, res) => {
  const articles = await catchAndWrap(
    () => Article.find({ author: req.user._id }),
    "Failed to fetch your articles"
  );

  res.status(200).json(articles);
};

export const getAllArticles = async (req, res) => {
  const { filter, skip, limit, sort } = buildQueryOptions(req.query);

  const articles = await catchAndWrap(
    () =>
      Article.find(filter)
        .populate("author", "name email")
        .skip(skip)
        .limit(limit)
        .sort(sort),
    "Failed to fetch articles"
  );

  res.status(200).json(articles);
};

export const getSingleArticle = async (req, res) => {
  const parsed = getArticleSchema.safeParse(req.params);
  if (!parsed.success) {
    throw new AppError("Invalid article ID", 400, parsed.error.errors);
  }

  const article = await catchAndWrap(
    () =>
      Article.findById(parsed.data.articleId).populate("author", "name email"),
    "Failed to fetch article"
  );

  if (!article) throw new AppError("Article not found", 404);
  res.status(200).json(article);
};

export const updateArticle = async (req, res) => {
  const parsed = updateArticleSchema.safeParse({
    params: req.params,
    body: req.body,
  });

  if (!parsed.success) {
    throw new AppError("Validation failed", 400, parsed.error.errors);
  }
  const { articleId } = parsed.data.params;
  const updateData = parsed.data.body;

  const article = await catchAndWrap(
    () =>
      Article.findOneAndUpdate(
        { _id: articleId, author: req.user._id },
        updateData,
        { new: true }
      ),
    "Failed to update article"
  );

  if (!article) throw new AppError("Article not found or unauthorized", 404);
  res.status(200).json(article);
};

export const deleteArticle = async (req, res) => {
  const parsed = getArticleSchema.safeParse(req.params);
  if (!parsed.success) {
    throw new AppError("Invalid article ID", 400, parsed.error.errors);
  }

  const deleted = await catchAndWrap(
    () =>
      Article.findOneAndDelete({
        _id: parsed.data.articleId,
        author: req.user._id,
      }),
    "Failed to delete article"
  );

  if (!deleted) throw new AppError("Article not found or unauthorized", 404);

  res.status(200).json({ message: "Article deleted successfully" });
};
