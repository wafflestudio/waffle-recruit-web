import store from '../redux/store';

import { loadJWT, loadRefresh, loadUser } from './localStorages';

export const getAccess = () => {
  const tokenInRedux = store.getState().auth.access;
  if (tokenInRedux) {
    return tokenInRedux;
  }
  return loadJWT();
};

export const getRefresh = () => {
  const tokenInRedux = store.getState().auth.refresh;
  if (tokenInRedux) {
    return tokenInRedux;
  }
  return loadRefresh();
};

export const getUsername = () => {
  const tokenInRedux = store.getState().auth.username;
  if (tokenInRedux) {
    return tokenInRedux;
  }
  return loadUser();
};
