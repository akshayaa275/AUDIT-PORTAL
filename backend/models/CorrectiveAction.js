const mongoose = require('mongoose');

const correctiveActionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  finding: { type: mongoose.Schema.Types.ObjectId, ref: 'Finding', required: true },
  actionPlan: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Overdue'], default: 'Pending' },
  urgency: { type: String, enum: ['Low', 'Medium', 'High', 'Immediate'], default: 'Medium' },
  completionDate: { type: Date },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('CorrectiveAction', correctiveActionSchema);
