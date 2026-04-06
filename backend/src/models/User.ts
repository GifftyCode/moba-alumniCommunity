import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "alumni" | "admin";
  isApproved: boolean;
  profileImage: string;
  department: string;
  graduationYear: number;
  currentJob: string;
  currentCompany: string;
  location: string;
  phone: string;
  bio: string;
  linkedin: string;
  twitter: string;
  achievements: string[];
  isProfilePublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["alumni", "admin"], default: "alumni" },
    isApproved: { type: Boolean, default: false },
    profileImage: { type: String, default: "" },
    department: { type: String, trim: true, default: "" },
    graduationYear: { type: Number, default: null },
    currentJob: { type: String, trim: true, default: "" },
    currentCompany: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "" },
    linkedin: { type: String, trim: true, default: "" },
    twitter: { type: String, trim: true, default: "" },
    achievements: [{ type: String }],
    isProfilePublic: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
