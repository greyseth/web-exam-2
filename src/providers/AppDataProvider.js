import { createContext, useState } from "react";
import items from "../data/items.json";
import users from "../data/users.json";

export const AppDataContext = createContext();

function AppDataProvider({ children }) {
  const [appData, setAppData] = useState({
    items: [],
    users: [],
    orders: [],
    orderItems: [],
    cartItems: [],
    supplyOrders: [],
  });

  return (
    <AppDataContext.Provider value={{ appData, setAppData }}>
      {children}
    </AppDataContext.Provider>
  );
}

export default AppDataProvider;
