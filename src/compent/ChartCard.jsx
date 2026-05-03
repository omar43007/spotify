import React from "react";

function ChartCard({ title, children }) {
  return (
    <div className="bg-gradient-to-br from-spotify-darkgray to-spotify-gray rounded-xl shadow-lg p-6 border border-spotify-lightgray">
      <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
      {children}
    </div>
  );
}

export default ChartCard;
