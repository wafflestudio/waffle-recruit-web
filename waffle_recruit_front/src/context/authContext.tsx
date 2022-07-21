import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

interface AuthContext {
  user: string | null;
  setUser: (e: string) => void;
  clearUser: () => void;

  jwt: string | null;
  setJwt: (e: string) => void;
  csrf: string | null;
  setCsrf: (e: string) => void;
}

const Context = createContext<AuthContext>({
  user: null,
  csrf: null,
  jwt: null,
  setJwt: () => null,
  setUser: () => null,
  clearUser: () => null,
  setCsrf: () => null,
});

export const AuthContextProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [user, setUser] = useState<string | null>(null);
  const [csrf, setCsrf] = useState<string | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);

  return (
    <Context.Provider
      value={{
        user,
        csrf,
        jwt,
        setJwt,
        setUser,
        setCsrf,
        clearUser: () => setUser(null),
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAuthContext = () => useContext(Context);
