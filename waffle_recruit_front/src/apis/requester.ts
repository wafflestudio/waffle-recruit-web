import axios from 'axios';

export const requester = axios.create({
  baseURL: 'http://recruit-api.wafflestudio.com',
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  withCredentials: true,
});
