import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { loadJWT, loadRefresh, saveJWT } from './localStorages';

// TODO .env.production
const isProduction = true;

const baseURL = isProduction ? 'https://recruit2022-api.wafflestudio.com' : 'http://localhost:8000';

export const requester = axios.create({
  baseURL: baseURL,
});

export const authRequester = axios.create({
  baseURL: baseURL,
});

requester.interceptors.response.use(
  (response) => {
    if (response.config.url === '/auth/refresh/') toast.success('로그인이 갱신되었습니다');
    return response;
  },
  (error) => {
    const {
      response: { status },
    } = error;

    if (status === 400) {
      alert('로그인에 실패했습니다. 초기 화면으로 돌아갑니다.');
      window.location.href = 'https://recruit.wafflestudio.com/signin';
    }
    return Promise.reject(error);
  }
);

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
      response: { status, data },
    } = error;
    if (status === 401) {
      try {
        const { data } = await requester.post('/auth/refresh/', { refresh: loadRefresh() });
        saveJWT(data.token.access);
        return axios(config);
      } catch (e) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
