// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// type Role = "Admin" | "Manager" | "Staff";
// type User = { id: number; username: string; role: Role };
// type State = { token: string | null; user: User | null };

// const initialState: State = { token: null, user: null };

// const slice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
//       state.token = action.payload.token;
//       state.user = action.payload.user;
//       localStorage.setItem("auth", JSON.stringify(state));
//     },
//     logout: (state) => {
//       state.token = null; state.user = null;
//       localStorage.removeItem("auth");
//     },
//     hydrate: (state) => {
//       const raw = localStorage.getItem("auth");
//       if (raw) {
//         const parsed = JSON.parse(raw) as State;
//         state.token = parsed.token; state.user = parsed.user;
//       }
//     }
//   }
// });

// export const { setCredentials, logout, hydrate } = slice.actions;
// export default slice.reducer;


// src/features/auth/authSlice.ts


// 

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: any }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;