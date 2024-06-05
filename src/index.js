import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./assets/css/index.css";
import reportWebVitals from "./reportWebVitals";

import App from "./App";
import Auth from "./pages/Auth";
import UserProvider from "./providers/UserProvider";
import AppDataProvider from "./providers/AppDataProvider";
import ItemDetails from "./components/consumer/ItemDetails";
import Manage from "./pages/Manage";
import {
  AddStock,
  AddUser,
  ManageReport,
  ManageStocks,
  ManageSupply,
  ManageTransactions,
  ManageUsers,
  ManageWelcome,
} from "./components/manage/ManagePages";
import Cart from "./pages/Cart";
import StorageManager from "./components/StorageManager";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/item/:item_id",
    element: <ItemDetails />,
  },
  {
    path: "/manage",
    element: <Manage />,
    children: [
      {
        index: true,
        element: <ManageWelcome />,
      },
      {
        path: "stock",
        element: <ManageStocks />,
        children: [
          {
            path: ":barang_id",
            element: null,
          },
        ],
      },
      {
        path: "stock/add",
        element: <AddStock />,
      },
      {
        path: "transaksi",
        element: <ManageTransactions />,
        children: [
          {
            path: ":trans_id",
            element: null,
          },
        ],
      },
      {
        path: "report",
        element: <ManageReport />,
      },
      {
        path: "supply",
        element: <ManageSupply />,
      },
      {
        path: "users",
        element: <ManageUsers />,
      },
      {
        path: "users/add",
        element: <AddUser />,
      },
    ],
  },
  {
    path: "/cart",
    element: <Cart />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppDataProvider>
      <UserProvider>
        <StorageManager />

        <RouterProvider router={router} />
      </UserProvider>
    </AppDataProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
