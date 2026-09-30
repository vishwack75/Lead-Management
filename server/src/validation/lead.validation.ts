import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// Lead Status Enum
export const LeadStatusEnum = z.enum(['New', 'Contacted', 'Converted'], {
  errorMap: () => ({ message: "Status must be either 'New', 'Contacted', or 'Converted'" }),
});

// Zod Schema for Creating a Lead
export const createLeadSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters long')
      .max(80, 'Name cannot exceed 80 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Please provide a valid email address (e.g. rahul@gmail.com)'),
    phone: z
      .string({ required_error: 'Phone number is required' })
      .trim()
      .min(7, 'Phone number must be at least 7 digits')
      .max(15, 'Phone number cannot exceed 15 digits')
      .regex(
        /^\+?[0-9\s\-()]{7,15}$/,
        'Please enter a valid phone number (digits, optional +, hyphens, or parentheses)'
      ),
    status: LeadStatusEnum.optional().default('New'),
  }),
});

// Zod Schema for Updating Lead Status
export const updateLeadStatusSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Lead ID is required' })
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid Lead ID format',
      }),
  }),
  body: z.object({
    status: LeadStatusEnum,
  }),
});

// Zod Schema for Lead ID param (for delete and get by id)
export const leadIdParamSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Lead ID is required' })
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid Lead ID format',
      }),
  }),
});

// Zod Schema for Lead Query parameters (search, filter, pagination)
export const getLeadsQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.enum(['All', 'New', 'Contacted', 'Converted']).optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
  }),
});

// Express validation middleware using Zod schemas
export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Assign parsed & sanitized data back to req
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues.map((issue) => issue.message);
        res.status(400).json({
          success: false,
          message: issues[0] || 'Validation failed',
          errors: issues,
        });
        return;
      }
      next(error);
    }
  };
};

export type CreateLeadDTO = z.infer<typeof createLeadSchema>['body'];
export type UpdateLeadStatusDTO = z.infer<typeof updateLeadStatusSchema>['body'];
