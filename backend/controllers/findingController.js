const Finding = require('../models/Finding');
const Audit = require('../models/Audit');
const logActivity = require('../utils/logger');

// @desc    Get all findings
// @route   GET /api/findings
// @access  Private
exports.getFindings = async (req, res) => {
  try {
    const findings = await Finding.find()
      .populate('audit', 'title department')
      .populate('correctiveAction');
    res.json(findings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add a finding to an audit
// @route   POST /api/findings
// @access  Private/Auditor or Admin
exports.addFinding = async (req, res) => {
  const { title, description, severity, status, audit, impact, recommendation } = req.body;
  const evidence = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

  try {
    const finding = await Finding.create({
      title,
      description,
      severity,
      status,
      audit,
      impact,
      recommendation,
      evidence
    });

    // Update Audit with this finding
    await Audit.findByIdAndUpdate(audit, { $push: { findings: finding._id } });

    await logActivity(req.user._id, 'CREATE', 'Finding', finding._id, `Added finding: ${title} to audit ${audit}`);

    res.status(201).json(finding);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get finding by ID
// @route   GET /api/findings/:id
// @access  Private
exports.getFindingById = async (req, res) => {
  try {
    const finding = await Finding.findById(req.params.id)
      .populate('audit', 'title')
      .populate('correctiveAction');

    if (!finding) {
      return res.status(404).json({ message: 'Finding not found' });
    }
    res.json(finding);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update finding
// @route   PUT /api/findings/:id
// @access  Private/Auditor or Admin
exports.updateFinding = async (req, res) => {
  try {
    const finding = await Finding.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!finding) {
      return res.status(404).json({ message: 'Finding not found' });
    }

    await logActivity(req.user._id, 'UPDATE', 'Finding', finding._id, `Updated finding: ${finding.title}`);

    res.json(finding);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
