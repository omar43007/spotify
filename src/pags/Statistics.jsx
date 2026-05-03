import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useListeningData } from "../context/ListeningDataContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./Statistics.css";
import LoadingSpinner from "../compent/LoadingSpinner";
import StatCard from "../compent/StatCard";
import ChartCard from "../compent/ChartCard";
import CustomTooltip from "../compent/CustomTooltip";
import PieTooltip from "../compent/PieTooltip";

function Statistics() {
  const navigate = useNavigate();
  const { listeningData, loading } = useListeningData();

  const TIME_RANGES = {
    "4w": 4 * 7 * 24 * 60 * 60 * 1000,
    "6m": 180 * 24 * 60 * 60 * 1000,
    "1y": 365 * 24 * 60 * 60 * 1000,
    all: Infinity,
  };

  const TimeRangeLabels = {
    "4w": "4 weeks",
    "6m": "6 months",
    "1y": "year",
    all: "all time",
  };

  const SEASONS = {
    Winter: "Winter",
    Spring: "Spring",
    Summer: "Summer",
    Fall: "Fall",
  };

  const GREEN_GRADIENT = [
    { offset: "0%", color: "#1DB954", opacity: 1 },
    { offset: "100%", color: "#0d7230", opacity: 1 },
  ];

  const COLORS = [
    "#1DB954",
    "#1ed760",
    "#4BFFA5",
    "#9BF0E1",
    "#FFD700",
    "#FF6B6B",
  ];

  // Get season from date
  const getSeason = (date) => {
    const month = date.getMonth() + 1;
    if ([12, 1, 2].includes(month)) return "Winter";
    if ([3, 4, 5].includes(month)) return "Spring";
    if ([6, 7, 8].includes(month)) return "Summer";
    if ([9, 10, 11].includes(month)) return "Fall";
  };

  const [timeRange, setTimeRange] = useState("all");
  const [activeTab, setActiveTab] = useState("artists");

  const filteredPlays = useMemo(() => {
    // ✅ التأكد أن listeningData مصفوفة قبل استخدام filter
    if (!Array.isArray(listeningData) || listeningData.length === 0) return [];

    const now = new Date("2024-01-01"); // تاريخ ثابت للمقارنة (يمكن تعديله حسب الحاجة)
    const rangeLimit = TIME_RANGES[timeRange];

    return listeningData.filter((entry) => {
      if (!entry.ts) return timeRange === "all";
      const tsMs = new Date(entry.ts).getTime();
      return now - tsMs <= rangeLimit;
    });
  }, [timeRange, listeningData]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!Array.isArray(filteredPlays) || filteredPlays.length === 0)
      return null;

    const totalPlays = filteredPlays.filter(
      (item) => item.ms_played > 0,
    ).length;
    const totalListeningMs = filteredPlays.reduce(
      (a, b) => a + (b.ms_played || 0),
      0,
    );
    const totalMinutes = Math.round(totalListeningMs / 60000);

    // Unique songs
    const uniqueSongs = new Set();
    filteredPlays.forEach((element) => {
      if (element.master_metadata_track_name) {
        uniqueSongs.add(element.master_metadata_track_name);
      }
    });

    // Unique days
    const uniqueDays = new Set();
    filteredPlays.forEach((element) => {
      if (element.ts) {
        const dayStr = new Date(element.ts).toISOString().slice(0, 10);
        uniqueDays.add(dayStr);
      }
    });

    // Time of day
    const hourMap = Array(24).fill(0);
    filteredPlays.forEach((element) => {
      if (element.ts) {
        const hour = new Date(element.ts).getHours();
        hourMap[hour] += element.ms_played || 0;
      }
    });
    const timeOfDayData = hourMap.map((ms, hour) => ({
      name: `${hour}:00`,
      minutes: Math.round(ms / 60000),
    }));

    // Seasons
    const seasonsMap = { Winter: 0, Spring: 0, Summer: 0, Fall: 0 };
    filteredPlays.forEach((element) => {
      if (element.ts) {
        const season = getSeason(new Date(element.ts));
        seasonsMap[season] += element.ms_played || 0;
      }
    });
    const seasonData = Object.entries(seasonsMap).map(([season, ms]) => ({
      name: SEASONS[season],
      value: Math.round(ms / 3600000),
    }));

    // Top artists
    const artistCounts = {};
    filteredPlays.forEach((element) => {
      const artist = element.master_metadata_album_artist_name;
      if (artist) {
        artistCounts[artist] = (artistCounts[artist] || 0) + 1;
      }
    });
    const topArtists = Object.entries(artistCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 100);

    // Top songs
    const songTimes = {};
    filteredPlays.forEach((element) => {
      const song = element.master_metadata_track_name;
      const artist = element.master_metadata_album_artist_name;
      if (song && artist) {
        const key = `${song} - ${artist}`;
        songTimes[key] = (songTimes[key] || 0) + (element.ms_played || 0);
      }
    });
    const topSongs = Object.entries(songTimes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 100)
      .map(([song, ms]) => [song, Math.round(ms / 60000)]);

    return {
      totalPlays,
      totalMinutes,
      uniqueSongs: uniqueSongs.size,
      uniqueDays: uniqueDays.size,
      avgDaily: uniqueDays.size
        ? Math.round(totalMinutes / uniqueDays.size)
        : 0,
      timeOfDayData,
      seasonData,
      topArtists,
      topSongs,
    };
  }, [filteredPlays]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // ✅ التحقق من وجود البيانات بشكل صحيح
  if (!Array.isArray(listeningData) || listeningData.length === 0 || !stats) {
    return (
      <div className="flex justify-center items-center h-screen bg-spotify-black">
        <div className="text-xl font-bold text-white">
          No listening data available
        </div>
      </div>
    );
  }

  // Render top 100 artists and songs in a tabbed interface
  const renderTop100 = () => (
    <div className="bg-spotify-darkgray rounded-xl shadow-lg p-6 border border-spotify-lightgray">
      <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <button
          className={`px-6 py-3 rounded-full font-bold text-base md:text-lg transition-all transform hover:scale-105 duration-300 ${
            activeTab === "artists"
              ? "bg-gradient-to-r from-spotify-green to-emerald-600 text-spotify-black shadow-lg shadow-emerald-900/50"
              : "bg-spotify-gray text-spotify-lightgray hover:text-white hover:bg-spotify-lightgray"
          }`}
          onClick={() => setActiveTab("artists")}
        >
          Top 100 Artists
        </button>

        <div className="hidden md:block w-8"></div>

        <button
          className={`px-6 py-3 rounded-full font-bold text-base md:text-lg transition-all transform hover:scale-105 duration-300 ${
            activeTab === "songs"
              ? "bg-gradient-to-r from-spotify-green to-emerald-600 text-spotify-black shadow-lg shadow-emerald-900/50"
              : "bg-spotify-gray text-spotify-lightgray hover:text-white hover:bg-spotify-lightgray"
          }`}
          onClick={() => setActiveTab("songs")}
        >
          Top 100 Songs
        </button>
      </div>

      <div className="overflow-y-auto max-h-[500px] custom-scrollbar">
        <table className="w-full">
          <thead className="sticky top-0 bg-spotify-darkgray z-10">
            <tr className="border-b border-spotify-lightgray">
              <th className="pb-3 text-left font-medium text-spotify-lightgray w-12">
                #
              </th>
              <th className="pb-3 text-left font-medium text-spotify-lightgray">
                {activeTab === "artists" ? "Artist" : "The song"}
              </th>
              <th className="pb-3 text-right font-medium text-spotify-lightgray">
                {activeTab === "artists" ? "Plays" : "Minutes"}
              </th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === "artists" ? stats.topArtists : stats.topSongs).map(
              ([name, value], index) => (
                <tr
                  key={index}
                  className="border-b border-spotify-lightgray last:border-0 hover:bg-spotify-gray transition-colors"
                >
                  <td className="py-4 text-spotify-lightgray font-medium">
                    {index + 1}
                  </td>
                  <td className="py-4 font-medium text-white">
                    <div className="flex items-center">
                      <div className="ml-3">
                        {activeTab === "artists" ? (
                          <button
                            onClick={() =>
                              navigate(`/artist/${encodeURIComponent(name)}`)
                            }
                            className="text-left hover:text-spotify-green transition-colors focus:outline-none cursor-pointer"
                          >
                            {name}
                          </button>
                        ) : (
                          <>
                            <div className="font-medium">
                              {name.split(" - ")[0]}
                            </div>
                            <div className="text-sm text-spotify-lightgray">
                              {name.split(" - ")[1]}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-right text-spotify-green font-medium">
                    {value}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-spotify-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Listening statistics
            </h1>
            <p className="text-spotify-lightgray">
              Personalized analytics for your Spotify listening
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(TimeRangeLabels).map(([key, label]) => (
                <button
                  key={key}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    timeRange === key
                      ? "bg-spotify-green text-spotify-black font-bold"
                      : "bg-spotify-gray hover:bg-spotify-lightgray text-white"
                  }`}
                  onClick={() => setTimeRange(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </header>
        <div className="h-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16 h-18">
          <div className="bg-spotify-darkgray p-6 rounded-xl text-center ">
            <StatCard title="Total plays" value={stats.totalPlays} icon="🎵" />
          </div>
          <div className="bg-spotify-darkgray p-6 rounded-xl text-center ">
            <StatCard
              title="Listening minutes"
              value={stats.totalMinutes}
              icon="⏱️"
            />
          </div>
          <div className="bg-spotify-darkgray p-6 rounded-xl text-center ">
            <StatCard
              title="Unique songs"
              value={stats.uniqueSongs}
              icon="🎧"
            />
          </div>
          <div className="bg-spotify-darkgray p-6 rounded-xl text-center ">
            <StatCard
              title="Daily average (minutes)"
              value={stats.avgDaily}
              icon="📊"
            />
          </div>
        </div>
        <div className="h-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Listen by time">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stats.timeOfDayData}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                    {GREEN_GRADIENT.map((stop, index) => (
                      <stop
                        key={index}
                        offset={stop.offset}
                        stopColor={stop.color}
                        stopOpacity={stop.opacity}
                      />
                    ))}
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="#b3b3b3"
                  tick={{ fill: "#b3b3b3", fontSize: 12 }}
                />
                <YAxis
                  stroke="#b3b3b3"
                  tick={{ fill: "#b3b3b3", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="minutes"
                  radius={[4, 4, 0, 0]}
                  fill="url(#timeGradient)"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Listen by season">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.seasonData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {stats.seasonData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div className="h-8"></div>
        <div className="mb-8">{renderTop100()}</div>

        <footer className="mt-8 text-center text-spotify-lightgray text-sm">
          <p>Daily updated data • Personal listening statistics</p>
        </footer>
      </div>
    </div>
  );
}

export default Statistics;
