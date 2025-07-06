// server/models/Leave.js
const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      // Add this too for convenience (optional)
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    leaveType: {
      type: String,
      required: true,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    attachment: {
      type: String, // File path
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", leaveSchema);
