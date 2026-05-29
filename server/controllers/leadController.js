const Lead = require('../models/Lead');
const { validateLeadInput } = require('../validators/leadValidator');
const { logActivity } = require('../services/activityService');

// @desc    Get all leads (Admin/Manager see all, Sales reps see only assigned)
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res, next) => {
  try {
    const { search, status, source, limit, sort } = req.query;
    let query;

    if (req.user.role === 'admin' || req.user.role === 'manager') {
      query = Lead.find().populate('assignedTo', 'name email role');
    } else {
      query = Lead.find({ assignedTo: req.user.id }).populate('assignedTo', 'name email role');
    }

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query = query.find({ $or: [{ name: regex }, { email: regex }] });
    }

    if (status) {
      query = query.find({ status });
    }

    if (source) {
      query = query.find({ source });
    }

    if (sort) {
      query = query.sort(sort);
    } else {
      query = query.sort({ createdAt: -1 });
    }

    if (limit && Number(limit) > 0) {
      query = query.limit(Number(limit));
    }

    const leads = await query;

    res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead details
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email role');

    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    // Role check: Sales reps can only view their own leads
    if (req.user.role === 'sales' && lead.assignedTo._id.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to access this lead record');
    }

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res, next) => {
  try {
    // Validate inputs
    const { errors, isValid } = validateLeadInput(req.body);
    if (!isValid) {
      res.status(400);
      return res.json({ success: false, errors });
    }

    const { name, email, phone, source, status, notes, followUpDate, assignedTo } = req.body;

    // Default assignment to creator if none specified
    const leadAssignment = assignedTo || req.user.id;

    const lead = await Lead.create({
      name,
      email,
      phone,
      source,
      status,
      notes,
      followUpDate,
      assignedTo: leadAssignment,
    });

    // Create Audit Activity Trail
    await logActivity(
      lead._id,
      req.user.id,
      'creation',
      `Lead initialized and assigned to user ${leadAssignment}`
    );

    res.status(201).json({
      success: true,
      lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead details
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res, next) => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    // Role check: Sales reps can only edit their own leads
    if (req.user.role === 'sales' && lead.assignedTo.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to update this lead record');
    }

    // Validate updates (isUpdate=true: name not required for partial updates)
    const { errors, isValid } = validateLeadInput(req.body, true);
    if (!isValid) {
      res.status(400);
      return res.json({ success: false, errors });
    }

    const originalStatus = lead.status;

    // Perform Update
    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('assignedTo', 'name email role');

    // Audit logs for status change
    if (req.body.status && req.body.status !== originalStatus) {
      await logActivity(
        lead._id,
        req.user.id,
        'status_change',
        `Lead status shifted from '${originalStatus}' to '${req.body.status}'`
      );
    } else {
      // General note activity log
      await logActivity(
        lead._id,
        req.user.id,
        'note',
        `Lead attributes modified`
      );
    }

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    // Role check: Sales reps can only delete their own leads
    if (req.user.role === 'sales' && lead.assignedTo.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this lead record');
    }

    // Log deletion activity before removing the lead
    await logActivity(
      lead._id,
      req.user.id,
      'deletion',
      `Lead "${lead.name}" was deleted by ${req.user.name}`
    );

    // Use deleteOne() to trigger mongoose hooks if any, or simply remove
    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Lead record removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a note to a lead
// @route   POST /api/leads/:id/notes
// @access  Private
const addLeadNote = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      res.status(400);
      throw new Error('Please add note content');
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    // Role check: Sales reps can only add notes to their own leads
    if (req.user.role === 'sales' && lead.assignedTo.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to modify this lead record');
    }

    // Push new note to lead notes array
    lead.notes.push({ content });

    // Save lead
    await lead.save();

    // Log this action as a note activity log
    await logActivity(
      lead._id,
      req.user.id,
      'note',
      `Added note: "${content.length > 50 ? content.substring(0, 50) + '...' : content}"`
    );

    // Get the newly added note (last note in array)
    const newNote = lead.notes[lead.notes.length - 1];

    // Return the full lead so the client can update its state directly
    const updatedLead = await Lead.findById(req.params.id).populate('assignedTo', 'name email role');
    res.status(201).json({
      success: true,
      note: newNote,
      lead: updatedLead,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  addLeadNote,
};
