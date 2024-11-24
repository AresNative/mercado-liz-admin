import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchData: null,
};

export const cuestion = createSlice({
  name: "search",
  initialState,
  reducers: {
    searchDataReducer: (state, action) => {
      state.searchData = action.payload;
    },
  },
});

export const { searchDataReducer } = cuestion.actions;

export default cuestion.reducer;
