import React, { useEffect } from 'react';
import Main from './main';
import NavBar from './navBar';
import { useNavigate } from 'react-router-dom';

function HomePage() {
 
  return (
    <>
      <NavBar />
      <div className="flex items-center">
        <Main />
      </div>
    </>
  );
}

export default HomePage;
