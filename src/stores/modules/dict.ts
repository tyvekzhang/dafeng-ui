import { createSlice } from '@reduxjs/toolkit';

interface DictState {
  dictData: Record<string, any>;
}

const initialState: DictState = {
  dictData: {},
};

export const dict = createSlice({
  name: 'dict',
  initialState,
  reducers: {
    setDictData: (state, action) => {
      state.dictData = action.payload;
    },
  },
});

export const { setDictData } = dict.actions;

export default dict.reducer;
