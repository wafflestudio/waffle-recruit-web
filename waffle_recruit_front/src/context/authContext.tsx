import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

interface AuthContext {
  user: string | null;
  setUser: (e: string) => void;
  clearUser: () => void;

  jwt: string | null;
  setJwt: (e: string) => void;
}

const Context = createContext<AuthContext>({
  user: null,
  jwt: null,
  setJwt: () => null,
  setUser: () => null,
  clearUser: () => null,
});

export const AuthContextProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [user, setUser] = useState<string | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);

  return (
    <Context.Provider
      value={{
        user,
        jwt,
        setJwt,
        setUser,
        clearUser: () => setUser(null),
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAuthContext = () => useContext(Context);
