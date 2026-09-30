import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { StatsCards } from '../components/StatsCards';
import { AddLeadForm } from '../components/AddLeadForm';
import { AddLeadModal } from '../components/AddLeadModal';
import { FilterBar } from '../components/FilterBar';
import { LeadTable } from '../components/LeadTable';
import { Pagination } from '../components/Pagination';
import { DeleteModal } from '../components/DeleteModal';
import { Toast } from '../components/Toast';
import type { ToastMessage } from '../components/Toast';
import {
  useGetLeadsQuery,
  useGetLeadStatsQuery,
  useUpdateLeadStatusMutation,
  useDeleteLeadMutation,
} from '../services/leadApi';
import type { ILead, LeadStatus } from '../types/lead';

export const LeadManagementPage = () => {
  // Filter and pagination states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modals & UI states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<ILead | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Debounce search input for instant, smooth filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search change
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // RTK Query endpoints
  const {
    data: leadsData,
    isLoading: isLeadsLoading,
    isFetching: isLeadsFetching,
    refetch: refetchLeads,
  } = useGetLeadsQuery({
    search: debouncedSearch,
    status,
    page,
    limit,
  });

  const {
    data: statsData,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useGetLeadStatsQuery();

  const [updateLeadStatus] = useUpdateLeadStatusMutation();
  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();

  // Toast Helpers
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Status update handler (PATCH /api/leads/:id/status)
  const handleUpdateStatus = async (id: string, newStatus: LeadStatus) => {
    setUpdatingId(id);
    try {
      const response = await updateLeadStatus({ id, status: newStatus }).unwrap();
      addToast('success', response.message || `Lead status updated to ${newStatus}`);
    } catch (err: any) {
      addToast(
        'error',
        err?.data?.message || err?.error || 'Failed to update lead status'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete lead handler (DELETE /api/leads/:id)
  const handleConfirmDelete = async () => {
    if (!leadToDelete) return;
    try {
      const response = await deleteLead(leadToDelete._id).unwrap();
      addToast('success', response.message || 'Lead deleted successfully');
      setLeadToDelete(null);
    } catch (err: any) {
      addToast('error', err?.data?.message || err?.error || 'Failed to delete lead');
    }
  };

  const handleRefresh = () => {
    refetchLeads();
    refetchStats();
    addToast('info', 'Refreshing leads data...');
  };

  const handleStatusFilterChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
      {/* Top Navigation */}
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Overview Metrics Cards */}
          <StatsCards
            stats={statsData?.data}
            isLoading={isStatsLoading}
            selectedStatus={status}
            onSelectStatus={handleStatusFilterChange}
          />

          {/* Quick Inline Lead Creation Form (Matches Prompt Requirement) */}
          <AddLeadForm
            onSuccess={(msg) => addToast('success', msg)}
            onError={(msg) => addToast('error', msg)}
          />

          {/* Search, Filter, and Controls Bar */}
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={handleStatusFilterChange}
            limit={limit}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            onRefresh={handleRefresh}
            isFetching={isLeadsFetching}
          />

          {/* Leads Table & Pagination */}
          <div className="flex flex-col">
            <LeadTable
              leads={leadsData?.data || []}
              isLoading={isLeadsLoading}
              onUpdateStatus={handleUpdateStatus}
              onDeleteClick={(lead) => setLeadToDelete(lead)}
              updatingId={updatingId}
            />

            <Pagination
              page={leadsData?.page || 1}
              totalPages={leadsData?.totalPages || 1}
              total={leadsData?.total || 0}
              limit={limit}
              onPageChange={setPage}
            />
          </div>
        </div>
      </main>

      {/* Add Lead Popup Modal */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(msg) => addToast('success', msg)}
        onError={(msg) => addToast('error', msg)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(leadToDelete)}
        lead={leadToDelete}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setLeadToDelete(null)}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default LeadManagementPage;
