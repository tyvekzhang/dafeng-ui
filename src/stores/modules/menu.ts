import type { MenuState } from '@/stores/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: MenuState = {
  menuList: [],
  isCollapse: false,
};

const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuList: (state, action: PayloadAction<any[]>) => {
      state.menuList = action.payload;
    },
    updateCollapse: (state, action: PayloadAction<boolean>) => {
      state.isCollapse = action.payload;
    },
  },
});

export const { setMenuList, updateCollapse } = menu.actions;

export default menu.reducer;
