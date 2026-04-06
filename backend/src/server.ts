import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import alumniRoutes from "./routes/alumniRoutes";
import newsRoutes from "./routes/newsRoutes";
import adminRoutes from "./routes/adminRoutes";

dotenv.config();
connectDB();

const app: Application = express();

// ── Security Headers ──────────────────────────────────────────
app.use(helmet());

// ── CORS — only allow your frontend ──────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL as string,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// ── Body Parsers ──────────────────────────────────────────────
app.use(express.json({ limit: "10kb" })); // Block oversized payloads
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── Sanitize inputs (prevent NoSQL injection) ─────────────────
app.use(mongoSanitize());

// ── Prevent HTTP param pollution ──────────────────────────────
app.use(hpp());

// ── Global Rate Limiter ───────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", globalLimiter);

// ── Strict Rate Limiter for Auth routes ───────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Only 10 login/register attempts per 15 mins
  message: {
    success: false,
    message: "Too many attempts, please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/admin", adminRoutes);

// ── Health Check ──────────────────────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ── 404 Handler ───────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
