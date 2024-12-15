"use client";
import { EnvConfig } from "@/constants/env.config";
import { getLocalStorageItem, removeFromLocalStorage, setLocalStorageItem } from "@/hooks/localStorage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const config = EnvConfig();
export const getUserData = () => getLocalStorageItem("user_data");

export const authApi = createApi({
  reducerPath: "auth",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: config.api,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    postUserRegister: builder.mutation({
      query: (data) => {
        // Validar las contraseñas
        if (data.password !== data.confirmPassword) {
          throw new Error("Las contraseñas no coinciden.");
        }
        return {
          url: "users/register",
          method: "POST",
          body: data,
        };
      },
    }),
    postUserLogin: builder.mutation({
      query: (data) => ({
        url: "users/login",
        method: "POST",
        body: data,
      }),
      // Hook para manejar la respuesta y almacenar el token
      onQueryStarted: async (data,{ queryFulfilled }) => {
        try {
          const { data: responseData } = await queryFulfilled;
          // Verifica si la respuesta contiene un token
          if (responseData.token) {
            // Guardar el token en localStorage
            setLocalStorageItem("user-role", "user")
            setLocalStorageItem("token", responseData.token);
           }
        } catch (error) {
          console.error("Error al hacer login:", error);
        }
      },
    }),
    postLogout: builder.mutation({
      query: (data) => ({
        url: `users/logout`,
        method: "POST",
        body: data,
      }),
      // Hook para limpiar el token al hacer logout
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          removeFromLocalStorage("token");
        } catch (error) {
          console.error("Error al hacer logout:", error);
        }
      },
    }),
  }),
});

export const {
  usePostLogoutMutation,
  usePostUserLoginMutation,
  usePostUserRegisterMutation,
} = authApi;
