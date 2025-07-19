// routes/article.routes.js
import { Router } from "express";
import {
  createArticle,
  getAllArticles,
  getSingleArticle,
  getMyArticles,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";
import { authentication } from "../middleware/auth.js";

const router = Router();

router.use(authentication);

router.post("/post", createArticle);
router.get("/", getAllArticles);
router.get("/my", authentication, getMyArticles);
router.get("/:articleId", getSingleArticle);
router.patch("/:articleId", updateArticle);
router.delete("/:articleId", deleteArticle);

export default router;
