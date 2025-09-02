// 

import { api } from './api';

export type LoginRequest = {
  username: string;
  password: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  role: string;
};

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<{ token: string; user: User }, LoginRequest>({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getProfile: build.query<User, void>({
      query: () => ({ url: '/api/auth/profile' }),
    }),
  }),
});

export const { useLoginMutation, useGetProfileQuery } = authApi;