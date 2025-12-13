import { useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";

import CardGrid from "../components/card/CardGrid.jsx";

export default function FavoritesPage({ cards, onToggleFavorite }) {
     const favoriteCards = cards.filter((card) => card.isFavorite);

  return (
    <div>
      <h1>Favorieten</h1>
      <p>Overzicht van alle favoriete kaarten.</p>

      <p>
        <Link to="/">Terug naar overzicht</Link>
      </p>

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