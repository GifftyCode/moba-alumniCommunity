import { Request, Response } from "express";
import News from "../models/News";
import { AuthRequest } from "../middleware/auth";

// @desc    Get all approved content (public)
// @route   GET /api/news
export const getAllNews = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const query: Record<string, unknown> = { isApproved: true };
    if (category) query.category = category;

    const total = await News.countDocuments(query);
    const news = await News.find(query)
      .populate("author", "firstName lastName profileImage department")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      count: news.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: news,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// @desc    Get single post
// @route   GET /api/news/:id
export const getNewsById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    ).populate(
      "author",
      "firstName lastName profileImage department graduationYear",
    );

    if (!news || !news.isApproved) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }

    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// @desc    Create post (alumni submits for approval)
// @route   POST /api/news
export const createNews = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { title, content, category, tags } = req.body;

    const news = await News.create({
      title,
      content,
      category,
      tags,
      author: req.user?._id,
      isApproved: false,
    });

    res.status(201).json({
      success: true,
      message: "Post submitted successfully! Awaiting admin approval.",
      data: news,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// @desc    Get featured posts
// @route   GET /api/news/featured
export const getFeaturedNews = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const news = await News.find({ isApproved: true, isFeatured: true })
      .populate("author", "firstName lastName profileImage")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// @desc    Get my posts
// @route   GET /api/news/my-posts
export const getMyPosts = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const posts = await News.find({ author: req.user?._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// @desc    Update own post
// @route   PUT /api/news/:id
export const updateNews = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const news = await News.findOne({
      _id: req.params.id,
      author: req.user?._id,
    });

    if (!news) {
      res
        .status(404)
        .json({ success: false, message: "Post not found or not yours" });
      return;
    }

    const updated = await News.findByIdAndUpdate(
      req.params.id,
      { ...req.body, isApproved: false },
      { new: true },
    );

    res.json({
      success: true,
      message: "Post updated and resubmitted for approval.",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
