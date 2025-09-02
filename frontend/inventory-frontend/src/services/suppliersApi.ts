// 

import { api } from './api';

export type Supplier = {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
};

export const suppliersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSuppliers: build.query<Supplier[], void>({
      query: () => ({ url: '/api/suppliers' }),
      providesTags: ['Supplier'],
    }),
    getSupplier: build.query<Supplier, number>({
      query: (id) => ({ url: `/api/suppliers/${id}` }),
      providesTags: (_result, _error, id) => [{ type: 'Supplier', id }],
    }),
    createSupplier: build.mutation<Supplier, Partial<Supplier>>({
      query: (body) => ({ url: '/api/suppliers', method: 'POST', body }),
      invalidatesTags: ['Supplier'],
    }),
    updateSupplier: build.mutation<
      Supplier,
      Partial<Supplier> & { id: number }
    >({
      query: ({ id, ...patch }) => ({
        url: `/api/suppliers/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_result, _error, arg) => [
        'Supplier',
        { type: 'Supplier', id: arg.id },
      ],
    }),
    deleteSupplier: build.mutation<void, number>({
      query: (id) => ({ url: `/api/suppliers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Supplier'],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSupplierQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = suppliersApi;