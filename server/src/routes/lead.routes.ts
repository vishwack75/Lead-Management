import { Router } from 'express';
import {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
} from '../controller/lead.controller.js';
import {
  validate,
  createLeadSchema,
  updateLeadStatusSchema,
  leadIdParamSchema,
  getLeadsQuerySchema,
} from '../validation/lead.validation.js';

const router = Router();

// Aggregate stats endpoint (must come before parameterized routes)
router.get('/stats', getLeadStats);

// Lead collection routes
router
  .route('/')
  .post(validate(createLeadSchema), createLead)
  .get(validate(getLeadsQuerySchema), getLeads);

// Lead item status update route
router.patch(
  '/:id/status',
  validate(updateLeadStatusSchema),
  updateLeadStatus
);

// Lead item deletion route
router.delete(
  '/:id',
  validate(leadIdParamSchema),
  deleteLead
);

export default router;
