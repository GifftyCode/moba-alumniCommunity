import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
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

// ── CORS ──────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
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
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── Custom NoSQL Injection Sanitizer ─────────────────────────
const sanitizeInput = (obj: Record<string, unknown>): void => {
  for (const key in obj) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      sanitizeInput(obj[key] as Record<string, unknown>);
    }
  }
};

app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.body) sanitizeInput(req.body as Record<string, unknown>);
  next();
});

// ── Prevent HTTP param pollution ──────────────────────────────
app.use(hpp());

// ── Global Rate Limiter ───────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", globalLimiter);

// ── Auth Rate Limiter ─────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
