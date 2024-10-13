import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modals: {},
  cuestionActivate: null,
};

export const modal = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModalReducer: (state, action) => {
      const { modalName, isOpen } = action.payload;
      state.modals[modalName] = isOpen;
    },
    closeModalReducer: (state, action) => {
      const { modalName } = action.payload;
      state.modals[modalName] = false;
    },
    setCuestionActivate: (state, action) => {
      state.cuestionActivate = action.payload;
    },
  },
});

export const { openModalReducer, closeModalReducer, setCuestionActivate } =
  modal.actions;

export default modal.reducer;
