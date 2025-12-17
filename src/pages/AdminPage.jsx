import { useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";

import AdminForm from "../components/admin/AdminForm.jsx";
import CardsTable from "../components/admin/CardsTable.jsx";
import ExampleCardsPanel from "../components/admin/ExampleCardsPanel.jsx";

export default function AdminPage({ cards, onAddCard, onUpdateCard, onDeleteCard }) {
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <div>
      <h1>“Holocron-Archives” - …Unlock the secrets of the Force… One card at a time.</h1>
      <p>Een virtueel overzicht van Star Wars CCG kaarten</p>
      <hr/>
      
      <div>
      <h2>Links</h2>
      <p><Link to="/">Uitloggen als Admin</Link></p>
      </div>
      <hr/>
      
      <div className="admin-top">
        <div className="admin-left">
          <AdminForm
            selectedCard={selectedCard}
            onAddCard={onAddCard}
            onUpdateCard={onUpdateCard}
            onCancel={() => setSelectedCard(null)}
          />
        </div>

        <aside className="admin-right">
          <ExampleCardsPanel />
        </aside>
      </div>

       <hr/>
      <h2>Overzicht bestaande kaarten</h2>
      <CardsTable
        cards={cards}
        onEdit={(card) => setSelectedCard(card)}
        onDelete={onDeleteCard}
      />
       <hr/>
    </div>
  );
}
