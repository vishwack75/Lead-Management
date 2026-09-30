import { Request, Response, NextFunction } from 'express';
import { leadService } from '../services/lead.service';
import { LeadStatus } from '../model/lead.model.js';
import { CreateLeadDTO, UpdateLeadStatusDTO } from '../validation/lead.validation.js';

export const createLead = async (
  req: Request<{}, {}, CreateLeadDTO>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newLead = await leadService.createLead(req.body);

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: newLead,
    });
  } catch (error) {
    next(error);
  }
};

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
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
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

export const updateLeadStatus = async (
  req: Request<{ id: string }, {}, UpdateLeadStatusDTO>,
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

export const deleteLead = async (
  req: Request<{ id: string }>,
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
