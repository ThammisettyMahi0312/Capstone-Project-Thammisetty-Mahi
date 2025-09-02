// import { api } from './api';

// export type InventorySummary = {
//   totalProducts: number;
//   lowStockItems: number;
//   outOfStockItems: number;
//   totalInventoryValue: number;
//   topProducts: any[];
//   recentlyAddedProducts: any[];
// };

// export const reportsApi = api.injectEndpoints({
//   endpoints: (build) => ({
//     getInventorySummary: build.query<InventorySummary, void>({
//       query: () => ({ url: '/api/reports/inventory-summary' }),
//       providesTags: ['Report'],
//     }),
//   }),
// });

// export const { useGetInventorySummaryQuery } = reportsApi;


import { api } from './api';

export type InventorySummary = {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalInventoryValue: number;
  topProducts: any[];
  recentlyAddedProducts: any[];
};

// Mock data for dashboard
const mockInventorySummary = {
  totalProducts: 5,
  lowStockItems: 2,
  outOfStockItems: 0,
  totalInventoryValue: 12560.75,
  topProducts: [
    { name: "Office Chair", value: 2999.85 },
    { name: "Coffee Machine", value: 719.92 },
    { name: "T-Shirt (Pack of 3)", value: 2249.25 }
  ],
  recentlyAddedProducts: [
    { name: "T-Shirt (Pack of 3)", date: "2023-10-15" },
    { name: "Coffee Machine", date: "2023-10-14" },
    { name: "Notebook Set", date: "2023-10-13" }
  ]
};

export const reportsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getInventorySummary: build.query<InventorySummary, void>({
      query: () => ({ url: "/api/reports/inventory-summary" }),
      providesTags: ["Report"],
      transformResponse: (response) => {
        // For demo purposes, return mock data
        return mockInventorySummary;
      }
    }),
  }),
});

export const { useGetInventorySummaryQuery } = reportsApi;