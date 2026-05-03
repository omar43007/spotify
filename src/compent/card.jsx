import React from "react";
import "./card.css";

function Card() {
  const albums = [
        {
          id: 1,
          title: "Dreamscape",
          artist: "DJ Aurora",
          cover:
            "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=facearea&w=200&h=200&q=80",
        },
        {
          id: 2,
          title: "Night Drive",
          artist: "Synthwave",
          cover:
            "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=200&h=200&q=80",
        },
        {
          id: 3,
          title: "Acoustic Mornings",
          artist: "Indie Folk",
          cover:
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=200&h=200&q=80",
        },
        {
          id: 4,
          title: "Urban Beats",
          artist: "MC Flow",
          cover:
            "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=200&h=200&q=80",
        },
        {
          id: 5,
          title: "Classical Essentials",
          artist: "Various Artists",
          cover:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=200&h=200&q=80",
        },
        {
          id: 6,
          title: "Summer Chill",
          artist: "The Sunsets",
          cover:
            "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=facearea&w=200&h=200&q=80",
        },
        {
          id: 7,
          title: "Jazz Nights",
          artist: "Blue Quartet",
          cover:
            "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=200&h=200&q=80",
        },
        {
          id: 8,
          title: "Rock On",
          artist: "The Rebels",
          cover:
            "https://images.unsplash.com/photo-1462392246754-28dfa2df8e6b?auto=format&fit=facearea&w=200&h=200&q=80",
        },
        {
          id: 9,
          title: "Electronic Dreams",
          artist: "Synth Master",
          cover:
            "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=facearea&w=200&h=200&q=80",
        },
        {
          id: 10,
          title: "Pop Parade",
          artist: "Star Voices",
          cover:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=200&h=200&q=80",
        },
      ]
    

  return (
    <div className="pirent">
      {albums.map((item) => (
        <div className="card">
          <img src={item.cover} alt={item.cover} />
          <h3>{item.title}</h3>
          <p>{item.artist}</p>
        </div>
      ))}
    </div>
  );
}

export default Card;
