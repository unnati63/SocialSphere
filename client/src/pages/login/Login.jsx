import React, { useContext, useRef } from "react";
import "./login.css";
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import { Link,useNavigate } from "react-router-dom";
// import {CircularProgress} from "@mate"

export default function Login() {
    const email=useRef();
    const password=useRef();
    const {user,isFetching,error,dispatch}=useContext(AuthContext);
    const navigate=useNavigate();
    const handleClick=async (e)=>{
        e.preventDefault();       
        await loginCall({email:email.current?.value,password:password.current?.value},dispatch); 
        if (!isFetching && !error && user) {
            navigate("/"); // Redirect to homepage after successful login
        }
    }
    console.log(user);
  return (
    <div className="login">
        <div className="loginWrapper">
            <div className="loginLeft">
                <h3 className="loginLogo">SocialSphere</h3>
                <span className="loginDesc">Connect with friends and the world around you on LamaSocial</span>
            </div>
            <div className="loginRight">
                <form className="loginBox" onSubmit={handleClick}>
                    <input placeholder="Email" type='email' required className="loginInput" ref={email}/>
                    <input placeholder="Password" type='password' required minLength="6" className="loginInput" ref={password}/>
                    <button className="loginButton" type="submit" disabled={isFetching}>{isFetching ? "loading" : "Log In"}</button>
                    <span className="loginForgot">Forgot Password</span>
                    <button className="loginRegisterButton">
                    <Link to="/register" style={{textDecoration:"none", color:"white"}}>
                    {isFetching ? "loading" : "Create a new Account"}
                    </Link>
                    
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}




