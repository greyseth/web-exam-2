import { useContext, useEffect } from "react";
import { UserContext } from "./providers/UserProvider";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function LoginChecker({ checkAdmin }) {
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const [cookies, setCookies, removeCookies] = useCookies();

  useEffect(() => {
    if (cookies.login) setUserData(cookies.login);
    else {
      console.log("no cookies?");
      if (!userData) {
        navigate("/auth");
        return;
      }
    }

    if (checkAdmin) {
      if (userData.role === "Konsumen") navigate("/");
    }
  }, []);

  return <></>;
}

export default LoginChecker;
