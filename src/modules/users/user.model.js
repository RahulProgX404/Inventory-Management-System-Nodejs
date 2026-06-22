import mongoose from "mongoose";
import { UserRole } from "../../utils/enum.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    isActive: { type: Boolean, default: true, index: true },
    refreshTokenHash: {
      type: String,
      select: false,
    },
    lastLoginAt: Date,
    passwordChangedAt: Date,
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });

const User = mongoose.model("User", userSchema);
export default User;
