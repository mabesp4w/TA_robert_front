/** @format */

import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const url_auth = `${BASE_URL}/auth`;
const url_api = `${BASE_URL}/api`;
const url_fuzzy = `${BASE_URL}/fuzzy`;
const url_crud = `${BASE_URL}/crud`;
const url_storage = `${BASE_URL}/storage`;

// Helper function untuk get token dari cookies
const getToken = () => {
  return Cookies.get("token");
};

// Helper function untuk setup axios interceptor
const setupAxiosInterceptor = (axiosInstance: ReturnType<typeof axios.create>) => {
  // Request interceptor - tambahkan token ke header
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle 401 unauthorized
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Token expired atau invalid, clear cookies dan redirect ke login
        Cookies.remove("token");
        Cookies.remove("refresh-token");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );
};

const auth = axios.create({
  baseURL: url_auth,
});

const crud = axios.create({
  baseURL: url_crud,
});

const api = axios.create({
  baseURL: url_api,
});

const fuzzy = axios.create({
  baseURL: url_fuzzy,
});

const storage = axios.create({
  baseURL: url_storage,
});

// Setup interceptors untuk semua axios instances (kecuali auth)
setupAxiosInterceptor(crud);
setupAxiosInterceptor(api);
setupAxiosInterceptor(fuzzy);
setupAxiosInterceptor(storage);

export {
  auth,
  crud,
  api,
  fuzzy,
  storage,
  BASE_URL,
  url_auth,
  url_api,
  url_crud,
  url_storage,
};
