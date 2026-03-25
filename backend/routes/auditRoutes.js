const express = require('express');
const router = express.Router();
const { getAudits, createAudit, getAuditById, updateAudit, deleteAudit } = require('../controllers/auditController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAudits)
  .post(authorize('Admin', 'Auditor'), createAudit);

router.route('/:id')
  .get(getAuditById)
  .put(authorize('Admin', 'Auditor'), updateAudit)
  .delete(authorize('Admin'), deleteAudit);

module.exports = router;
