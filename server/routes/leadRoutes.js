const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();
const { getLeads, getLeadById, createLead, updateLead, deleteLead, addLeadNote, getLeadActivities } = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validationMiddleware');

const leadValidationRules = [
  body('name').trim().notEmpty().withMessage('Lead name is required'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Please provide a valid email address'),
  body('phone').optional().trim().isString().withMessage('Phone must be a string'),
  body('source')
    .optional()
    .isIn(['website', 'referral', 'cold_call', 'social_media', 'email', 'other'])
    .withMessage('Source is invalid'),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'])
    .withMessage('Status is invalid'),
  body('followUpDate').optional({ checkFalsy: true }).isISO8601().withMessage('Follow-up date must be a valid date'),
];

const updateLeadValidationRules = [
  body('name').optional().trim().notEmpty().withMessage('Lead name cannot be empty'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Please provide a valid email address'),
  body('phone').optional().trim().isString().withMessage('Phone must be a valid string'),
  body('source')
    .optional()
    .isIn(['website', 'referral', 'cold_call', 'social_media', 'email', 'other'])
    .withMessage('Source is invalid'),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'])
    .withMessage('Status is invalid'),
  body('followUpDate').optional({ checkFalsy: true }).isISO8601().withMessage('Follow-up date must be a valid date'),
];

router.use(protect);

router.route('/')
  .get(
    [
      query('search').optional().trim().isString(),
      query('status').optional().isIn(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']),
      query('source').optional().isIn(['website', 'referral', 'cold_call', 'social_media', 'email', 'other']),
      query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be a valid number between 1 and 100'),
    ],
    validateRequest,
    getLeads
  )
  .post(leadValidationRules, validateRequest, createLead);

router.route('/:id')
  .get([param('id').isMongoId().withMessage('Invalid lead id')], validateRequest, getLeadById)
  .put([param('id').isMongoId().withMessage('Invalid lead id'), ...updateLeadValidationRules], validateRequest, updateLead)
  .delete([param('id').isMongoId().withMessage('Invalid lead id')], validateRequest, deleteLead);

router.route('/:id/activities')
  .get([param('id').isMongoId().withMessage('Invalid lead id')], validateRequest, getLeadActivities);

router.route('/:id/notes')
  .post([
    param('id').isMongoId().withMessage('Invalid lead id'),
    body('content').trim().notEmpty().withMessage('Please add note content'),
  ], validateRequest, addLeadNote);

module.exports = router;
