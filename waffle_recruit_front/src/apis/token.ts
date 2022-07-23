const jwtKey = 'access' as const;
const refreshKey = 'refresh' as const;

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
