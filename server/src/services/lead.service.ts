import mongoose from 'mongoose';
import { Lead, ILead, LeadStatus, LEAD_STATUSES } from '../model/lead.model.js';
import { CreateLeadDTO } from '../validation/lead.validation.js';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface GetLeadsServiceParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedLeadsResponse {
  leads: ILead[];
  total: number;
  page: number;
  totalPages: number;
}

export interface LeadStatsResponse {
  total: number;
  new: number;
  contacted: number;
  converted: number;
}

export class LeadService {
  async createLead(data: CreateLeadDTO): Promise<ILead> {
    const lead = await Lead.create({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      status: data.status || 'New',
    });

    return lead;
  }

  async getLeads(params: GetLeadsServiceParams): Promise<PaginatedLeadsResponse> {
    const { search, status, page = 1, limit = 10 } = params;

    const filter: Record<string, any> = {};

    if (status && status !== 'All' && LEAD_STATUSES.includes(status as LeadStatus)) {
      filter.status = status;
    }

    if (search && search.trim() !== '') {
      const sanitized = search.trim();
      const searchRegex = new RegExp(sanitized, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(100, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [total, leads] = await Promise.all([
      Lead.countDocuments(filter),
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      leads,
      total,
      page: pageNum,
      totalPages,
    };
  }

  async updateLeadStatus(id: string, status: LeadStatus): Promise<ILead> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Lead ID format', 400);
    }

    if (!LEAD_STATUSES.includes(status)) {
      throw new AppError(`Invalid status '${status}'. Must be one of: ${LEAD_STATUSES.join(', ')}`, 400);
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedLead) {
      throw new AppError('Lead not found with the specified ID', 404);
    }

    return updatedLead;
  }

  async deleteLead(id: string): Promise<ILead> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Lead ID format', 400);
    }

    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      throw new AppError('Lead not found with the specified ID', 404);
    }

    return deletedLead;
  }

  async getLeadStats(): Promise<LeadStatsResponse> {
    const [total, newCount, contactedCount, convertedCount] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'New' }),
      Lead.countDocuments({ status: 'Contacted' }),
      Lead.countDocuments({ status: 'Converted' }),
    ]);

    return {
      total,
      new: newCount,
      contacted: contactedCount,
      converted: convertedCount,
    };
  }
}

export const leadService = new LeadService();
