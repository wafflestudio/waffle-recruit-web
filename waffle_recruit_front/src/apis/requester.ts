import axios from 'axios';

export const requester = axios.create({
  baseURL: 'https://recruit-api.wafflestudio.com',
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});
