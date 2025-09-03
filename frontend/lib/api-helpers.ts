import { ApiResponse } from './api';

// Función auxiliar para hacer peticiones a la API
export async function makeApiRequest<T>(url: string, data: FormData | null, method: string = "POST"): Promise<ApiResponse<T>> {
  try {
    const options: RequestInit = {
      method,
      credentials: "include",
      headers: {
        "Accept": "application/json",
      }
    };

    if (data) {
      options.body = data;
    }

    const response = await fetch(url, options);
    const jsonData = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data: jsonData,
      message: jsonData.message
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null as any,
      message: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Función auxiliar para hacer peticiones GET
export async function makeGetRequest<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json",
      }
    });
    const jsonData = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data: jsonData,
      message: jsonData.message
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null as any,
      message: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
