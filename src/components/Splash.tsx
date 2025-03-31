import React from "react";
import { IoNewspaperOutline } from "react-icons/io5";

function Splash() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-blue-700">
        <div className="animate-pulse flex flex-col items-center">
          <IoNewspaperOutline className="h-24 w-24 text-white mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">NewsFlash</h1>
          <p className="text-white text-lg">
            Stay updated with the latest news
          </p>
        </div>
      </div>
    </>
  );
}

export default Splash;
