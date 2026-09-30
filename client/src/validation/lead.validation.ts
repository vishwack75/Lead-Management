import { z } from 'zod';

export const leadFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters long')
    .max(80, 'Name cannot exceed 80 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address (e.g. rahul@gmail.com)'),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .min(7, 'Phone number must be at least 7 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .regex(
      /^\+?[0-9\s\-()]{7,15}$/,
      'Please enter a valid phone number with digits only (7-15 digits)'
    ),
  status: z.enum(['New', 'Contacted', 'Converted']).default('New'),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
