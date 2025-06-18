/** @format */

import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const url_auth = `${BASE_URL}/auth`;
const url_api = `${BASE_URL}/api`;
const url_crud = `${BASE_URL}/crud`;
const url_storage = `${BASE_URL}/storage`;

const auth = axios.create({
  baseURL: url_auth,
});
const crud = axios.create({
  baseURL: url_crud,
});
const api = axios.create({
  baseURL: url_api,
});

const storage = axios.create({
  baseURL: url_storage,
});

// Add request interceptor for auth token
crud.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
crud.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export {
  auth,
  crud,
  api,
  storage,
  BASE_URL,
  url_auth,
  url_api,
  url_crud,
  url_storage,
};
