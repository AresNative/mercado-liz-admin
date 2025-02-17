"use client";
import { EnvConfig } from "@/utils/constants/env.config";
import { getLocalStorageItem } from "@/utils/functions/local-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const getUserData = () => getLocalStorageItem("user_data");
const { api: apiUrl } = EnvConfig();

export const api = createApi({
    reducerPath: "api", // ?Nombre del reducer
    refetchOnFocus: true,
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
        prepareHeaders: (headers, { }) => {
            headers.set("Content-Type", "application/json");
            const token = getLocalStorageItem("token");
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

        /* getCompras: builder.query({
            query: (params) => `reporteria/compras?${params}`,
        }), */
        /* getVentas: builder.query({
            query: (params) => `reporteria/ventas?${params}`,
        }), */
        getAlmacen: builder.query({
            query: (params) => `reporteria/almacen?${params}`,
        }),
        /* getMermas: builder.query({
            query: (params) => `reporteria/mermas?${params}`,
        }), */
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
                    method: "POST",
                    body: dataForm,
                };
            },
        }),
        putTaskStatus: builder.mutation({
            query: (data) => {
                return {
                    url: `tasks/${data.taskId}/update-status`,
                    method: "POST",
                    body: data,
                };
            },
        }),
        putTaskOrder: builder.mutation({
            query: (data) => {
                return {
                    url: `tasks/${data.taskId}/update-order?order=${data.order}`,
                    method: "POST",
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
        ? Formato de consulta - glosarios y tablas dinamicas
        */
        getMermas: builder.mutation({
            query: (data) => ({
                url: `reporteria/mermas?sum=${data.sum}&page=${data.page}`,
                method: "POST",
                body: data.filters,
            }),
        }),

        getVentas: builder.mutation({
            query: (data) => ({
                url: `reporteria/ventas?sum=${data.sum}&page=${data.page}&pageSize=5`,
                method: "POST",
                body: data.filters,
            }),
        }),
        getGlosariosVentas: builder.query({
            query: () => `glosario/glosario-ventas`
        }),

        getCompras: builder.mutation({
            query: (data) => ({
                url: `reporteria/compras?sum=${data.sum}&page=${data.page}&pageSize=5`,
                method: "POST",
                body: data.filters,
            }),
        }),
        getGlosariosCompras: builder.query({
            query: () => `glosario/glosario-compras`
        }),

        /*
        ? Formato de consulta - glosarios y tablas dinamicas
        */
    }),
});

export const {
    useGetReportQuery,


    useGetAlmacenQuery,
    useGetMovimientosQuery,

    useGetMermasMutation,
    useGetVentasMutation,
    useGetGlosariosVentasQuery,
    useGetComprasMutation,
    useGetGlosariosComprasQuery,

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
