import "./App.css";
import Sidebar from "./comp/sideBar";
import Main from "./comp/main";
import { useState } from "react";
import SideBarTop from "./comp/sideBarTop";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./comp/HomePage";
import MarketPlace from "./comp/MarketPlace";
import  LogIn  from "./comp/authentication/login";
import SignUp from "./comp/authentication/signUp"
function App() {
  return (
 
    <BrowserRouter>
    <Routes>
    <Route path="/login" element={<LogIn/>} />
    <Route path="/signup" element={<SignUp/>} />
      <Route path="/" element={<HomePage/>} />
      <Route path="/marketplace" element={<MarketPlace/>}/>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
