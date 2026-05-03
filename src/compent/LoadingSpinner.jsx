import React from "react";
import { Atom } from "react-loading-indicators";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen bg-spotify-black">
      <div className="flex flex-col items-center">
        <Atom color="#32cd32" size="medium" text="" textColor="" />
      </div>
    </div>
  );
}

export default LoadingSpinner;
