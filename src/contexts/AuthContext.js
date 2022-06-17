import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { app } from "../firebase";

const auth = getAuth(app);
const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        history.push("/chats");
      } else {
        history.push("/");
      }
    });
  }, [user, history]);

  const value = { user };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
