// routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const csvParser = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const LeadItem = require('../models/leaditem');
const Distribution = require('../models/distribution');
const Agent = require('../models/agent');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

// Only accept csv, xls, xlsx
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.csv', '.xls', '.xlsx'];
    const ext = file.originalname.slice(file.originalname.lastIndexOf('.'));
    if (!allowed.includes(ext)) return cb(new Error('Only CSV, XLS, XLSX allowed'));
    cb(null, true);
  }
});

// Upload route
router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const filePath = req.file.path;
  let items = [];

  try {
    // Parse CSV
    if (filePath.endsWith('.csv')) {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', row => results.push(row))
        .on('end', async () => {
          items = results;
          await distributeItems(items, req.file.originalname, res);
          fs.unlinkSync(filePath);
        });
    } else { // Parse Excel
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      items = xlsx.utils.sheet_to_json(sheet);
      await distributeItems(items, req.file.originalname, res);
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error processing file' });
  }
});

// Function to distribute items
async function distributeItems(items, fileName, res) {
  if (!items.length) return res.status(400).json({ message: 'No data in file' });

  // Validate required columns
  for (const row of items) {
    if (!row.FirstName || !row.Phone) {
      return res.status(400).json({ message: 'CSV must contain FirstName and Phone columns' });
    }
  }

  // Insert LeadItems
  const leadItemsData = items.map((row, idx) => ({
    firstName: row.FirstName,
    phone: row.Phone,
    notes: row.Notes || '',
    originalIndex: idx
  }));
  const leadItems = await LeadItem.insertMany(leadItemsData);

  // Fetch all agents
  const agents = await Agent.find();
  if (!agents.length) return res.status(400).json({ message: 'No agents found' });

  // Round-robin distribution
  const totalAgents = agents.length;
  const distributionMap = {}; // agentId -> LeadItemIds array
  agents.forEach(agent => distributionMap[agent._id] = []);

  leadItems.forEach((item, idx) => {
    const agent = agents[idx % totalAgents]; // modulo for sequential assignment
    distributionMap[agent._id].push(item._id);
  });

  // Save distributions
  const distributionPromises = Object.keys(distributionMap).map(agentId => 
    Distribution.create({
      agent: agentId,
      items: distributionMap[agentId],
      sourceFileName: fileName
    })
  );

  await Promise.all(distributionPromises);

  res.json({ message: 'Uploaded and distributed successfully', totalItems: leadItems.length });
}

module.exports = router;
