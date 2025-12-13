import { useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";

import AdminForm from "../components/admin/AdminForm.jsx";
import CardsTable from "../components/admin/CardsTable.jsx";

export default function AdminPage({ cards, onAddCard, onUpdateCard, onDeleteCard }) {
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <div>
      <h1>Admin – Kaarten beheren</h1>
      <p><Link to="/">Terug naar overzicht</Link></p>

      <AdminForm
        selectedCard={selectedCard}
        onAddCard={onAddCard}
        onUpdateCard={onUpdateCard}
        onCancel={() => setSelectedCard(null)}
      />

      <h2>Bestaande kaarten</h2>
      <CardsTable
        cards={cards}
        onEdit={(card) => setSelectedCard(card)}
        onDelete={onDeleteCard}
      />
    </div>
  );
}