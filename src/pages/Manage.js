import "../assets/css/manage.css";

import LoginChecker from "../LoginChecker";
import Header from "../components/Header";
import Sidebar from "../components/manage/Sidebar";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { Outlet, Route, Routes, useLocation, useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import { AppDataContext } from "../providers/AppDataProvider";

function Manage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, setUserData } = useContext(UserContext);
  const { appData, setAppData } = useContext(AppDataContext);
  const [cookies, setCookies, removeCookies] = useCookies();

  const [adminFunctions, setAdminFunctions] = useState([]);
  const [curPage, setCurPage] = useState("");

  useEffect(() => {
    if (userData) {
      let newAdminFunctions = [];

      if (userData.role === "Supplier") {
        // newAdminFunctions.push({
        //   display: "List Stock",
        //   action: () => {
        //     navigate("/manage/stock");
        //     setCurPage("stock");
        //   },
        //   disabledCheck: "stock",
        // });

        newAdminFunctions.push({
          display: "List Permintaan Persediaan",
          action: () => {
            navigate("/manage/supply");
            setCurPage("supply");
          },
          disabledCheck: "supply",
        });
      } else if (userData.role === "Kasir") {
        newAdminFunctions.push({
          display: "List Transaksi",
          action: () => {
            navigate("/manage/transaksi");
            setCurPage("transactions");
          },
          disabledCheck: "transaksi",
        });
      } else if (userData.role === "Gudang") {
        // newAdminFunctions.push({
        //   display: "Buat Laporan Stock",
        //   action: () => {
        //     navigate("/manage/report");
        //     setCurPage("report");
        //   },
        //   disabledCheck: "report",
        // });

        newAdminFunctions.push({
          display: "List Stock",
          action: () => {
            navigate("/manage/stock");
            setCurPage("stock");
          },
          disabledCheck: "stock",
        });
      } else if (userData.role === "Admin") {
        // newAdminFunctions.push({
        //   display: "Buat Laporan Stock",
        //   action: () => {
        //     navigate("/manage/report");
        //     setCurPage("report");
        //   },
        //   disabledCheck: "report",
        // });
        newAdminFunctions.push({
          display: "List Transaksi",
          action: () => {
            navigate("/manage/transaksi");
            setCurPage("transactions");
          },
          disabledCheck: "transaksi",
        });
        newAdminFunctions.push({
          display: "List Stock",
          action: () => {
            navigate("/manage/stock");
            setCurPage("stock");
          },
          disabledCheck: "stock",
        });
        newAdminFunctions.push({
          display: "List User",
          action: () => {
            navigate("/manage/users");
            setCurPage("users");
          },
          disabledCheck: "users",
        });
        newAdminFunctions.push({
          display: "List Permintaan Persediaan",
          action: () => {
            navigate("/manage/supply");
            setCurPage("supply");
          },
          disabledCheck: "supply",
        });
      }

      // newAdminFunctions.push({
      //   display: "[DEBUG] Log App Data",
      //   action: () => {
      //     console.log(appData);
      //   },
      // });

      // newAdminFunctions.push({
      //   display: "[DEBUG] Log Login Data",
      //   action: () => {
      //     console.log(userData);
      //   },
      // });

      setAdminFunctions(newAdminFunctions);
    }
  }, [userData]);

  return (
    <>
      <LoginChecker checkAdmin={true} />

      <Header titleOverride={"BI Rotan Admin Page"} />

      <section className="manage-container">
        <Sidebar
          buttons={adminFunctions}
          curPage={
            location.pathname.split("/")[
              location.pathname.split("/").length - 1
            ]
          }
        />

        <Outlet />
      </section>
    </>
  );
}

export default Manage;
