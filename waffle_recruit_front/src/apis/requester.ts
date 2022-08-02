import axios from 'axios';
import { toast } from 'react-toastify';

import { loadJWT, loadRefresh, saveJWT } from './token';

// TODO .env.production
const isProduction = true;

const baseURL = isProduction ? 'https://recruit2022-api.wafflestudio.com' : 'http://localhost:8000';

export const requester = axios.create({
  baseURL: baseURL,
});

export const authRequester = axios.create({
  baseURL: baseURL,
});

authRequester.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${loadJWT()}`;
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
  async (error) => {
    const {
      config,
      response: { status },
    } = error;
    const originalRequest = config;
    try {
      const { data } = await requester.post('/auth/refresh/', { refresh: loadRefresh() });
      saveJWT(data.access);
      toast.info('토큰이 갱신되었습니다');
      return axios(originalRequest);
    } catch (e) {
      toast.error('로그인이 만료되었습니다.');
      return Promise.reject(error);
    }
  }
);
