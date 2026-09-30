import React, { useState } from 'react';
import { X, User, Mail, Phone, Plus, Loader2, AlertCircle } from 'lucide-react';
import { leadFormSchema } from '../validation/lead.validation';
import type { LeadFormData } from '../validation/lead.validation';
import { useCreateLeadMutation } from '../services/leadApi';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    status: 'New',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof LeadFormData, boolean>>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const [createLead, { isLoading }] = useCreateLeadMutation();

  if (!isOpen) return null;

  const validateField = (field: keyof LeadFormData, value: string) => {
    const updated = { ...formData, [field]: value };
    const result = leadFormSchema.safeParse(updated);

    if (!result.success) {
      const fieldError = result.error.issues.find((issue) => issue.path[0] === field);
      setErrors((prev) => ({ ...prev, [field]: fieldError ? fieldError.message : undefined }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setServerError(null);

    if (touched[name as keyof LeadFormData]) {
      validateField(name as keyof LeadFormData, value);
    }
  };

  const handleBlur = (field: keyof LeadFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field] || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validationResult = leadFormSchema.safeParse(formData);

    if (!validationResult.success) {
      const formattedErrors: Partial<Record<keyof LeadFormData, string>> = {};
      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof LeadFormData;
        if (!formattedErrors[fieldName]) {
          formattedErrors[fieldName] = issue.message;
        }
      });
      setErrors(formattedErrors);
      setTouched({ name: true, email: true, phone: true, status: true });
      return;
    }

    try {
      const response = await createLead(validationResult.data).unwrap();
      setFormData({ name: '', email: '', phone: '', status: 'New' });
      setErrors({});
      setTouched({});
      onSuccess(response.message || 'Lead added successfully!');
      onClose();
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.error || 'Failed to add lead. Please check your data.';
      setServerError(errorMessage);
      onError(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg transform rounded-2xl bg-white p-6 shadow-2xl transition-all dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Create New Lead
            </h3>
            <p className="text-xs text-slate-500">
              Fill in the details below to register a new lead
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {serverError && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 ring-1 ring-inset ring-rose-600/20">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
          <div>
            <label
              htmlFor="modal-name"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                id="modal-name"
                name="name"
                type="text"
                placeholder="Rahul Patel"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                className={`block w-full rounded-xl border bg-slate-50/50 py-2.5 pr-3 pl-9 text-sm text-slate-900 transition-colors focus:bg-white focus:outline-none focus:ring-2 dark:bg-slate-800/50 dark:text-white ${
                  errors.name && touched.name
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.name && touched.name && (
              <p className="mt-1 text-xs text-rose-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="modal-email"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="modal-email"
                name="email"
                type="email"
                placeholder="rahul@gmail.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={`block w-full rounded-xl border bg-slate-50/50 py-2.5 pr-3 pl-9 text-sm text-slate-900 transition-colors focus:bg-white focus:outline-none focus:ring-2 dark:bg-slate-800/50 dark:text-white ${
                  errors.email && touched.email
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.email && touched.email && (
              <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="modal-phone"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Phone className="h-4 w-4" />
              </div>
              <input
                id="modal-phone"
                name="phone"
                type="tel"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                className={`block w-full rounded-xl border bg-slate-50/50 py-2.5 pr-3 pl-9 text-sm text-slate-900 transition-colors focus:bg-white focus:outline-none focus:ring-2 dark:bg-slate-800/50 dark:text-white ${
                  errors.phone && touched.phone
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.phone && touched.phone && (
              <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="modal-status"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Initial Lead Status
            </label>
            <select
              id="modal-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
            </select>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 disabled:opacity-50 active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Lead...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Create Lead</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
