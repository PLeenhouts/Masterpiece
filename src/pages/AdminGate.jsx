import { useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import AdminPage from "./AdminPage.jsx";

import AdminLoginForm from "../components/admin/AdminLoginForm.jsx";

export default function AdminGate({ cards, onAddCard, onUpdateCard, onDeleteCard }) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (password === "test") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Onjuist wachtwoord.");
    }
  }

  if (isAuthenticated) {
    return (
      <AdminPage
        cards={cards}
        onAddCard={onAddCard}
        onUpdateCard={onUpdateCard}
        onDeleteCard={onDeleteCard}
      />
    );
  }

  return (
    <div>
      <h1>“Holocron-Archives” - …Unlock the secrets of the Force… One card at a time.</h1>
      <p>Een virtueel overzicht van Star Wars CCG kaarten</p>
      <hr/>

      <p>
      <h2>Links</h2>
      <Link to="/">Terug naar startpagina</Link>
      </p>
      <hr/>

      <h2>Admin login</h2>
      <p>Voer het admin-wachtwoord in om verder te gaan.</p>

      <AdminLoginForm
        password={password}
        setPassword={setPassword}
        onSubmit={handleSubmit}
        error={error}
      />


    </div>
  );
}
