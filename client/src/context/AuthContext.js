import {createContext, useEffect, useReducer} from "react";
import AuthReducer from "./AuthReducer";
import { LoginSuccess, LoginFailure } from "./AuthActions";


// const userFromLocalStorage = localStorage.getItem("user");
// let INITIAL_STATE = {
//     user: null,
//     isFetching: false,
//     error: false
// };

// if (userFromLocalStorage !== null) {
//     try {
//         INITIAL_STATE.user = JSON.parse(userFromLocalStorage);
//     } catch (error) {
//         console.error("Error parsing user from localStorage:", error);
//     }
// }

const INITIAL_STATE={
    user:JSON.parse(localStorage.getItem("user"))||null,
    
    // user:JSON.parse(localStorage.getItem("user"))||"jane",


    // user:{
        
    //         _id:  "65f3065fe00614a1ed363c2c",
    //         username: "jane",
    //         email: "jane@gmail.com",
    //         profilePicture: "",
    //         coverPicture: "",
    //         followers: [
    //           "65f305a9e00614a1ed363c28"
    //         ],
    //         following: ["65f30adc52cf6f4f04cfdc5f"],
    //         isAdmin: false,
    //         des: "hey its my updated desc",
    //         city: "New York",
    //         from: "madrid",
    //         relationship: 1
          

    // },
    isFetching:false,
    error:false
};

export const AuthContext=createContext(INITIAL_STATE);

export const AuthContextProvider=({children})=>{
    const [state,dispatch]=useReducer(AuthReducer,INITIAL_STATE);
    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(state.user))
      },[state.user])



    //   const login = async (userData) => {
    //     try {
         
    //         const res = await fetch("/auth/login", {
    //             method: "POST",
    //             body: JSON.stringify(userData),
    //             headers: {
    //                 "Content-Type": "application/json"
    //             }
    //         });
    //         if (!res.ok) {
    //             throw new Error('Failed to log in'); 
    //         }
    //         const data = await res.json();
    //         dispatch(LoginSuccess(data)); 
    //     } catch (error) {
    //         console.error('Login error:', error);
        
    //         dispatch(LoginFailure(error.message)); 
    //     }
    // };


    return (
        <AuthContext.Provider 
        value={{
            user:state.user,
            isFetching:state.isFetching,
            error:state.error,
            dispatch
            }}
        >
        {children}

        </AuthContext.Provider>
    )
}