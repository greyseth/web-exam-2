import "../assets/css/auth.css";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { AppDataContext } from "../providers/AppDataProvider";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function Auth() {
  const { userData, setUserData } = useContext(UserContext);
  const { appData, setAppData } = useContext(AppDataContext);

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const navigate = useNavigate();
  const [cookies, setCookies, removeCookies] = useCookies();

  function handleLogin() {
    const found = appData.users.filter(
      (u) => u.username === usernameInput && u.password === passwordInput
    );

    if (found.length > 0) {
      const foundData = {
        user_id: found[0].id_user,
        username: found[0].username,
        role: found[0].role,
      };

      setUserData(foundData);
      setCookies("login", foundData);
      navigate("/");
    } else alert("Username dan/atau password tidak sesuai!");
  }

  function handleRegister() {
    let biggestId = 0;
    appData.users.forEach((user) => {
      if (user.id_user >= biggestId) biggestId = user.id_user;
    });

    const updatedUsers = appData.users;
    const newUser = {
      id_user: biggestId + 1,
      username: usernameInput,
      password: passwordInput,
      role: "Konsumen",
    };
    updatedUsers.push(newUser);

    setAppData({ users: updatedUsers, ...appData });
    setUserData({
      user_id: newUser.id_user,
      username: newUser.username,
      role: newUser.role,
    });
    setCookies("login", newUser);

    navigate("/");
  }

  return (
    <>
      <section className="container-centered">
        <div className="panel auth-form">
          <h2>Aplikasi BI Rotan</h2>

          <input
            type="text"
            placeholder="Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />

          <button onClick={handleLogin}>Log In</button>
          <button onClick={handleRegister}>Register</button>
        </div>
      </section>
    </>
  );
}

export default Auth;
