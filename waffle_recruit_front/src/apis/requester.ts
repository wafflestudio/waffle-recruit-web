import axios from 'axios';

export const requester = axios.create({
  baseURL: 'http://15.165.48.17',
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  withCredentials: true,
});
