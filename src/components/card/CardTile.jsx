import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton.jsx";
import RatingStars from "./RatingStars.jsx";

export default function CardTile({ card, onToggleFavorite, onRateCard, showRating = true }) {
  return (
    <div className="card">
      <Link to={`/card/${card.id}`}>
        <img src={card.imageUrl || card.image} alt={card.title} />
      </Link>

      <h2>{card.title}</h2>

      <p>
        <Link to={`/card/${card.id}`}>Bekijk kaart</Link>{" "}
        <FavoriteButton
          isFavorite={card.isFavorite}
          onClick={() => onToggleFavorite(card.id)}
        />
      </p>

      {showRating && (
        <RatingStars
          value={card.rating || 0}
          onRate={(stars) => onRateCard(card.id, stars)}
          size="small"
        />
      )}
    </div>
  );
}