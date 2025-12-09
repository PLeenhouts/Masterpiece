import { useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import { initialCards } from "./data/cards.js";
import './App.css'

function App() {
  const [cards] = useState(initialCards);

    return (
    <Routes>
      <Route path="/" element={<GalleryHome cards={cards} />} />
      <Route path="/card/:id" element={<CardDetailPage cards={cards} />} />
    </Routes>
  );
}

export default App;

// Overzichtspagina
function GalleryHome({ cards }) {
   return (
    <div>
      <h1>Holocron-Archives</h1>
      <p>Kaartoverzicht.</p>
      
      <div className="card-grid">
       {cards.map((card) => (
          <div className="card" key={card.id}>
            <Link to={`/card/${card.id}`}>
            <img src={card.image} alt={card.title} />
            </Link> 
          
            
            <h2>{card.title}</h2>
            <p>
              <Link to={`/card/${card.id}`}>Bekijk kaart</Link>
            </p>
            </div>
        ))}
      </div>
    </div>
  );
}          

// Detailpagina
function CardDetailPage({ cards }) {
  const { id } = useParams();
  const card = cards.find((c) => c.id === id);

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

  const cleanedRoles =
    Array.isArray(card.roles)
      ? card.roles.filter((r) => typeof r === "string" && r.trim() !== "")
      : [];

  return (
    <div>
      <p>
        <Link to="/">Terug naar overzicht</Link>
      </p>

      <img src={card.image} alt={card.title} className="detail-image" />

      <h1>{card.title}</h1>

    {card.series !== undefined && <p><strong>Serie:</strong> {card.series}</p>}
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
    </div>
  );
}
