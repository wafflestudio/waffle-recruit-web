import axios from 'axios';

export const requester = axios.create({
  baseURL: 'http://15.165.48.17',
});

requester.defaults.xsrfCookieName = 'csrftoken';
requester.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
requester.defaults.withCredentials = true;
