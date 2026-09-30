import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const LeadStatusEnum = z.enum(['New', 'Contacted', 'Converted'], {
  message: "Status must be either 'New', 'Contacted', or 'Converted'",
});

export const createLeadSchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'Name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters long')
      .max(80, 'Name cannot exceed 80 characters'),
    email: z
      .string({ message: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Please provide a valid email address'),
    phone: z
      .string({ message: 'Phone number is required' })
      .trim()
      .min(6, 'Phone number must be at least 6 digits')
      .max(10, 'Phone number cannot exceed 10 digits')
      .regex(
        /^\+?[0-9\s\-()]{7,15}$/,
        'Please enter a valid phone number'
      ),
    status: LeadStatusEnum.optional().default('New'),
  }),
});

export const updateLeadStatusSchema = z.object({
  params: z.object({
    id: z
      .string({ message: 'Lead ID is required' })
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid Lead ID format',
      }),
  }),
  body: z.object({
    status: LeadStatusEnum,
  }),
});

export const leadIdParamSchema = z.object({
  params: z.object({
    id: z
      .string({ message: 'Lead ID is required' })
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid Lead ID format',
      }),
  }),
});

export const getLeadsQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.enum(['All', 'New', 'Contacted', 'Converted']).optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
  }),
});

export const validate = (schema: z.ZodType<any>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

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
