import "./App.css";
import Sidebar from "./comp/sideBar";
import Main from "./comp/main";
import { useState } from "react";
import SideBarTop from "./comp/sideBarTop";

function App() {
  return (
    <div className="flex w-[100vw]">
      <Main />
    </div>
  );
}

export default App;
