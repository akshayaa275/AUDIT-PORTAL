const express = require('express');
const router = express.Router();
const { getReports, createReport, deleteReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('Admin', 'Auditor'), getReports);
router.post('/', authorize('Admin', 'Auditor'), createReport);
router.delete('/:id', authorize('Admin'), deleteReport);

module.exports = router;
