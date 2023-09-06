import React, { useState } from "react";
import axios from "axios";
import {LoginUrl, RegisterUrl} from "../Constants";
import Dropdown from "../components/Dropdown";
import "../styles/LoginRegister.css";
import { useNavigate  } from "react-router-dom";

function Auth() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [contactNo, setContactNo] = useState(null);

  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
  ];

  const toggleIsLogin = () =>{
    setUsername("");
    setPassword1("");
    setIsLogin(!isLogin);
  }

  const submitLogin = (e) => {
    e.preventDefault();
    axios
      .post(LoginUrl, {
        username: username,
        password: password1
      })
      .then((response) => {
        setMessage("Login Successful.");
        console.log(response);
        navigate("/");
      })
      .catch((error) => {
        setMessage(error.response.data.message);
        console.log(error);
      });
  };

  const submitRegister = (e) => {
    e.preventDefault();
    if (password1 !== password2) {
      setMessage("Passowrds do not match. Please check again");
    } else {
      axios
        .post(RegisterUrl, {
          name,
          username,
          password: password1,
          role,
          email,
          contactNo,
        })
        .then((response) => {
          setMessage("Registeration Successful.");
          console.log(response);
        })
        .catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });
    }
  };

  return (
    <div className="login-page">
      {isLogin ? (
        <form className="login-container" action="">
          <h2 className="mb-1">Login</h2>
          <input type="text" placeholder="Username" 
            onChange={(e) => {
              setUsername(e.target.value);
            }}/>
          <input type="password" placeholder="Password" 
            onChange={(e) => {
              setPassword1(e.target.value);
            }}/>
          <div className="flex-x">
            <button
              type="submit"
              onClick={toggleIsLogin}
            >
              Register
            </button>
            <button type="submit" onClick={submitLogin}>Login</button>
          </div>
      {}<p>{message}</p>
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
          {message && <span>{message}</span>}
          <div className="flex-x">
            <button
              type="submit"
              onClick={toggleIsLogin}
            >
              Login
            </button>
            <button type="submit" onClick={submitRegister}>
              Signup
            </button>
          </div>
      <p>{message}</p>
        </form>
      )}
    </div>
  );
}

export default Auth;
