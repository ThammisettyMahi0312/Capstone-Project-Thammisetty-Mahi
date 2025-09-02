// // import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// // import type { RootState } from "../app/store";

// // // Debug line to check the API URL
// // console.log("API URL:", import.meta.env.VITE_API_URL);

// // export const api = createApi({
// //   reducerPath: "inventoryApi",
// //   baseQuery: fetchBaseQuery({
// //     baseUrl: import.meta.env.VITE_API_URL ?? "https://localhost:7213",
// //     prepareHeaders: (headers, { getState }) => {
// //       const token = (getState() as RootState).auth.token;
// //       if (token) headers.set("authorization", `Bearer ${token}`);
// //       return headers;
// //     }
// //   }),
// //   tagTypes: ["Product", "Movement", "Report", "User", "Supplier"],
// //   endpoints: () => ({})
// // });

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type { RootState } from "../app/store";

// // Debug line to check the API URL
// console.log("API URL:", import.meta.env.VITE_API_URL);

// export const api = createApi({
//   reducerPath: "inventoryApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: import.meta.env.VITE_API_URL ?? "https://localhost:7213",
//     prepareHeaders: (headers, { endpoint, getState }) => {
//   // Skip Authorization for these specific auth endpoints
//   const authEndpoints = [
//     'login', 'register', 'refreshToken', 'forgotPassword'
//   ];
  
//   if (endpoint && authEndpoints.includes(endpoint)) {
//     return headers;
//   }
  
//   const token = (getState() as RootState).auth.token;
//   if (token) {
//     headers.set("authorization", `Bearer ${token}`);
//   }
//   return headers;
// }
//   }),
//   tagTypes: ["Product", "Movement", "Report", "User", "Supplier"],
//   endpoints: () => ({})
// });

// src/services/api.ts


// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type { RootState } from "../app/store";

// export const api = createApi({
//   reducerPath: "inventoryApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: import.meta.env.VITE_API_URL ?? "https://localhost:7213",
//     prepareHeaders: (headers, { getState }) => {
//       const token = (getState() as RootState).auth.token;
//       if (token) headers.set("authorization", `Bearer ${token}`);
//       headers.set("content-type", "application/json");
//       return headers;
//     }
//   }),
//   tagTypes: ["Product", "Movement", "Report", "User", "Supplier"],
//   endpoints: () => ({})
// });

// src/services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';

export const api = createApi({
  reducerPath: 'inventoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'https://localhost:7213',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Product', 'Report', 'Supplier', 'User'],
  endpoints: () => ({}),
});