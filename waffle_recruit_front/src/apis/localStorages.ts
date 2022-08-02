const jwtKey = 'access' as const;
const refreshKey = 'refresh' as const;
const userKey = 'username' as const;
const recentSubmitKey = 'recent_submit' as const;

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

//username
export const saveUser = (username: string) => {
  return localStorage.setItem(userKey, username);
};
export const loadUser = () => {
  return localStorage.getItem(userKey);
};

//recent submit
export const saveRecentSubmit = (recentSubmit: string, prob_num: string) => {
  return localStorage.setItem(recentSubmitKey + prob_num, recentSubmit);
};
export const loadRecentSubmit = (prob_num: string) => {
  return localStorage.getItem(recentSubmitKey + prob_num);
};
