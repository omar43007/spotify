import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ListeningDataContext = createContext();

export const useListeningData = () => useContext(ListeningDataContext);

export const ListeningDataProvider = ({ children }) => {
  const [listeningData, setListeningData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/spotify.json");
        setListeningData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch listening data:", err);
        setError("Failed to load listening data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // دالة لاستخراج بيانات فنان معين
  const getArtistData = (artistName) => {
    if (!listeningData.length) return null;

    const artistPlays = listeningData.filter(
      (entry) => entry.master_metadata_album_artist_name === artistName
    );

    if (!artistPlays.length) return null;

    // حساب إحصائيات الفنان
    const totalPlays = artistPlays.length;
    const totalMs = artistPlays.reduce(
      (sum, entry) => sum + (entry.ms_played || 0),
      0
    );
    const totalMinutes = Math.round(totalMs / 60000);

    // Unique songs
    const uniqueSongs = new Set();
    artistPlays.forEach((element) => {
      if (element.master_metadata_track_name) {
        uniqueSongs.add(element.master_metadata_track_name);
      }
    });

    // Total of Plays %
    const TotalofPlays = ((totalPlays / listeningData.length) * 100).toFixed(1);

    // استخراج الأغاني الأكثر شعبية للفنان
    const songCounts = {};
    artistPlays.forEach((entry) => {
      const song = entry.master_metadata_track_name;
      const artist = entry.master_metadata_album_artist_name;
      if (song && artist) {
        const key = `${song}`;
        songCounts[key] = (songCounts[key] || 0) + (entry.ms_played || 0);
      }
    });

    const topSongs = Object.entries(songCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([song, count]) => ({
        song: song,
        count: Math.round(count / 60000),
      }));


    return {
      artistName,
      totalPlays,
      totalMinutes,
      topSongs,
      uniqueSongs: uniqueSongs.size,
      TotalofPlays: TotalofPlays,
    };
  };

  const value = {
    listeningData,
    loading,
    error,
    getArtistData,
  };

  return (
    <ListeningDataContext.Provider value={value}>
      {children}
    </ListeningDataContext.Provider>
  );
};
