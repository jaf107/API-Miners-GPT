import React from 'react';
import Main from './main';
import NavBar from './navBar';

function HomePage() {
  return (
    <>
      <NavBar />
      <div className='flex items-center'>
        <Main />
      </div>
    </>
  );
}

export default HomePage;
