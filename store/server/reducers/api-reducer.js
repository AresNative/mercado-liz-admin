"use client";
import { getLocalStorageItem } from "@/store/hooks/localStorage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const getUserData = () => getLocalStorageItem("user_data");
/* 
?Example use |getUserData| ↡
 getAllListings: builder.query({
      query: () => `Listing/GetAllListing/${getUserData().id}`,
    }),
*/
export const api = createApi({
  reducerPath: "api", // ?Nombre del reducer
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      // *Preparacion de headers
      headers.set("Content-Type", "application/json");
      const state = getState();
      //const token = state.authReducer.user || getLocalStorageItem("token");
      /* if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } */
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getReport: builder.query({
      query: (params) => `reporteria/${params}`,
    }),
    getTestQuery: builder.query({
      query: (params) => `testQuery/compras?${params}`,
    }),
    postProjects: builder.mutation({
      query: (data) => ({
        url: "projects",
        method: "POST",
        body: data,
      }),
    }),
    postSprints: builder.mutation({
      query: (data) => ({
        url: `projects/${data.projectId}/sprints`,
        method: "POST",
        body: data.form,
      }),
    }),
    postTasks: builder.mutation({
      query: (data) => ({
        url: "sprints/tasks",
        method: "POST",
        body: data,
      }),
    }),
    /* 
    TODO las opciones de enpoint son las siguientes ↡
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
    putEditUser: builder.mutation({
      query: ({ dataForm, idEdit }) => {
        return {
          url: `Users/Edit/${id}`,
          method: "PUT",
          body: dataForm,
        };
      },
    }), 
    */
  }),
});

export const {
  useGetReportQuery,
  useGetTestQueryQuery,
  usePostProjectsMutation,
  usePostSprintsMutation,
  usePostTasksMutation,
} = api;
