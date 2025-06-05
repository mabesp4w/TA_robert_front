/** @format */

import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const url_auth = `${BASE_URL}/auth`;
const url_api = `${BASE_URL}/api`;
const url_fuzzy = `${BASE_URL}/fuzzy`;
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
const fuzzy = axios.create({
  baseURL: url_fuzzy,
});
const storage = axios.create({
  baseURL: url_storage,
});

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
