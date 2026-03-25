const express = require('express');
const router = express.Router();
const { getFindings, addFinding, getFindingById, updateFinding } = require('../controllers/findingController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.get('/', getFindings);
router.post('/', authorize('Admin', 'Auditor'), upload.array('evidence', 5), addFinding);
router.get('/:id', getFindingById);
router.put('/:id', authorize('Admin', 'Auditor'), updateFinding);

module.exports = router;
