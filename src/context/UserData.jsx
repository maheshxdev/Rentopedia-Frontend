// context/UserData.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true; // send httpOnly cookie

const UserContext = createContext();

const UserData = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};


export default UserData;
export const useUser = () => useContext(UserContext);
