import { login, logout, onUserStateChange } from '../api/firebase';

const { createContext, useContext, useEffect, useState } = require('react');

const AuthContext = createContext();

export function AuthContextProvider({children}) {
  const [user, setUser] = useState();

  useEffect(() => {
    onUserStateChange((user) => {
      setUser(user);
    });
  }, []);

  return (
  <AuthContext.Provider value={{user, uid: user && user.uid , login, logout}}>
    {children}
  </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}