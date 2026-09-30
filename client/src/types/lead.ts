export type LeadStatus = 'New' | 'Contacted' | 'Converted';

export interface ILead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  converted: number;
}

export interface GetLeadsParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface GetLeadsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  totalPages: number;
  data: ILead[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: string[];
}

export interface CreateLeadInput {
  name: string;
  email: string;
  phone: string;
  status?: LeadStatus;
}
