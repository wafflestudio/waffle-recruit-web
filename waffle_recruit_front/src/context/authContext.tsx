import React, { createContext, useContext, useMemo, useState } from 'react';

interface AuthContext {
  user: string | null;
  setUser: (e: string) => void;
  clearUser: () => void;

  csrf: string | null;
  setCsrf: (e: string) => void;
}

const Context = createContext<AuthContext | undefined>(undefined);

export const AuthContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [csrf, setCsrf] = useState<string | null>(null);

  const value = useMemo<AuthContext>(
    () => ({
      user,
      csrf,
      setUser,
      setCsrf,
      clearUser: () => setUser(null),
    }),
    [user, setUser]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useAuthContext = (): AuthContext => {
  return useContext(Context) as AuthContext;
};
