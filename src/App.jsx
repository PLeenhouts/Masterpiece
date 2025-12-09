import { useState } from "react";
import { initialCards } from "./data/cards.js";
import './App.css'

function App() {
  const [cards] = useState(initialCards);
  const [expanded, setExpanded] = useState({});
  return (
    <div>
      <h1>Holocron-Archives</h1>
      <p>Kaartoverzicht.</p>
      
      <div className="card-grid">
       {cards.map((card) => (
          <div className="card" key={card.id}
              onClick={() =>
                setExpanded((prev) => ({
                ...prev,
                [card.id]: !prev[card.id], // toggle
              }))
            }
          >
            <img src={card.image} alt={card.title}/>
            <h2>{card.title}</h2>
            {expanded[card.id] && (
            <div className="extra-info">
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
            )
            }
          </div>
        ))}
      </div>
    </div>
  );
}

export default App
