import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cuestionName: null,
  idBid: null,
};

export const cuestion = createSlice({
  name: "cuestion",
  initialState,
  reducers: {
    cuestionNameReducer: (state, action) => {
      state.cuestionName = action.payload;
    },
    bidIdReducer: (state, action) => {
      state.idBid = action.payload;
    },
  },
});

export const { cuestionNameReducer, bidIdReducer } = cuestion.actions;

export default cuestion.reducer;
