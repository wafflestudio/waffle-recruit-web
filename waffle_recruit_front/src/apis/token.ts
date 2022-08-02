const jwtKey = 'access' as const;
const refreshKey = 'refresh' as const;
const userKey = 'username' as const;

export const loadJWT = () => {
  return localStorage.getItem(jwtKey);
};

export const loadRefresh = () => {
  return localStorage.getItem(refreshKey);
};

export const saveJWT = (token: string) => {
  return localStorage.setItem(jwtKey, token);
};
export const saveRefresh = (token: string) => {
  return localStorage.setItem(refreshKey, token);
};

export const saveTokens = ({ access, refresh }: { access: string; refresh: string }) => {
  saveJWT(access);
  saveRefresh(refresh);
};

export const saveUser = (username: string) => {
  return localStorage.setItem(userKey, username);
};
export const loadUser = () => {
  return localStorage.getItem(userKey);
};
