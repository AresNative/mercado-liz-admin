import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reloadState: null,
};

export const reload = createSlice({
  name: "reload",
  initialState,
  reducers: {
    reloadReducer: (state, action) => {
      state.reloadState = action.payload;
    },
  },
});

export const { reloadReducer } = reload.actions;

export default reload.reducer;
