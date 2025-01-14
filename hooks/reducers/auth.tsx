"use client";
import { EnvConfig } from "@/utils/constants/env.config";
import { getLocalStorageItem } from "@/utils/functions/local-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const getUserData = () => getLocalStorageItem("user_data");

const { api: apiUrl } = EnvConfig();
console.log(apiUrl);

export const auth = createApi({
    reducerPath: "auth",
    refetchOnFocus: true,
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
        prepareHeaders: (headers, { getState }) => {
            headers.set("Content-Type", "application/json");
            const state: any = getState();
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
} = auth;
