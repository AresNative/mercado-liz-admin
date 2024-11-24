import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filterName: null,
};

export const fiter = createSlice({
  name: "filter",
  initialState,
  reducers: {
    filterNameReducer: (state, action) => {
      state.filterName = action.payload;
    },
  },
});

export const { filterNameReducer } = fiter.actions;

export default fiter.reducer;
