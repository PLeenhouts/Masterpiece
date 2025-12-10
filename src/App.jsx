import { useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import { initialCards } from "./data/cards.js";
import './App.css'

function App() {
  const [cards, setCards] = useState(initialCards);

  function handleToggleFavorite(id) {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, isFavorite: !card.isFavorite } 
        : card
      )
    );
  }

function handleAddComment(id, text, author) {
  setCards((prevCards) =>
    prevCards.map((card) =>
      card.id === id ? { ...card, comments: [ ...(card.comments || []), { id: Date.now(), text, author, date: new Date().toISOString()}]}
      : card
    )
   );
}

function handleRateCard(id, rating) {
  setCards((prevCards) =>
    prevCards.map((card) =>
      card.id === id
        ? { ...card, rating }
        : card
    )
  );
}

    return (
    <Routes>
      <Route path="/" element={<GalleryHome cards={cards} onToggleFavorite={handleToggleFavorite} onRateCard={handleRateCard} />} />
      <Route path="/card/:id" element={<CardDetailPage cards={cards} onToggleFavorite={handleToggleFavorite} onAddComment={handleAddComment} onRateCard={handleRateCard} />} />
      <Route path="/favorites" element={<FavoritesPage cards={cards} onToggleFavorite={handleToggleFavorite} />} />  
    </Routes>
  );
}

export default App;

// Overzichtspagina
function GalleryHome({ cards, onToggleFavorite, onRateCard }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeries, setSelectedSeries] = useState([]);
  const [selectedSides, setSelectedSides] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const seriesOptions = [...new Set(cards.map((c) => c.serie).filter(Boolean))];
  const sideOptions = [...new Set(cards.map((c) => c.side).filter(Boolean))];
  const typeOptions = [...new Set(cards.map((c) => c.type).filter(Boolean))];

  const toggleInArray = (value, setter) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const filteredCards = cards.filter((card) => {
    const term = searchTerm.toLowerCase().trim();
    if (selectedSeries.length > 0 && !selectedSeries.includes(card.serie)) {
      return false;}
    if (selectedSides.length > 0 && !selectedSides.includes(card.side)) {
      return false;}
    if (selectedTypes.length > 0 && !selectedTypes.includes(card.type)) {
      return false;}
    if (!term) return true;

const statMatch = term.match(
      /^(power|ability|armor|deploy|forfeit|destiny)\s+(.+)$/
    );

    if (statMatch) {
      const field = statMatch[1]
      const value = statMatch[2];
      if (field === "destiny") {    
        if (Array.isArray(card.destiny)) {
          return card.destiny.some(
            (d) => String(d).toLowerCase() === value
          );
        }
        if (card.destiny !== undefined) {
          return String(card.destiny).toLowerCase() === value;
        }
        return false;
      } else {
        const statValue = card[field];
        if (statValue === undefined) return false;
        return String(statValue).toLowerCase() === value;
      }
    }

    const title = (card.title || "").toLowerCase();
    const type = (card.type || "").toLowerCase();
    const series = (card.serie || "").toLowerCase();
    const side = (card.side || "").toLowerCase();
    const rarity = (card.rarity || "").toLowerCase();
    const rank = (card.rank || "").toLowerCase();
    const rolesText = Array.isArray(card.roles)
      ? card.roles
          .filter((r) => typeof r === "string")
          .join(" ")
          .toLowerCase()
      : "";

    const destinyText = Array.isArray(card.destiny)
      ? card.destiny.join(" ").toLowerCase()
      : card.destiny !== undefined
      ? String(card.destiny).toLowerCase()
      : "";

    const power = card.power !== undefined ? String(card.power) : "";
    const ability = card.ability !== undefined ? String(card.ability) : "";
    const armor = card.armor !== undefined ? String(card.armor) : "";
    const deploy = card.deploy !== undefined ? String(card.deploy) : "";
    const forfeit = card.forfeit !== undefined ? String(card.forfeit) : "";
    const haystack = [title, type, series, side, rarity, rank, rolesText, destinyText, power, ability, armor, deploy, forfeit,].join(" ");
    return haystack.includes(term);
  });

  return (
    <div>
      <h1>Holocron-Archives</h1>
      <p>Kaartoverzicht.</p>

      <p>
        <Link to="/favorites">Bekijk favorieten</Link>
      </p>

      <input
        type="text"
        placeholder="Zoek op titel of bijv. 'power 5'"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="filters">
        <fieldset>
          <legend>Serie</legend>
          {seriesOptions.map((s) => (
            <label key={s}>
              <input type="checkbox"
                checked={selectedSeries.includes(s)}
                onChange={() => toggleInArray(s, setSelectedSeries)}
              />
              {s}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>Side</legend>
          {sideOptions.map((s) => (
            <label key={s}>
              <input
                type="checkbox"
                checked={selectedSides.includes(s)}
                onChange={() => toggleInArray(s, setSelectedSides)}
              />
              {s}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>Type</legend>
          {typeOptions.map((t) => (
            <label key={t}>
              <input
                type="checkbox"
                checked={selectedTypes.includes(t)}
                onChange={() => toggleInArray(t, setSelectedTypes)}
              />
              {t}
            </label>
          ))}
        </fieldset>
      </div>

      <div className="card-grid">
        {filteredCards.map((card) => (
          <div className="card" key={card.id}>
            <Link to={`/card/${card.id}`}>
              <img src={card.image} alt={card.title} />
            </Link>
            <h2>{card.title}</h2>
            <p>
              <Link to={`/card/${card.id}`}>Bekijk kaart</Link>
            
            <button onClick={() => onToggleFavorite(card.id, card.isFavorite)}
              className={`heart-button ${card.isFavorite ? "favorited" : ""}`}>
               ♥ 
            </button>
            </p>
        <div className="rating rating-small">
        {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRateCard(card.id, star)}
          className={star <= (card.rating || 0) ? "star filled" : "star"}
          aria-label={`${star} ster${star > 1 ? "ren" : ""}`}>
            ★
        </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Detailpagina
function CardDetailPage({ cards, onToggleFavorite, onAddComment, onRateCard }) {
  const { id } = useParams();
  const card = cards.find((c) => c.id === id);
  const [author, setAuthor] = useState("");
  const [commentText, setCommentText] = useState("");

  if (!card) {
    return (
      <div>
        <p>Kaart niet gevonden.</p>
        <p>
          <Link to="/">Terug naar overzicht</Link>
        </p>
      </div>
    );
  }

function handleSubmitComment() {
    const text = commentText.trim();
    const name = author.trim() || "Anoniem";
    if (!text) return; 
    onAddComment(card.id, text, name);
    setCommentText("");
    setAuthor("");
  }

  const cleanedRoles =
    Array.isArray(card.roles)
      ? card.roles.filter((r) => typeof r === "string" && r.trim() !== "")
      : [];

  return (
    <div>
      <p>
        <Link to="/">Terug naar overzicht</Link> |{" "}
        <Link to="/favorites">Naar favorieten</Link>
      </p>

      <img src={card.image} alt={card.title} className="detail-image" />

      <h1>{card.title}</h1>

    {card.serie !== undefined && <p><strong>Serie:</strong> {card.serie}</p>}
    {card.year !== undefined && <p><strong>Jaar:</strong> {card.year}</p>}
    {card.side !== undefined && <p><strong>Side:</strong> {card.side}</p>}
    {card.type !== undefined && <p><strong>Type kaart:</strong> {card.type}</p>}
    {card.role !== undefined && <p><strong>Soort:</strong>{card.role}</p>} 
    {card.rarity !== undefined && <p><strong>Rarity:</strong>{card.rarity}</p>}
    {card.description !== undefined && <p><strong>Description:</strong>{card.description}</p>}
    {card.playtext !== undefined && <p><strong>Gametekst:</strong>{card.playtext}</p>}
    {Array.isArray(card.roles) && card.roles.filter(r => r.trim() !== "").length > 0 && (<p><strong>Rollen:</strong> {card.roles.filter(r => r.trim() !== "").join(", ")}</p>)}
    {card.power !== undefined && <p><strong>Power:</strong>{card.power}</p>}
    {card.ability !== undefined && <p><strong>Ability:</strong>{card.ability}</p>}
    {card.rank && card.rank.trim() !== "" && (<p><strong>Rank:</strong>{card.rank}</p>)}
    {card.armor !== undefined && <p><strong>Armor:</strong>{card.armor}</p>}
    {card.deploy !== undefined && <p><strong>Deploy:</strong>{card.deploy}</p>}
    {card.forfeit !== undefined && <p><strong>Forfeit:</strong>{card.forfeit}</p>}
    {card.destiny !== undefined && (<p><strong>Destiny:</strong>{" "}{Array.isArray(card.destiny)? card.destiny.join(" / "): card.destiny}</p>)}
    
    <button onClick={() => onToggleFavorite(card.id, card.isFavorite)}
      className={`heart-button ${card.isFavorite ? "favorited" : ""}`}>
      ♥ 
    </button>

<div className="rating">
  <span>Rating:</span>
  {[1, 2, 3, 4, 5].map((star) => (
    <button
      key={star}
      type="button"
      onClick={() => onRateCard(card.id, star)}
      className={
        star <= (card.rating || 0) ? "star filled" : "star"
      }
      aria-label={`${star} ster${star > 1 ? "ren" : ""}`}
    >
      ★
    </button>
  ))}
  <span className="rating-value">
    {card.rating ? `${card.rating}/5` : "Nog niet beoordeeld"}
  </span>
</div>

    <hr/>
    <h2>Comments</h2>

    {card.comments && card.comments.length > 0 ? (
      <ul>
        {card.comments.map((c) => (
          <li key={c.id}>
            <div>
              <strong>{c.author || "Anoniem"}</strong> –{" "}
              {c.date ? new Date(c.date).toLocaleString() : ""}
            </div>
            <div>{c.text}</div>
          </li>
        ))}
      </ul>
    ) : (
      <p>Nog geen comments.</p>
    )}

      <div>
        <p>
        <input
          type="text"
          placeholder="Naam"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}/>
        </p>
        <p>
        <textarea
         rows={2}
         placeholder="Schrijf een comment..."
         value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        </p>
        <button onClick={handleSubmitComment}>
           Plaats comment
        </button>
      </div>
    </div>
  );
}

// Favorietenpagina
function FavoritesPage({ cards, onToggleFavorite }) {
    const favoriteCards = cards.filter((card) => card.isFavorite);

  return (
    <div>
      <h1>Favorieten</h1>
      <p>Overzicht van alle favoriete kaarten.</p>

      <p>
        <Link to="/">Terug naar overzicht</Link>
      </p>

      {favoriteCards.length === 0 && (
        <p>Je hebt nog geen favorieten geselecteerd.</p>
      )}

      <div className="card-grid">
        {favoriteCards.map((card) => (
          <div className="card" key={card.id}>
            <Link to={`/card/${card.id}`}>
              <img src={card.image} alt={card.title} />
            </Link>

            <h2>{card.title}</h2>

       <button onClick={() => onToggleFavorite(card.id, card.isFavorite)}
        className={`heart-button ${card.isFavorite ? "favorited" : ""}`}>
        ♥ 
       </button>
          </div>
        ))}
      </div>
    </div>
  );
}
