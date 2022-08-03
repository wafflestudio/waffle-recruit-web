import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { setAccess } from '../redux/auth';
import store from '../redux/store';

import { getAccess, getRefresh } from './getAuth';
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
      config,
      response: { status },
    } = error;
    if (config.url === '/auth/refresh/') {
      if (window.location.hostname === 'localhost') {
        console.log('개발 중입니다. 배포 시에 이 코드를 제거하십시오.');
        return Promise.reject(error);
      }
      if (status === 400) {
        window.location.href = 'https://recruit.wafflestudio.com/signin';
      }
    }
    return Promise.reject(error);
  }
);

authRequester.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${getAccess()}`;
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
        const { data } = await requester.post('/auth/refresh/', { refresh: getRefresh() });
        store.dispatch(setAccess(data.token.access));
        saveJWT(data.token.access);
        return axios(config);
      } catch (e) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
