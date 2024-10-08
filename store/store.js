import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { userApi } from "@/store/server/reducers/user-reducer";
import { adminApi } from "@/store/server/reducers/admin-reducers";

import authReducer from "@/store/server/reducers/auth-reducer";

import modalReducer from "@/store/reducers/modal-reducer";
import confirmReducer from "@/store/reducers/confirm-data";
import filterReducer from "@/store/reducers/filter-reducer";
import reloadReducer from "@/store/reducers/reload-reducer";
import searchReducer from "@/store/reducers/search-reducer";
import cuestionReducer from "@/store/reducers/cuestion-reducer";

const model = process.env.NODE_ENV;

export const store = configureStore({
  reducer: {
    authReducer,
    modal: modalReducer,
    searchReducer,
    filterReducer,
    reloadReducer,
    confirmReducer,
    cuestionReducer,
    [userApi.reducerPath]: userApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  devTools: model !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([userApi.middleware, adminApi.middleware]),
});

setupListeners(store.dispatch);

export const RootState = store.getState;
export const AppDispatch = store.dispatch;
