import { useState } from "react";
import { initialCards } from "./data/cards.js";
import './App.css'

function App() {
  const [cards] = useState(initialCards);
  return (
    <div>
      <h1>Holocron-Archives</h1>
      <p>Kaartoverzicht.</p>
      
      <div className="card-grid">
       {cards.map((card) => (
          <div className="card" key={card.id}>
            <img src={card.image} alt={card.title}/>
            <h2>{card.title}</h2>
            <p>Serie: {card.serie}</p>
            <p>Jaar: {card.year}</p>
            <p>Side: {card.side}</p>
            <p>Type kaart: {card.type}</p>
          </div>
        ))}
      </div>
    </div>

    
  );
}

export default App
