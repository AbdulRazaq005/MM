import React, { useState } from "react";
import axios from "axios";
import { API } from "../Constants";
import Dropdown from "../components/Dropdown";
import "../styles/LoginRegister.css";

function Auth() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [contactNo, setContactNo] = useState(null);

  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
  ];

  var submit = (e) => {
    e.preventDefault();
    if (password1 !== password2) {
      setErrorMessage("Passowrds do not match. Please check again");
    } else {
      axios
        .post(API.Register, {
          name,
          username,
          password: password1,
          role,
          email,
          contactNo,
        })
        .then((response) => {
          setErrorMessage("Registeration Successful.");
          console.log(response);
        })
        .catch((error) => {
          setErrorMessage("Registeration Failed.");
          console.log(error);
        });
    }
  };

  return (
    <div className="login-page">
      {isLogin ? (
        <form className="login-container" action="">
          <h2 className="mb-1">Login</h2>
          <input type="text" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <div className="flex-x">
            <button
              type="submit"
              onClick={() => {
                setIsLogin(!isLogin);
              }}
            >
              Register
            </button>
            <button type="submit">Login</button>
          </div>
        </form>
      ) : (
        <form className="login-container" action="">
          <h2>New user ? Signup</h2>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword1(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => {
              setPassword2(e.target.value);
            }}
          />
          <Dropdown options={roleOptions} setFunction={setRole} />
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="number"
            placeholder="Contact No."
            onChange={(e) => {
              setContactNo(e.target.value);
            }}
          />
          {errorMessage && <span>{errorMessage}</span>}
          <div className="flex-x">
            <button
              type="submit"
              onClick={() => {
                setIsLogin(!isLogin);
              }}
            >
              Login
            </button>
            <button type="submit" onClick={submit}>
              Signup
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Auth;
