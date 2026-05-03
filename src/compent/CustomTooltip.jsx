import React from "react";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-spotify-gray p-3 rounded-md shadow-lg border border-spotify-lightgray">
        <p className="text-white font-bold">{label}</p>
        <p className="text-spotify-green">{`${payload[0].value} minutes`}</p>
      </div>
    );
  }
  return null;
}

export default CustomTooltip;
