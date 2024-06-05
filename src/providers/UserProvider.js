import { createContext, useState } from "react";

export const UserContext = createContext();

function UserProvider({ children }) {
  const [userData, setUserData] = useState({
    id_user: -1,
    username: "",
    role: "",
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
