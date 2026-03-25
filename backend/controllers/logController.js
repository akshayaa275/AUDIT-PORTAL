const ActivityLog = require('../models/ActivityLog');

// @desc    Get all activity logs
// @route   GET /api/activity-logs
// @access  Private/Admin
exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
