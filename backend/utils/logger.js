const ActivityLog = require('../models/ActivityLog');

const logActivity = async (user, action, entity, entityId, details, ipAddress) => {
  try {
    await ActivityLog.create({
      user,
      action,
      entity,
      entityId,
      details,
      ipAddress
    });
  } catch (err) {
    console.error('Error logging activity:', err);
  }
};

module.exports = logActivity;
