import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

// Protect routes - must be logged in
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Not authorized. Please log in." });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res
        .status(401)
        .json({ success: false, message: "Account no longer exists." });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res
        .status(401)
        .json({
          success: false,
          message: "Session expired. Please log in again.",
        });
    } else {
      res
        .status(401)
        .json({
          success: false,
          message: "Invalid token. Please log in again.",
        });
    }
  }
};

// Admin only
export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== "admin") {
    res
      .status(403)
      .json({ success: false, message: "Access denied. Admins only." });
    return;
  }
  next();
};

// Approved alumni only
export const approvedOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user?.isApproved && req.user?.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Your account is pending admin approval.",
    });
    return;
  }
  next();
};
