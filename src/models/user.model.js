import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    extraFields: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);