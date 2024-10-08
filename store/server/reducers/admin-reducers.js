"use client";
import { getLocalStorageItem } from "@/store/hooks/localStorage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const getUserData = () => getLocalStorageItem("user_data");

export const adminApi = createApi({
  reducerPath: "adminApi",
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
    getAllListings: builder.query({
      query: () => `Listing/GetAllListing/${getUserData().id}`,
    }),

    generateReport: builder.query({
      query: ({ year, month }) => {
        const params = new URLSearchParams();
        if (year !== undefined && year !== null) params.append("year", year);
        if (month !== undefined && month !== null)
          params.append("month", month);
        return {
          url: `Reports/ReportStatus?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    postRegisterListing: builder.mutation({
      query: (data) => ({
        url: `Listing/RegisterListing`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),

    getAllUsers: builder.query({
      query: () => `Users/GetAllUsers`,
    }),

    getAllNews: builder.query({
      query: () => `News/GetAllNews`,
    }),
    postCreateNews: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        for (const key in data) {
          if (key === "Date") {
            formData.append("Date.Seconds", data.Date.Seconds);
            formData.append("Date.Nanos", data.Date.Nanos);
          } else if (key === "Texts") {
            data.Texts.forEach((text, index) => {
              formData.append(`Texts[${index}]`, text);
            });
          } else {
            formData.append(key, data[key]);
          }
        }
        return {
          url: `News/CreateNews`,
          method: "POST",
          body: formData,
        };
      },
    }),
    putUpdateNews: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        for (const key in data) {
          if (key === "Date") {
            formData.append("Date.Seconds", data.Date.Seconds);
            formData.append("Date.Nanos", data.Date.Nanos);
          } else if (key === "Texts") {
            data.Texts.forEach((text, index) => {
              console.log(text, "---", data.Texts);
              formData.append(`Texts[${index}]`, text);
            });
          } else {
            formData.append(key, data[key]);
          }
        }
        return {
          url: `News/UpdateNews`,
          method: "PUT",
          body: formData,
        };
      },
    }),
    deleteNews: builder.mutation({
      query: (data) => {
        return {
          url: `News/DeleteNews/${data}`,
          method: "DELETE",
        };
      },
    }),

    getReports: builder.query({
      query: (data) => `Reports/${data}`,
    }),

    getGenerateReport: builder.query({
      query: ({ year, month }) => {
        const params = new URLSearchParams();
        if (year !== undefined && year !== null) params.append("year", year);
        if (month !== undefined && month !== null)
          params.append("month", month);
        return {
          url: `Reports/ReportStatus?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    getAllChats: builder.query({
      query: () => `Chat/GetAllActiveChats`,
    }),
    postChatStart: builder.mutation({
      query: (data) => ({
        url: `Chat/StartOrGetChat`,
        method: "POST",
        body: data,
      }),
    }),
    putChatUpdate: builder.mutation({
      query: (data) => ({
        url: `Chat/UpdateChatStatus`,
        method: "PUT",
        body: data,
      }),
    }),

    getAllSponsors: builder.query({
      query: () => `Sponsor/GetAll`,
    }),
    getByIdSponsor: builder.query({
      query: (data) => `Sponsor/${data}`,
    }),
    postNewSponsor: builder.mutation({
      query: (data) => ({
        url: `Sponsor/Create`,
        method: "POST",
        body: data,
      }),
    }),
    editSponsor: builder.mutation({
      query: (data) => ({
        url: `Sponsor/Edit`,
        method: "PUT",
        body: data,
      }),
    }),

    getAllCategories: builder.query({
      query: () => `Categories/GetAllCategories`,
    }),
    getByIdCategories: builder.query({
      query: (data) => ({
        url: `Categories/${data}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getRegisterCategoriesInfo: builder.query({
      query: () => ({
        url: `Categories/GetRegisterCategoryInfo`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    postCategoriesRegister: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        for (const key in data) {
          formData.append(key, data[key]);
        }
        return {
          url: `Categories/Register`,
          method: "POST",
          body: formData,
        };
      },
    }),

    postNewCategories: builder.mutation({
      query: (data) => ({
        url: `Categories/Register`,
        method: "POST",
        body: data,
      }),
    }),
    editCategories: builder.mutation({
      query: ({ id, data }) => {
        const formData = new FormData();
        for (const key in data) {
          formData.append(key, data[key]);
        }
        return {
          url: `Categories/Edit/${id}`,
          method: "PUT",
          body: formData,
        };
      },
    }),

    permitsUser: builder.mutation({
      query: (data) => {
        const queryString = Object.keys(data)
          .map(
            (key) =>
              encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
          )
          .join("&");

        return {
          url: `UserPermit/Permits?${queryString}`,
          method: "POST",
        };
      },
    }),
  }),
});

export const {
  useLazyGenerateReportQuery,
  useGetAllListingsQuery,
  usePostRegisterListingMutation,

  useGetAllUsersQuery,
  useGetAllNewsQuery,

  useGetReportsQuery,

  useGetAllChatsQuery,
  usePutChatUpdateMutation,

  useGetGenerateReportQuery,

  usePostCreateNewsMutation,
  usePutUpdateNewsMutation,
  useDeleteNewsMutation,

  useGetAllSponsorsQuery,
  useGetByIdSponsorQuery,
  usePostNewSponsorMutation,
  useEditSponsorMutation,

  useGetAllCategoriesQuery,
  useGetByIdCategoriesQuery,
  useGetRegisterCategoriesInfoQuery,
  usePostCategoriesRegisterMutation,
  usePostNewCategoriesMutation,
  useEditCategoriesMutation,

  usePermitsUserMutation,
} = adminApi;
