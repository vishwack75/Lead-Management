import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  ILead,
  LeadStats,
  GetLeadsParams,
  GetLeadsResponse,
  ApiResponse,
  CreateLeadInput,
  LeadStatus,
} from '../types/lead';

export const leadApi = createApi({
  reducerPath: 'leadApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  tagTypes: ['Lead', 'Stats'],
  endpoints: (builder) => ({
    getLeads: builder.query<GetLeadsResponse, GetLeadsParams>({
      query: (params) => ({
        url: '/leads',
        params: {
          search: params.search || undefined,
          status: params.status && params.status !== 'All' ? params.status : undefined,
          page: params.page || 1,
          limit: params.limit || 10,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Lead' as const, id: _id })),
              { type: 'Lead', id: 'LIST' },
            ]
          : [{ type: 'Lead', id: 'LIST' }],
    }),

    getLeadStats: builder.query<ApiResponse<LeadStats>, void>({
      query: () => '/leads/stats',
      providesTags: [{ type: 'Stats', id: 'OVERVIEW' }],
    }),

    createLead: builder.mutation<ApiResponse<ILead>, CreateLeadInput>({
      query: (leadData) => ({
        url: '/leads',
        method: 'POST',
        body: leadData,
      }),
      invalidatesTags: [
        { type: 'Lead', id: 'LIST' },
        { type: 'Stats', id: 'OVERVIEW' },
      ],
    }),

    updateLeadStatus: builder.mutation<
      ApiResponse<ILead>,
      { id: string; status: LeadStatus }
    >({
      query: ({ id, status }) => ({
        url: `/leads/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Lead', id },
        { type: 'Lead', id: 'LIST' },
        { type: 'Stats', id: 'OVERVIEW' },
      ],
    }),

    deleteLead: builder.mutation<ApiResponse<ILead>, string>({
      query: (id) => ({
        url: `/leads/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Lead', id },
        { type: 'Lead', id: 'LIST' },
        { type: 'Stats', id: 'OVERVIEW' },
      ],
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useGetLeadStatsQuery,
  useCreateLeadMutation,
  useUpdateLeadStatusMutation,
  useDeleteLeadMutation,
} = leadApi;
