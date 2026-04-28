// routes/distributions.js
const express = require('express');
const auth = require('../middleware/auth');
const Distribution = require('../models/distribution');
const Agent = require('../models/agent');
const LeadItem = require('../models/leaditem');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    // Get latest distribution (maybe last upload). We'll return all distributions grouped by agent.
    // Option 1: group by agent for the latest sourceFileName. For simplicity, return all distributions with populated fields.
    const dists = await Distribution.find().populate('agent', '-passwordHash').populate('items').sort({ uploadedAt: -1 }).lean();
    res.json(dists);
  } catch(err){
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

module.exports = router;
