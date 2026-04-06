import { Request, Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

// @desc    Get all approved alumni (public)
// @route   GET /api/alumni
export const getAllAlumni = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      name,
      department,
      graduationYear,
      location,
      page = 1,
      limit = 12,
    } = req.query;

    const query: Record<string, unknown> = {
      isApproved: true,
      role: "alumni",
      isProfilePublic: true,
    };

    if (name) {
      query.$or = [
        { firstName: { $regex: name, $options: "i" } },
        { lastName: { $regex: name, $options: "i" } },
      ];
    }
    if (department) query.department = { $regex: department, $options: "i" };
    if (graduationYear) query.graduationYear = Number(graduationYear);
    if (location) query.location = { $regex: location, $options: "i" };

    const total = await User.countDocuments(query);
    const alumni = await User.find(query)
      .select("-password -email -phone")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      count: alumni.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: alumni,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// @desc    Get single alumni profile (public)
// @route   GET /api/alumni/:id
export const getAlumniById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const alumni = await User.findOne({
      _id: req.params.id,
      isApproved: true,
      isProfilePublic: true,
    }).select("-password -email -phone");

    if (!alumni) {
      res.status(404).json({ success: false, message: "Alumni not found" });
      return;
    }

    res.json({ success: true, data: alumni });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// @desc    Get featured alumni (public)
// @route   GET /api/alumni/featured
export const getFeaturedAlumni = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const alumni = await User.find({
      isApproved: true,
      role: "alumni",
      isProfilePublic: true,
    })
      .select("-password -email -phone")
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({ success: true, data: alumni });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// @desc    Update own profile
// @route   PUT /api/alumni/profile
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const allowedFields = [
      "firstName",
      "lastName",
      "department",
      "graduationYear",
      "currentJob",
      "currentCompany",
      "location",
      "phone",
      "bio",
      "linkedin",
      "twitter",
      "achievements",
      "isProfilePublic",
    ];

    const updates: Record<string, unknown> = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password");

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// @desc    Get all departments (for search filters)
// @route   GET /api/alumni/departments
export const getDepartments = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const departments = await User.distinct("department", {
      isApproved: true,
      department: { $ne: "" },
    });
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// @desc    Get all graduation years (for search filters)
// @route   GET /api/alumni/graduation-years
export const getGraduationYears = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const years = await User.distinct("graduationYear", {
      isApproved: true,
      graduationYear: { $ne: null },
    });
    res.json({ success: true, data: years.sort((a, b) => b - a) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
