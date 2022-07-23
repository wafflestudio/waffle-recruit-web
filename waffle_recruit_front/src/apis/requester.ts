import axios from 'axios';

import { loadJWT } from './token';

// TODO .env.production
const isProduction = false;

const baseURL = isProduction ? 'https://recruit-api.wafflestudio.com' : 'http://localhost:8000';

export const requester = axios.create({
  baseURL: baseURL,
  // xsrfCookieName: 'csrftoken',
  // xsrfHeaderName: 'X-CSRFToken',
  // withCredentials: true,
});

export const authRequester = axios.create({
  baseURL: baseURL,
});

authRequester.interceptors.request.use(
  (config) => {
    config.headers.Authorization = loadJWT();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
authRequester.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
