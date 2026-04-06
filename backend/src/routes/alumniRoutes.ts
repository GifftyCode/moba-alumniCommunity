import express from "express";
import {
  getAllAlumni,
  getAlumniById,
  getFeaturedAlumni,
  updateProfile,
  getDepartments,
  getGraduationYears,
} from "../controllers/alumniController";
import { protect, approvedOnly } from "../middleware/auth";

const router = express.Router();

router.get("/", getAllAlumni);
router.get("/featured", getFeaturedAlumni);
router.get("/departments", getDepartments);
router.get("/graduation-years", getGraduationYears);
router.get("/:id", getAlumniById);
router.put("/profile", protect, approvedOnly, updateProfile);

export default router;
