"use client";
import { getLocalStorageItem } from "@/actions/localStorage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const getUserData = () => getLocalStorageItem("user_data");

export const authApi = createApi({
  reducerPath: "authApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.apiUrl,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      const state = getState();
      const token = state.authReducer.user || getLocalStorageItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    postUserRegister: builder.mutation({
      query: (data) => ({
        url: "users/register",
        method: "POST",
        body: data,
      }),
    }),
    postUserLogin: builder.mutation({
      query: (data) => ({
        url: "users/login",
        method: "POST",
        body: data,
      }),
    }),
    postLogut: builder.mutation({
      query: (data) => ({
        url: `users/logout`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  usePostLogutMutation,
  usePostUserLoginMutation,
  usePostUserRegisterMutation,
} = authApi;
