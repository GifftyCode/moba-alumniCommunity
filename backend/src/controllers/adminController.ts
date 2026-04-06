import { Request, Response } from "express";
import User from "../models/User";
import News from "../models/News";

// @desc    Get all pending alumni registrations
// @route   GET /api/admin/pending-alumni
export const getPendingAlumni = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const alumni = await User.find({ isApproved: false, role: "alumni" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: alumni.length, data: alumni });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// @desc    Approve or reject alumni
// @route   PUT /api/admin/alumni/:id/approve
export const approveAlumni = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { approve } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: approve },
      { new: true },
    ).select("-password");

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({
      success: true,
      message: approve ? "Alumni approved successfully" : "Alumni rejected",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// @desc    Get all pending content
// @route   GET /api/admin/pending-content
export const getPendingContent = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const content = await News.find({ isApproved: false })
      .populate("author", "firstName lastName email")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: content.length, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// @desc    Approve or reject content
// @route   PUT /api/admin/content/:id/approve
export const approveContent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { approve, isFeatured } = req.body;
    const content = await News.findByIdAndUpdate(
      req.params.id,
      { isApproved: approve, isFeatured: isFeatured || false },
      { new: true },
    );

    if (!content) {
      res.status(404).json({ success: false, message: "Content not found" });
      return;
    }

    res.json({
      success: true,
      message: approve ? "Content approved" : "Content rejected",
      data: content,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalAlumni,
      pendingAlumni,
      totalNews,
      pendingNews,
      totalGists,
      totalAnnouncements,
    ] = await Promise.all([
      User.countDocuments({ role: "alumni", isApproved: true }),
      User.countDocuments({ role: "alumni", isApproved: false }),
      News.countDocuments({ category: "news", isApproved: true }),
      News.countDocuments({ isApproved: false }),
      News.countDocuments({ category: "gist", isApproved: true }),
      News.countDocuments({ category: "announcement", isApproved: true }),
    ]);

    res.json({
      success: true,
      data: {
        totalAlumni,
        pendingAlumni,
        totalNews,
        pendingNews,
        totalGists,
        totalAnnouncements,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// @desc    Get all alumni (admin view - sees everything)
// @route   GET /api/admin/all-alumni
export const getAllAlumniAdmin = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const alumni = await User.find({ role: "alumni" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: alumni.length, data: alumni });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/alumni/:id
export const deleteAlumni = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// @desc    Delete content
// @route   DELETE /api/admin/content/:id
export const deleteContent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Content deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
