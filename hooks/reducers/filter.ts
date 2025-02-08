import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReactElement } from "react";

interface AlertProps {
  message: string;
  icon: ReactElement;
  type: "success" | "error" | "warning" | "completed" | "info";
  action?: (...args: any[]) => any;
}

interface DropDowState {
  message: string;
  type: string;
  duration: number;
  icon: ReactElement | string;
  modals: Record<string, boolean>;
  cuestionActivate: any; // Ajustar si tienes un tipo específico para `cuestionActivate`
}

const initialState: DropDowState = {
  message: "",
  type: "",
  duration: 0,
  icon: "",
  modals: {},
  cuestionActivate: null,
};

export const dropDow = createSlice({
  name: "dropDow",
  initialState,
  reducers: {
    openAlertReducer: (
      state,
      action: PayloadAction<AlertProps & { duration?: number }>
    ) => {
      const { message, type, duration, icon } = action.payload;
      state.message = message;
      state.type = type;
      state.icon = icon;
      state.duration = duration ?? 3000;
    },
    openModal: (
      state,
      action: PayloadAction<{ modalName: string; isOpen: boolean }>
    ) => {
      const { modalName, isOpen } = action.payload;
      state.modals[modalName] = isOpen;
    },
    closeModal: (state, action: PayloadAction<{ modalName: string }>) => {
      const { modalName } = action.payload;
      state.modals[modalName] = false;
    },
    setCuestionActivate: (state, action: PayloadAction<any>) => {
      state.cuestionActivate = action.payload;
    },
  },
});

export const { openAlertReducer, openModal, closeModal, setCuestionActivate } =
  dropDow.actions;

export default dropDow.reducer;
