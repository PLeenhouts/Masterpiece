export default function CardImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="detail-image"
      onError={(e) => {
        console.log("IMG FAIL:", alt, "->", e.currentTarget.src);
      }}
    />
  );
}