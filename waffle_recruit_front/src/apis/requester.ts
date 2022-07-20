import axios from 'axios';

// TODO .env.production
const isProduction = false;

export const requester = axios.create({
  baseURL: isProduction ? 'https://recruit-api.wafflestudio.com' : 'http://localhost:8000',
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  withCredentials: true,
});
