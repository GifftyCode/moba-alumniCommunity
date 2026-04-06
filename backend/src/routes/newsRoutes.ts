import express from "express";
import {
  getAllNews,
  getNewsById,
  createNews,
  getFeaturedNews,
  getMyPosts,
  updateNews,
} from "../controllers/newsController";
import { protect, approvedOnly } from "../middleware/auth";

const router = express.Router();

router.get("/", getAllNews);
router.get("/featured", getFeaturedNews);
router.get("/my-posts", protect, getMyPosts);
router.get("/:id", getNewsById);
router.post("/", protect, approvedOnly, createNews);
router.put("/:id", protect, approvedOnly, updateNews);

export default router;
