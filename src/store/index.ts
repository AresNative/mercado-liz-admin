import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { api } from "@/reducers/api-reducer";
import { authApi } from "@/reducers/auth-reducer";
import { EnvConfig } from "@/constants/env.config";

import modalReducer from "@/reducers/modal-reducer";
import confirmReducer from "@/reducers/confirm-data";
import filterReducer from "@/reducers/filter-reducer";
import reloadReducer from "@/reducers/reload-reducer";
import searchReducer from "@/reducers/search-reducer";
import cuestionReducer from "@/reducers/cuestion-reducer";
import alertReducer from "@/reducers/alert-reducer";

const config = EnvConfig();
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
  devTools: config.mode !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([api.middleware, authApi.middleware]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
