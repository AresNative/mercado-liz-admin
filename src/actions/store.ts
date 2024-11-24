import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { api } from "@/actions/reducers/api-reducer";
import { authApi } from "@/actions/reducers/auth-reducer";

import modalReducer from "@/actions/reducers/modal-reducer";
import confirmReducer from "@/actions/reducers/confirm-data";
import filterReducer from "@/actions/reducers/filter-reducer";
import reloadReducer from "@/actions/reducers/reload-reducer";
import searchReducer from "@/actions/reducers/search-reducer";
import cuestionReducer from "@/actions/reducers/cuestion-reducer";
import alertReducer from "@/actions/reducers/alert-reducer";

const model = process.env.NODE_ENV;

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    searchReducer,
    filterReducer,
    reloadReducer,
    confirmReducer,
    cuestionReducer,
    alertReducer,
    [api.reducerPath]: api.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  devTools: model !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([api.middleware, authApi.middleware]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
