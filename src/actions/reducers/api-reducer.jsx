"use client";
import { getLocalStorageItem } from "@/actions/localStorage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const getUserData = () => getLocalStorageItem("user_data");

export const api = createApi({
  reducerPath: "api", // ?Nombre del reducer
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { /* getState */ }) => {
      // *Preparacion de headers
      headers.set("Content-Type", "application/json");
      //const state = getState();
      const token =  getLocalStorageItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getReport: builder.query({
      query: (params) => `reporteria/${params}`,
    }),

    getCompras: builder.query({
      query: (params) => `reporteria/compras?${params}`,
    }),
    getVentas: builder.query({
      query: (params) => `reporteria/ventas?${params}`,
    }),
    getAlmacen: builder.query({
      query: (params) => `reporteria/almacen?${params}`,
    }),
    getMermas: builder.query({
      query: (params) => `reporteria/mermas?${params}`,
    }),
    getMovimientos: builder.query({
      query: (params) => `reporteria/movimientos?${params}`,
    }),

    /// * scrum
    getProjects: builder.query({
      query: () => `projects`,
    }),
    getSprints: builder.query({
      query: (params) => `projects/${params}/sprints`,
    }),
    getTasks: builder.query({
      query: (params) => `sprints/${params}/tasks`,
    }),
    getHsitoryTask: builder.query({
      query: (params) => `tasks/${params}/hsitory`,
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
        url: `projects/${data.project_id}/sprints`,
        method: "POST",
        body: data,
      }),
    }),
    postTasks: builder.mutation({
      query: (data) => ({
        url: "sprints/tasks",
        method: "POST",
        body: data,
      }),
    }),
    postComments: builder.mutation({
      query: (data) => ({
        url: `tasks/${data.taskId}/comments`,
        method: "POST",
        body: data,
      }),
    }),
    putTask: builder.mutation({
      query: ({ dataForm, idEdit }) => {
        return {
          url: `tasks/${idEdit}/assing-user`,
          method: "PUT",
          body: dataForm,
        };
      },
    }), 
    putTaskStatus: builder.mutation({
      query: (data) => {        
        return {
          url: `tasks/${data.taskId}/update-status`,
          method: "PUT",
          body: data,
        };
      },
    }), 
    putTaskOrder: builder.mutation({
      query: (data) => {
        return {
          url: `tasks/${data.taskId}/update-order?order=${data.order}`,
          method: "PUT",
        };
      },
    }), 
    /// * scrum

    getAutocompletarCompras: builder.query({
      query: (params) => `filtros/autocompletar-compras?${params}`,
    }),
    getAutocompletarVentas: builder.query({
      query: (params) => `filtros/autocompletar-ventas?${params}`,
    }),

    getGlosarioCompras: builder.query({
      query: (params) => `filtros/glosario-compras?${params}`,
    }),
    getGlosarioVentas: builder.query({
      query: (params) => `filtros/glosario-ventas?${params}`,
    }),

    getHistorialCompras: builder.query({
      query: () => `estatico/historial-compras`,
    }),
    /* 
    ? Formato de update ↡
    
    */
  }),
});

export const {
  useGetReportQuery,

  useGetComprasQuery,
  useGetVentasQuery,
  useGetAlmacenQuery,
  useGetMermasQuery,
  useGetMovimientosQuery,

  useGetProjectsQuery,
  useGetSprintsQuery,
  useGetTasksQuery,
  useGetHsitoryTaskQuery,
  usePostProjectsMutation,
  usePostSprintsMutation,
  usePostTasksMutation,
  usePostCommentsMutation,
  usePutTaskMutation,
  usePutTaskStatusMutation,
  usePutTaskOrderMutation,

  useGetAutocompletarComprasQuery,
  useGetAutocompletarVentasQuery,

  useGetGlosarioComprasQuery,
  useGetGlosarioVentasQuery,

  useGetHistorialComprasQuery
} = api;
