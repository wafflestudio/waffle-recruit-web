import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  access: string | null;
  refresh: string | null;
  username: string | null;
}

const initialState = { access: null, refresh: null, username: null } as AuthState;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccess(state, action: PayloadAction<string>) {
      state.access = action.payload;
    },
    setRefresh(state, action: PayloadAction<string>) {
      state.refresh = action.payload;
    },
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    clearAuth(state) {
      state = initialState;
    },
  },
});

export const { setAccess, setRefresh, setUsername, clearAuth } = authSlice.actions;
export default authSlice.reducer;
