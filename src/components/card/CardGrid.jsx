import CardTile from "./CardTile.jsx";

export default function CardGrid({ cards, onToggleFavorite, onRateCard, showRating = true }) {
  return (
    <div className="card-grid">
      {cards.map((card) => (
        <CardTile
          key={card.id}
          card={card}
          onToggleFavorite={onToggleFavorite}
          onRateCard={onRateCard}
          showRating={showRating}
        />
      ))}
    </div>
  );
}