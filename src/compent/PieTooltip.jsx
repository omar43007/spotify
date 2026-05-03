import React from "react";

function PieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-spotify-gray p-3 rounded-md shadow-lg border border-spotify-lightgray">
        <p className="text-white font-bold">{payload[0].name}</p>
        <p className="text-spotify-green">{`${payload[0].value} hours`}</p>
      </div>
    );
  }
  return null;
}

export default PieTooltip;
