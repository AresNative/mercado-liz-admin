import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterProps {
  value: string;
  key: string;
  type: "table" | "grafic" | "multi" | "info";
}

const initialState = {
  type: "",
};

export const dropDow = createSlice({
  name: "dropDow",
  initialState,
  reducers: {
    openAlertReducer: (
      state,
      action: PayloadAction<FilterProps & { duration?: number }>
    ) => {
      const { key, value, type } = action.payload;
      state.type = type;
    },
    openModal: (
      state,
      action: PayloadAction<{ modalName: string; isOpen: boolean }>
    ) => {
      const { modalName, isOpen } = action.payload;
    },
  },
});

export const { openAlertReducer, openModal } = dropDow.actions;

export default dropDow.reducer;
