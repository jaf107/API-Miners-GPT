import React, { useState } from 'react';
import { MessageSquare, Plus, Sidebar } from 'react-feather';

function SideBar() {
  const [showMenu, setShowMenu] = useState(false);

  const chatThreads = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'David Johnson' },
  ];

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="fixed h-full  w-1/5 bg-[#202123] text-white">
      {/* Mobile menu toggle button */}
      <div className="flex justify-end p-4 md:hidden">
        <button
          className="p-2 rounded-full bg-white text-black"
          onClick={toggleMenu}
        >
          {showMenu ? '+' : '-'} 
        </button>
      </div>
      {/* Chat threads */}


      {/* Chat threads */}
      <div className={`px-4 py-2 ${showMenu ? 'block' : 'hidden'} md:block`}>
        {chatThreads.map((thread) => (
          <div key={thread.id} className="flex items-center my-2 px-2">
            <span className="mr-2">
              <MessageSquare/>
            </span>
            <span className='text-md mb-1 pb-1'> {thread.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideBar;
