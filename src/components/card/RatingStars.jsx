export default function RatingStars({ value = 0, onRate, size = "normal" }) {
  const cls = size === "small" ? "rating rating-small" : "rating";

  return (
    <div className={cls}>
      {size !== "small" && <span>Rating:</span>}

      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          className={star <= value ? "star filled" : "star"}
          aria-label={`${star} ster${star > 1 ? "ren" : ""}`}
        >
          ★
        </button>
      ))}

      {size !== "small" && (
        <span className="rating-value">
          {value ? `${value}/5` : "Nog niet beoordeeld"}
        </span>
      )}
    </div>
  );
}