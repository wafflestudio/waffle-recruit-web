import axios from 'axios';

// TODO .env.production
const isProduction = true;

export const requester = axios.create({
  baseURL: isProduction ? 'http://recruit-api.wafflestudio.com' : 'http://localhost:8000',
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  withCredentials: true,
});
