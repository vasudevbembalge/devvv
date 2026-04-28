// models/Distribution.js
const mongoose = require('mongoose');

const DistributionSchema = new mongoose.Schema({
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Leaditem' }],
  uploadedAt: { type: Date, default: Date.now },
  sourceFileName: { type: String }
});

module.exports = mongoose.model('Distribution', DistributionSchema);
