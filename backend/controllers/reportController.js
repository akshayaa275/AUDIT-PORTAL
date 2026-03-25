const Report = require('../models/Report');
const Audit = require('../models/Audit');
const logActivity = require('../utils/logger');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Auditor or Admin
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('audit', 'title department')
            .populate('generatedBy', 'name');
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private/Auditor or Admin
exports.createReport = async (req, res) => {
    const { title, audit, type, fileUrl } = req.body;

    try {
        const report = await Report.create({
            title,
            audit,
            type,
            fileUrl,
            generatedBy: req.user._id
        });

        await logActivity(req.user._id, 'CREATE', 'Report', report._id, `Generated ${type} report for audit ${audit}`);

        res.status(201).json(report);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        await logActivity(req.user._id, 'DELETE', 'Report', report._id, `Deleted report: ${report.title}`);
        res.json({ message: 'Report deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
