import CartIcon from "../assets/img/cart.svg";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";
import { useCookies } from "react-cookie";

function Header({ titleOverride }) {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);
  const [cookies, setCookies, removeCookies] = useCookies();

  function handleLogout() {
    setUserData(undefined);
    removeCookies("login");
    navigate("/auth");
  }

  return (
    <header className="header">
      {userData.role === "Konsumen" ? (
        <button
          className="secondary-btn"
          onClick={(e) => {
            navigate("/cart");
          }}
        >
          <img src={CartIcon} />
        </button>
      ) : null}

      <h2>{titleOverride ?? "BI Rotan Online Shopping"}</h2>
      <button
        className="secondary-btn"
        style={{ border: "2px solid var(--tertiary-color)" }}
        onClick={handleLogout}
      >
        Log Out
      </button>
    </header>
  );
}

export default Header;
