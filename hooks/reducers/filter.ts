import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterProps {
  value: string;
  key: string;
  type: "form" | "grafic" | "multi";
}

const initialState: FilterProps = {
  type: "form",
  key: "",
  value: "",
};

export const filterData = createSlice({
  name: "filterData",
  initialState,
  reducers: {
    dataFilter: (state, action: PayloadAction<FilterProps>) => {
      const { key, value, type } = action.payload;
      state = { type: type, key: key, value: value };
      return state;
    },
    searchData: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
      return state;
    },
  },
});

export const { dataFilter, searchData } = filterData.actions;

export default filterData.reducer;
