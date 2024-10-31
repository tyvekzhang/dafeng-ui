import { TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import type { UserState } from '@/stores/types';
import { setAuthCache } from '@/utils/auth';
import { createSlice } from '@reduxjs/toolkit';

const initialState: UserState = {
  userInfo: null,
  token: undefined,
  rememberMe: undefined,
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload ? action.payload : '';
      setAuthCache(state.rememberMe ? state.rememberMe : false, TOKEN_KEY, action.payload);
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
      setAuthCache(state.rememberMe ? state.rememberMe : false, USER_INFO_KEY, action.payload);
    },
    resetState(state) {
      state.userInfo = null;
      state.token = undefined;
      state.rememberMe = undefined;
    },
  },
});

export const { setToken, setUserInfo, setRememberMe, resetState } = user.actions;

export default user.reducer;
