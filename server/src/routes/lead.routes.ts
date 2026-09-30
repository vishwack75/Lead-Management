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

router.get('/stats', getLeadStats);

router
  .route('/')
  .post(validate(createLeadSchema), createLead)
  .get(validate(getLeadsQuerySchema), getLeads);

router.patch(
  '/:id/status',
  validate(updateLeadStatusSchema),
  updateLeadStatus
);

router.delete(
  '/:id',
  validate(leadIdParamSchema),
  deleteLead
);

export default router;
