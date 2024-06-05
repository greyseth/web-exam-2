import { useContext, useEffect } from "react";
import { UserContext } from "./providers/UserProvider";
import { redirect, useNavigate } from "react-router-dom";
import LoginChecker from "./LoginChecker";
import Header from "./components/Header";
import ItemsList from "./components/consumer/ItemsList";

function App() {
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      if (userData.role !== "Konsumen") navigate("/manage");
    }
  }, []);

  return (
    <>
      <LoginChecker />

      <Header />

      {userData ? <ItemsList /> : null}
    </>
  );
}

export default App;
