import items from "../data/items.json";
import users from "../data/users.json";

import { useContext, useEffect, useState } from "react";
import { AppDataContext } from "../providers/AppDataProvider";

function StorageManager() {
  const { appData, setAppData } = useContext(AppDataContext);

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // First Initialize

    setAppData({
      ...appData,
      users: localStorage.getItem("users")
        ? JSON.parse(localStorage.getItem("users"))
        : users,
      items: localStorage.getItem("items")
        ? JSON.parse(localStorage.getItem("items"))
        : items,
      orders: JSON.parse(localStorage.getItem("orders") ?? "[]"),
      orderItems: JSON.parse(localStorage.getItem("orderItems") ?? "[]"),
      cartItems: JSON.parse(localStorage.getItem("cartItems") ?? "[]"),
      supplyOrders: JSON.parse(localStorage.getItem("supplyOrders") ?? "[]"),
    });

    setHasInitialized(true);
  }, []);

  useEffect(() => {
    if (!hasInitialized) return;

    // Updates every time appData changes

    console.log(appData);
    localStorage.setItem("items", JSON.stringify(appData.items));
    localStorage.setItem("users", JSON.stringify(appData.users));
    localStorage.setItem("orders", JSON.stringify(appData.orders));
    localStorage.setItem("orderItems", JSON.stringify(appData.orderItems));
    localStorage.setItem("cartItems", JSON.stringify(appData.cartItems));
    localStorage.setItem("supplyOrders", JSON.stringify(appData.supplyOrders));
  }, [appData]);

  return <></>;
}

export default StorageManager;
