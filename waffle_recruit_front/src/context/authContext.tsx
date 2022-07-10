import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

interface AuthContext {
  user: string | null;
  setUser: (e: string) => void;
  clearUser: () => void;

  csrf: string | null;
  setCsrf: (e: string) => void;
}

const Context = createContext<AuthContext>({
  user: null,
  csrf: null,
  setUser: () => null,
  clearUser: () => null,
  setCsrf: () => null,
});

export const AuthContextProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [user, setUser] = useState<string | null>(null);
  const [csrf, setCsrf] = useState<string | null>(null);

  return (
    <Context.Provider
      value={{
        user,
        csrf,
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
