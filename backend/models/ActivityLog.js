const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  entity: { type: String }, // e.g., 'Audit', 'Finding'
  entityId: { type: mongoose.Schema.Types.ObjectId },
  details: { type: String },
  ipAddress: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
