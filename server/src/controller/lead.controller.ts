import { Request, Response, NextFunction } from 'express';
import { leadService } from '../services/lead.service.js';
import { LeadStatus } from '../model/lead.model.js';

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Public
export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phone, status } = req.body;
    const newLead = await leadService.createLead({ name, email, phone, status });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: newLead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads (supports search, status filter, and pagination)
// @route   GET /api/leads
// @access  Public
export const getLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, status, page, limit } = req.query;

    const result = await leadService.getLeads({
      search: typeof search === 'string' ? search : undefined,
      status: typeof status === 'string' ? status : undefined,
      page: typeof page === 'string' ? page : undefined,
      limit: typeof limit === 'string' ? limit : undefined,
    });

    res.status(200).json({
      success: true,
      count: result.leads.length,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      data: result.leads,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead status
// @route   PATCH /api/leads/:id/status
// @access  Public
export const updateLeadStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedLead = await leadService.updateLeadStatus(id, status as LeadStatus);

    res.status(200).json({
      success: true,
      message: 'Lead status updated successfully',
      data: updatedLead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Public
export const deleteLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedLead = await leadService.deleteLead(id);

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: deletedLead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get lead statistics
// @route   GET /api/leads/stats
// @access  Public
export const getLeadStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await leadService.getLeadStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
