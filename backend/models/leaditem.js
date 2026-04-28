// models/LeadItem.js
const mongoose = require('mongoose');

const LeadItemSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String },
  originalIndex: { type: Number } // position in the uploaded CSV
}, { timestamps: true });

module.exports = mongoose.model('Leaditem', LeadItemSchema);
