import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useListeningData } from "../context/ListeningDataContext";
import LoadingSpinner from "../compent/LoadingSpinner";
import {
  ResponsiveContainer,
  Area,
  YAxis,
  XAxis,
  AreaChart,
  Tooltip,
} from "recharts";

import StatCard from "../compent/StatCard";

function Artist() {
  const { artistName } = useParams();
  const navigate = useNavigate();
  const { getArtistData, loading } = useListeningData();

  const decodedArtistName = decodeURIComponent(artistName);
  const artistData = getArtistData(decodedArtistName);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!artistData) {
    return (
      <div className="w-full min-h-screen bg-spotify-black text-white p-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6">Artist Not Found</h1>
        <p className="text-spotify-lightgray mb-8">
          No data available for {decodedArtistName}
        </p>
        <button
          onClick={() => navigate("/statistics")}
          className="bg-spotify-green hover:bg-green-600 text-spotify-black font-bold py-2 px-6 rounded-full transition-colors "
        >
          Back to Statistics
        </button>
      </div>
    );
  }

  const chartData = artistData.topSongs.map((song, index) => ({
    name: song.song,
    plays: song.count,
    color: `hsl(${index * 40}, 70%, 50%)`,
    index: index + 1,
  }));

  return (
    <div className="w-full min-h-screen bg-spotify-black text-white p-4 md:p-8">
      <div className="w-full mx-auto">
        <button
          onClick={() => navigate("/statistics")}
          className="mb-6 flex items-center text-spotify-green hover:text-green-400 transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Statistics
        </button>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-gray-700 rounded-full w-32 h-32 flex items-center justify-center mb-4">
            <div className="bg-gray-700 rounded-full w-32 h-32 flex items-center justify-center mb-4 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=facearea&w=200&h=200&q=80"
                alt="Artist Icon"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            {artistData.artistName}
          </h1>
          <p className="text-spotify-lightgray mt-2">
            {artistData.totalPlays} plays
          </p>
        </div>
        <div className="h-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16 h-18">
          <div className="bg-spotify-darkgray p-6 rounded-xl text-center ">
            <StatCard
              title="Unique songs"
              value={artistData.uniqueSongs}
              icon="🎧"
            ></StatCard>
          </div>

          <div className="bg-spotify-darkgray p-6 rounded-xl text-center">
            <StatCard
              title="Total of Plays %"
              value={artistData.TotalofPlays}
              icon="📊"
            ></StatCard>
          </div>

          <div className="bg-spotify-darkgray p-6 rounded-xl text-center">
            <StatCard
              title="Top Artist Rank"
              value={artistData.topSongs.length}
              icon="🎵"
            ></StatCard>
          </div>
          <div className="bg-spotify-darkgray p-6 rounded-xl text-center">
            <StatCard
              title="Total Listening Time (Minutes)"
              value={artistData.totalMinutes}
              icon="⏱️"
            ></StatCard>
          </div>
        </div>
        <div className="h-10"></div>
        {/* cahr */}
        <div className="bg-spotify-darkgray rounded-xl p-6 mb-12 mt-16  ">
          <h2 className="text-2xl font-bold mb-6 text-center">Top Songs</h2>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
            >
              <defs>
                <linearGradient id="spotifyGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1DB954" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#1DB954" stopOpacity={0.2} />
                </linearGradient>
              </defs>

              <XAxis dataKey="name" stroke="#b3b3b3" />
              <YAxis stroke="#b3b3b3" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#282828",
                  border: "1px solid #404040",
                }}
                labelStyle={{ color: "#1DB954", fontWeight: "bold" }}
                formatter={(value) => [`${value} Minutes`, "Plays"]}
                labelFormatter={(value) => `Song: ${value}`}
              />

              <Area
                type="monotone"
                dataKey="plays"
                stroke="#1DB954"
                fill="url(#spotifyGreen)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="h-10"></div>
        <div className="mt-6 overflow-x-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Top 20 Songs by Listening Time
          </h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-spotify-lightgray">
                <th className="pb-3 text-left font-medium text-spotify-lightgray">
                  #
                </th>
                <th className="pb-3 text-left font-medium text-spotify-lightgray">
                  Song
                </th>
                <th className="pb-3 text-right font-medium text-spotify-lightgray">
                  Minutes
                </th>
              </tr>
            </thead>
            <tbody>
              {artistData.topSongs.map((song, index) => (
                <tr
                  key={index}
                  className="border-b border-spotify-lightgray last:border-0 hover:bg-spotify-gray transition-colors"
                >
                  <td className="py-4 text-spotify-lightgray font-medium w-12">
                    {index + 1}
                  </td>
                  <td className="py-4 font-medium text-white">{song.song}</td>
                  <td className="py-4 text-right text-spotify-green font-medium">
                    {song.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Artist;
