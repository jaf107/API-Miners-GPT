import "./App.css";
import Sidebar from "./comp/sideBar";
import Main from "./comp/main";
import { useState } from "react";
import SideBarTop from "./comp/sideBarTop";

function App() {
 
  return (
    <div className="flex w-[100vw]">
    <div className="w-1/5">
    <SideBarTop/>
    </div>
    <div className="w-4/5">
    <Main/>
    </div>
    </div>
  );
}

export default App;
