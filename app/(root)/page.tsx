import React from 'react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-20 font-extrabold text-3xl ">
      <p>
        Welcome to{' '}
        <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 bg-clip-text text-transparent">
          BUG TRACKER
        </span>
      </p>
    </div>
  );
};

export default Home;
