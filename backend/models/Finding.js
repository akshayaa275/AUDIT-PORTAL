const mongoose = require('mongoose');

const findingSchema = new mongoose.Schema({
  audit: { type: mongoose.Schema.Types.ObjectId, ref: 'Audit', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  impact: { type: String },
  recommendation: { type: String },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  evidence: [{ type: String }], // URLs to files
  correctiveAction: { type: mongoose.Schema.Types.ObjectId, ref: 'CorrectiveAction' },
}, { timestamps: true });

module.exports = mongoose.model('Finding', findingSchema);
