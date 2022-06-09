import React, { FC } from "react";

const WelcomeScreen: FC = () => {
  return (
    <div className="absolute p-5 h-full inset-0 text-cyan-400 z-10 bg-dark-800">
      <h1 className="text-lg md:text-3xl font-medium">Welcome to Web Pen</h1>
      <div className="mt-2 flex gap-2">
        <button></button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
