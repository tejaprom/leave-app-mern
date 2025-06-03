// server/routes/leaveRoutes.js
const express = require("express");
const Leave = require("../models/Leave");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const multer = require("multer");
const path = require("path");

// Get all leave requests
// router.get('/', async (req, res) => {
//   try {
//     const leaves = await Leave.find().sort({ createdAt: -1 });
//     res.json(leaves);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.get("/getleaves", protect, async (req, res) => {
  try {
    let leaves;

    if (req.user.role === "manager") {
      // Manager sees all
      leaves = await Leave.find().sort({ createdAt: -1 });
    } else {
      // Employee sees only their own
      leaves = await Leave.find({ name: req.user.name }).sort({
        createdAt: -1,
      });
    }

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // store files in server/uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });

// Create a new leave request
router.post("/applyleave", protect, upload.single("attachment"), async (req, res) => {
  try {
    const { reason, fromDate, toDate, leaveType } = req.body;
    const attachment = req.file ? req.file.filename : "";

    const leave = new Leave({
      name: req.user.name,
      reason,
      fromDate,
      toDate,
      leaveType,
      attachment,
    });

    const savedLeave = await leave.save();
    res.status(201).json(savedLeave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update leave status (for managers)
router.put("/updateleave/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (req.user.role !== "manager") {
      return res.status(403).json({ error: "Access denied" });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ error: "Leave not found" });
    }

    leave.status = status;
    await leave.save();

    res.json(leave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
