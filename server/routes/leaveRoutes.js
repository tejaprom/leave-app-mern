// server/routes/leaveRoutes.js
const express = require('express');
const Leave = require('../models/Leave');
const router = express.Router();

// Create a new leave request
router.post('/', async (req, res) => {
  try {
    const leave = new Leave(req.body);
    const savedLeave = await leave.save();
    res.status(201).json(savedLeave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all leave requests
router.get('/', async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
