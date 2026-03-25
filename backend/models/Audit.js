const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  auditor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: Date,
  scope: { type: String },
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  team: [{ type: String }],
  status: {
    type: String,
    enum: ['Planned', 'In-Progress', 'Completed', 'Cancelled'],
    default: 'Planned'
  },
  findings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Finding' }],
}, { timestamps: true });

module.exports = mongoose.model('Audit', auditSchema);
