export default function FavoriteButton({ isFavorite, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`heart-button ${isFavorite ? "favorited" : ""}`}
      type="button"
    >
      ♥
    </button>
  );
}