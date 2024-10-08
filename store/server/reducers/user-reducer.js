"use client";
import { getLocalStorageItem } from "@/store/hooks/localStorage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const user_data = getLocalStorageItem("user_data");

export const userApi = createApi({
  reducerPath: "userApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.apiUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token = state.authReducer.user || getLocalStorageItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserById: builder.query({
      query: (id) => `Users/${id}`,
    }),
    postUserRegister: builder.mutation({
      query: (data) => ({
        url: "Users/Register",
        method: "POST",
        body: data,
      }),
    }),
    postUserLogin: builder.mutation({
      query: (data) => ({
        url: "Users/Login",
        method: "POST",
        body: data,
      }),
    }),
    postLogut: builder.mutation({
      query: (data) => ({
        url: `Users/Logout`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    postEmailValidate: builder.mutation({
      query: (data) => ({
        url: `Users/EmailVerification`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getSummary: builder.query({
      query: () => `Bid/Summary/${user_data.id}`,
    }),
    getKeywords: builder.query({
      query: () => `Keyword/GetAllKeywords`,
    }),
    getKeywordsUser: builder.query({
      query: () => `Keyword/GetUserKeywordList/${user_data.id}`,
    }),
    postKeywords: builder.mutation({
      query: (data) => ({
        url: `Keyword/AddKeyword`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    deleteKeywords: builder.mutation({
      query: (data) => ({
        url: `Keyword/DeleteUserKeyword`,
        method: "DELETE",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getListingById: builder.mutation({
      query: (data) => ({
        url: `Listing/GetListingDetails`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    postWatch: builder.mutation({
      query: (data) => ({
        url: `Watching/watching`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    postFavorite: builder.mutation({
      query: (data) => ({
        url: `Favorite/Favorite`,
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    postBid: builder.mutation({
      query: (data) => ({
        url: `Bid/Bid`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    postEmailVerify: builder.mutation({
      query: (data) => ({
        url: `Users/EmailVerify`,
        method: "POST",
        body: `${data}`,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    postResentEmailVerify: builder.mutation({
      query: (data) => ({
        url: `Users/ResentEmailVerification`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    postChangePassword: builder.mutation({
      query: (data) => ({
        url: `Users/ChangePassword`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    putEditUser: builder.mutation({
      query: ({ dataForm, idEdit }) => {
        const userName = idEdit ? idEdit : user_data.userName;
        console.log(idEdit);
        const url = `Users/Edit/${userName}`;

        return {
          url: url,
          method: "PUT",
          body: dataForm,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),

    getUserPermits: builder.mutation({
      query: () => {
        const user_data = getLocalStorageItem("user_data");
        /* const formData = new FormData();
        formData.append("userId", user_data.id); */

        return {
          url: `UserPermit/GetUserPermits/${user_data.id}`,
          method: "POST",
          /* body: formData, */
        };
      },
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useGetSummaryQuery,
  useGetKeywordsQuery,
  useGetKeywordsUserQuery,
  usePostKeywordsMutation,
  useDeleteKeywordsMutation,
  useGetListingByIdMutation,
  usePostWatchMutation,
  usePostBidMutation,
  usePostFavoriteMutation,
  usePostUserRegisterMutation,
  usePostUserLoginMutation,
  usePostEmailValidateMutation,
  usePostEmailVerifyMutation,
  usePostResentEmailVerifyMutation,
  usePostChangePasswordMutation,
  usePostLogutMutation,
  usePutEditUserMutation,
  useGetUserPermitsMutation,
} = userApi;
