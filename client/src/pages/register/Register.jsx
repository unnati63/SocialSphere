import React from 'react'
import "./register.css";
import { useRef } from 'react';
import axios from 'axios';
// import { unstable_HistoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function Register() {
  const username=useRef();  
  const email=useRef();
  const password=useRef();  
  const passwordAgain=useRef();  

  const navigate=useNavigate();

  

  const handleClick=async (e)=>{
    e.preventDefault();
    if(passwordAgain.current?.value !== password.current?.value){
        passwordAgain.current?.setCustomValidity("Passwords don't match")
    }
    else{
        const user={
            username:username.current?.value,
            email:email.current?.value,
            password:password.current?.value,
        }
        try{
            await axios.post("http://localhost:8800/auth/register",user);
            navigate("/login")
        }catch(err){
            console.log(err);
        }
        
    }

  }


  return (
    <div className="login">
        <div className="loginWrapper">
            <div className="loginLeft">
                <h3 className="loginLogo">SocialSphere</h3>
                <span className="loginDesc">Connect with friends and the world around you on SocialSphere</span>
            </div>
            <div className="loginRight">
                <form className="loginBox" onSubmit={handleClick}>
                    <input placeholder="Username" required ref={username} className="loginInput" />
                    <input placeholder="Email" type='email' required ref={email} className="loginInput" />
                    <input placeholder="Password" type='password' minLength="6" required ref={password} className="loginInput" />
                    <input placeholder="Password Again" type='password' required ref={passwordAgain} className="loginInput" />
                    <button className="loginButton" type='submit'>Sign Up</button>
                    <button className="loginRegisterButton">Log In Account</button>
                </form>
            </div>
        </div>
    </div>
  )
}
