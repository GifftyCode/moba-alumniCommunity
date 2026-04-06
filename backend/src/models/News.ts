import mongoose, { Document, Schema } from "mongoose";

export interface INews extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  category: "news" | "gist" | "community" | "announcement";
  author: mongoose.Types.ObjectId;
  isApproved: boolean;
  isFeatured: boolean;
  image: string;
  tags: string[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ["news", "gist", "community", "announcement"],
      default: "news",
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isApproved: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    image: { type: String, default: "" },
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model<INews>("News", NewsSchema);
