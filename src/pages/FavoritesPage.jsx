import { useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";

import CardGrid from "../components/card/CardGrid.jsx";

export default function FavoritesPage({ cards, onToggleFavorite }) {
     const favoriteCards = cards.filter((card) => card.isFavorite);

  return (
    <div>
      <h1>“Holocron-Archives” - …Unlock the secrets of the Force… One card at a time.</h1>
      <p>Een virtueel overzicht van Star Wars CCG kaarten</p>
      <hr/>

      <p>
      <h2>Links</h2>
      <Link to="/">Terug naar startpagina</Link>
      </p>
      <hr/>

      <h2>Favorieten</h2>
      <p>Overzicht van alle favoriete kaarten.</p>

      {favoriteCards.length === 0 ? (
        <p>Je hebt nog geen favorieten geselecteerd.</p>
      ) : (
        <CardGrid
          cards={favoriteCards}
          onToggleFavorite={onToggleFavorite}
          onRateCard={() => {}}
          showRating={false}
        />
      )}
    </div>
  );
}
