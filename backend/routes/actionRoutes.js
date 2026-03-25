const express = require('express');
const router = express.Router();
const { assignAction, updateAction, getActions } = require('../controllers/actionController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('Admin', 'Auditor'), assignAction);
router.get('/', getActions);
router.put('/:id', updateAction);

module.exports = router;
