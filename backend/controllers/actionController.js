const CorrectiveAction = require('../models/CorrectiveAction');
const Finding = require('../models/Finding');
const logActivity = require('../utils/logger');

// @desc    Assign corrective action to a finding
// @route   POST /api/corrective-actions
// @access  Private/Auditor or Admin
exports.assignAction = async (req, res) => {
  const { title, finding, actionPlan, assignedTo, dueDate, urgency } = req.body;

  try {
    const action = await CorrectiveAction.create({
      title,
      finding,
      actionPlan,
      assignedTo,
      dueDate,
      urgency
    });

    // Update Finding with this action
    await Finding.findByIdAndUpdate(finding, { correctiveAction: action._id });

    await logActivity(req.user._id, 'CREATE', 'CorrectiveAction', action._id, `Assigned action for finding ${finding}`);

    res.status(201).json(action);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update corrective action (Employee response or Auditor completion)
// @route   PUT /api/corrective-actions/:id
// @access  Private
exports.updateAction = async (req, res) => {
  const { status, comment } = req.body;

  try {
    const action = await CorrectiveAction.findById(req.params.id);
    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }

    if (status) action.status = status;
    if (comment) {
      action.comments.push({
        user: req.user._id,
        text: comment
      });
    }

    if (status === 'Completed') {
      action.completionDate = Date.now();
    }

    await action.save();

    await logActivity(req.user._id, 'UPDATE', 'CorrectiveAction', action._id, `Updated action status to ${status}`);

    res.json(action);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    get all corrective actions for user
// @route   GET /api/corrective-actions
// @access  Private
exports.getActions = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Employee') {
      query = { assignedTo: req.user._id };
    }

    const actions = await CorrectiveAction.find(query)
      .populate('finding', 'title')
      .populate('assignedTo', 'name email');

    res.json(actions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
