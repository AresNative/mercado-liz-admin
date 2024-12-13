import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modals: {},
  cuestionActivate: null,
};

export const modalReducer = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      const { modalName, isOpen } = action.payload;
        state.modals[modalName] = isOpen;
    },
    closeModal: (state, action) => {
      const { modalName } = action.payload;
        state.modals[modalName] = false;
    },
    setCuestionActivate: (state, action) => {
      state.cuestionActivate = action.payload;
    },
  },
});

export const { openModal, closeModal, setCuestionActivate } = modalReducer.actions;

export default modalReducer.reducer;
