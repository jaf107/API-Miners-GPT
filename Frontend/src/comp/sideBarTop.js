import React, { useState } from 'react';
import { Plus, Sidebar } from 'react-feather';
import SideBarMain from './sideBar';
import Main from './main';

function SideBarTop() {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div>
      {showSidebar && (
        <div className='md:flex  bg-black text-white hidden '>
          <button
            className='pl-2 pr-10 py-1 border-2 mx-6 my-4 border-white flex rounded-sm'
            onClick={toggleSidebar}
          >
            <Plus className='mr-2' /> New Chat
          </button>
          <button className='' onClick={toggleSidebar}>
            <Sidebar color='white' size={24} />
          </button>
        </div>
      )}
      {!showSidebar && (
        <div className='flex mt-2 bg-white'>
          <button className='' onClick={toggleSidebar}>
            <Sidebar color='black' size={24} />
          </button>
        </div>
      )}
      <div className='hidden md:block'>
      {showSidebar && <SideBarMain />}
      </div>
      
    </div>
  );
}

export default SideBarTop;
