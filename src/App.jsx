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
            <p><strong>Serie:</strong> {card.serie}</p>
            <p><strong>Jaar:</strong> {card.year}</p>
            <p><strong>Side:</strong>{card.side}</p>
            <p><strong>Type kaart:</strong>{card.type}</p>
            <p><strong>Soort:</strong>{card.role}</p>
            <p><strong>Rarity:</strong>{card.rarity}</p>
            <p><strong>Description:</strong>{card.description}</p>
            <p><strong>Gametekst:</strong>{card.playtext}</p>
            <p><strong>Rollen:</strong>{card.roles.join(", ")}</p>
            <p><strong>Power:</strong>{card.power}</p>
            <p><strong>Ability:</strong>{card.ability}</p>
            <p><strong>Rank:</strong>{card.rank}</p>
            <p><strong>Deploy:</strong>{card.deploy}</p>
            <p><strong>Forfeit:</strong>{card.forfeit}</p>
            <p><strong>Destiny:</strong>{card.destiny}</p>
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
