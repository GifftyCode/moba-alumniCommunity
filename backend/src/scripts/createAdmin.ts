import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("Connected to database...");

  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    console.log("Admin already exists:", existingAdmin.email);
    process.exit(0);
  }

  const admin = await User.create({
    firstName: "Super",
    lastName: "Admin",
    email: "admin@alumni.com", // Change this to your email
    password: "Admin2024Secure", // Change this to your password
    role: "admin",
    isApproved: true,
  });

  console.log("Admin created successfully!");
  console.log(" Email:", admin.email);
  console.log(
    " Password is encrypted in database. Use what you set in the script.",
  );
  process.exit(0);
};

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
