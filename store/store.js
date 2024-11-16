import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { api } from "@/store/server/reducers/api-reducer";
import { authApi } from "@/store/server/reducers/auth-reducer";

import modalReducer from "@/store/reducers/modal-reducer";
import confirmReducer from "@/store/reducers/confirm-data";
import filterReducer from "@/store/reducers/filter-reducer";
import reloadReducer from "@/store/reducers/reload-reducer";
import searchReducer from "@/store/reducers/search-reducer";
import cuestionReducer from "@/store/reducers/cuestion-reducer";
import alertReducer from "@/store/reducers/alert-reducer";

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

export const RootState = store.getState;
export const AppDispatch = store.dispatch;
