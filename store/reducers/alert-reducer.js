import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  type: "",
  duration: 0,
};

export const alert = createSlice({
  name: "alert",
  initialState,
  reducers: {
    openAlertReducer: (state, action) => {
      const { message, type, duration } = action.payload;
      state.message = message;
      state.type = type;
      state.duration = duration ?? 3000;
    },
  },
});

export const { openAlertReducer } = alert.actions;

export default alert.reducer;
