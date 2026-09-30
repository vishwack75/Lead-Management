import mongoose, { Document, Schema } from 'mongoose';

export type LeadStatus = 'New' | 'Contacted' | 'Converted';

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Converted'];

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema<ILead> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      minlength: [7, 'Phone number must be at least 7 digits'],
    },
    status: {
      type: String,
      enum: {
        values: LEAD_STATUSES,
        message: '{VALUE} is not a valid status. Valid statuses are: New, Contacted, Converted',
      },
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
