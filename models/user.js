import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  lastIp: {
    type: String,
    required: true,
  },
  tries: { 
    type: Number, 
    default: 0 
  },
  isBlocked: { 
    type: Boolean, 
    default: false 
  },
});

export const User = mongoose.model("User", userSchema);
