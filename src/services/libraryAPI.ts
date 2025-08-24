/* Funcion base utilizar la API que se comunica con la BD de la biblioteca */

import axios from "axios";
import type { AxiosRequestConfig } from "axios"; // Se debe importar como un "tipo" de datos

const BASE_URL = "http://127.0.0.1:8000";

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
