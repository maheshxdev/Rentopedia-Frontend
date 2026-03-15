import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const UserContext = createContext();

const UserData = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get(
          "https://rentopedia-backend.onrender.com/api/user/me",
          { withCredentials: true }
        );
        setUser(res.data);
      } catch (err) {
        setUser(undefined);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserData;
export const useUser = () => useContext(UserContext);