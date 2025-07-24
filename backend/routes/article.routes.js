// routes/article.routes.js
import { Router } from "express";
import {
  createArticle,
  getAllArticles,
  getSingleArticle,
  getMyArticles,
  updateArticle,
  deleteArticle,
  toggleLike,
  addComment,
} from "../controllers/article.controller.js";
import { authentication } from "../middleware/auth.js";

const router = Router();

router.use(authentication);

router.post("/", createArticle);
router.get("/", getAllArticles);
router.get("/my", getMyArticles);
router.get("/:articleId", getSingleArticle);
router.patch("/:articleId", updateArticle);
router.delete("/:articleId", deleteArticle);
router.post("/:articleId/like", toggleLike);
router.post("/:articleId/comment", addComment);

export default router;
