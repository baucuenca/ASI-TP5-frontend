/* Funcion base utilizar la API que se comunica con la BD de la biblioteca */

import axios from "axios";
import type { AxiosRequestConfig } from "axios"; // Se debe importar como un "tipo" de datos

const SERVER_PUBLIC_IP = import.meta.env.VITE_SERVER_PUBLIC_IP;
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT;

const BASE_URL = `http://${SERVER_PUBLIC_IP}:${BACKEND_PORT}`;

type HttpMethod = "get" | "post" | "patch" | "delete";

export async function libraryAPI<T = unknown>( // Recibe el tipo de dato esperado por la funcion (T), por defecto es "unknown"
  method: HttpMethod,
  path: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axios({
    baseURL: BASE_URL,
    url: path,
    method,
    data,
    headers: {
      "Content-Type": "application/json",
      ...config?.headers,
    },
  });
  return response.data as T;
}
