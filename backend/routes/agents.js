// routes/agents.js
const express = require('express');
const bcrypt = require('bcrypt');
const Agent = require('../models/agent');
const auth = require('../middleware/auth');
const router = express.Router();

// Create Agent
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    if(!name || !email || !mobile || !password) return res.status(400).json({ message: 'All fields required' });

    const exists = await Agent.findOne({ email });
    if(exists) return res.status(400).json({ message: 'Agent email already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const agent = await Agent.create({ name, email, mobile, passwordHash });
    res.json({ message: 'Agent added', agent });
  } catch(err){
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

// Get agents
router.get('/', auth, async (req, res) => {
  try {
    const agents = await Agent.find().select('-passwordHash').lean();
    res.json(agents);
  } catch(err){
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

module.exports = router;
