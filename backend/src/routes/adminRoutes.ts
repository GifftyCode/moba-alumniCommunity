import express from "express";
import {
  getPendingAlumni,
  approveAlumni,
  getPendingContent,
  approveContent,
  getStats,
  getAllAlumniAdmin,
  deleteAlumni,
  deleteContent,
} from "../controllers/adminController";
import { protect, adminOnly } from "../middleware/auth";

const router = express.Router();

router.use(protect, adminOnly); // All admin routes require login + admin role

router.get("/stats", getStats);
router.get("/pending-alumni", getPendingAlumni);
router.get("/all-alumni", getAllAlumniAdmin);
router.put("/alumni/:id/approve", approveAlumni);
router.delete("/alumni/:id", deleteAlumni);
router.get("/pending-content", getPendingContent);
router.put("/content/:id/approve", approveContent);
router.delete("/content/:id", deleteContent);

export default router;
