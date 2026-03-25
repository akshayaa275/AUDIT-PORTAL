const Audit = require('../models/Audit');
const logActivity = require('../utils/logger');

// @desc    Get all audits
// @route   GET /api/audits
// @access  Private
exports.getAudits = async (req, res) => {
  try {
    const audits = await Audit.find().populate('auditor', 'name email');
    res.json(audits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a new audit
// @route   POST /api/audits
// @access  Private/Admin
exports.createAudit = async (req, res) => {
  const { title, description, auditor, department, startDate, endDate, scope, riskLevel, team } = req.body;

  try {
    const audit = await Audit.create({
      title,
      description,
      auditor,
      department,
      startDate,
      endDate,
      scope,
      riskLevel,
      team
    });

    res.status(201).json(audit);

    // Async logging - don't block response
    if (req.user && req.user._id) {
      logActivity(req.user._id, 'CREATE', 'Audit', audit._id, `Created audit: ${title}`).catch(err => {
        console.error('Logging failed:', err);
      });
    }
  } catch (err) {
    console.error('CRITICAL: AUDIT CREATION FAILED', err);
    res.status(500).json({
      message: err.message || 'Validation failed. Please check your inputs.',
      error: err.errors ? Object.keys(err.errors).map(k => err.errors[k].message) : null
    });
  }
};

// @desc    Get audit by ID
// @route   GET /api/audits/:id
// @access  Private
exports.getAuditById = async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.id)
      .populate('auditor', 'name email')
      .populate({
        path: 'findings',
        populate: { path: 'correctiveAction' }
      });

    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }
    res.json(audit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update audit
// @route   PUT /api/audits/:id
// @access  Private/Admin or Auditor
exports.updateAudit = async (req, res) => {
  try {
    const audit = await Audit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }

    await logActivity(req.user._id, 'UPDATE', 'Audit', audit._id, `Updated audit: ${audit.title}`);

    res.json(audit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete audit
// @route   DELETE /api/audits/:id
// @access  Private/Admin
exports.deleteAudit = async (req, res) => {
  try {
    const audit = await Audit.findByIdAndDelete(req.params.id);
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }

    await logActivity(req.user._id, 'DELETE', 'Audit', audit._id, `Deleted audit: ${audit.title}`);

    res.json({ message: 'Audit deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
