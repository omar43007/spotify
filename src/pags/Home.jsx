import React from "react";
import Card from "../compent/card";
import "./home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Welcome to MySpotify</h1>
        <p className="home-subtitle">Discover new music, explore albums, and enjoy your favorite tracks.</p>
      </div>
      <div className="featured-section">
        <h2 className="section-title">Featured Albums</h2>
          <Card />
      </div>
    </div>

  );
}

export default Home;
