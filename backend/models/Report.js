const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  audit: { type: mongoose.Schema.Types.ObjectId, ref: 'Audit', required: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  type: { type: String, enum: ['PDF', 'Excel'], default: 'PDF' },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
