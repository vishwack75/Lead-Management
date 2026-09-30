import { Router } from 'express';
import {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
} from '../controller/lead.controller.js';

const router = Router();

// Statistics route (place before parameterized :id route)
router.get('/stats', getLeadStats);

// Base leads routes
router.route('/')
  .post(createLead)
  .get(getLeads);

// Single lead status update
router.patch('/:id/status', updateLeadStatus);

// Single lead deletion
router.delete('/:id', deleteLead);

export default router;
