import Home from "./pages/home/Home";
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import Profile from "./pages/profile/Profile"


import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route ,redirect,Navi} from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";


function App() {
  const {user}=useContext(AuthContext)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
              <Route path="/register" element={ user? <redirect to="/"/>: <Register /> }/>
              <Route path="/" element={ user? <Home />:<Login/> }/>
              {/* <Route path="/" element={  <Home /> }/> */}
              <Route path="/profile/:username" element={ <Profile /> }/>
              <Route path="/messenger" element={ !user? <redirect to="/"/> :<Messenger/> }/>
              
      </Routes>
    </BrowserRouter>
  )
}

export default App;
