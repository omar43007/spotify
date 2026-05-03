import React from "react";

function StatCard({ title, value, icon }) {
  return (
    <div className="flex items-center">
      <span className="text-2xl mr-3">{icon}</span>
      <div>
        <div className="text-spotify-green text-3xl font-bold mb-1">
          {value}
        </div>
        <div className="text-spotify-lightgray text-sm">{title}</div>
      </div>
    </div>
  );
}

export default StatCard;
