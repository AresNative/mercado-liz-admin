import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  value: null,
};

export const confirmData = createSlice({
  name: "confirm",
  initialState,
  reducers: {
    dataConfirmReducer: (state, action) => {
      const { id, value } = action.payload;
      state.id = id;
      state.value = value;
    },
  },
});

export const { dataConfirmReducer } = confirmData.actions;

export default confirmData.reducer;
