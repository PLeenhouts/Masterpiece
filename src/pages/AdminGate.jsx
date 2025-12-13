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
      <h1>Admin login</h1>
      <p>Voer het admin-wachtwoord in om verder te gaan.</p>

      <AdminLoginForm
        password={password}
        setPassword={setPassword}
        onSubmit={handleSubmit}
        error={error}
      />

      <p>
        <Link to="/">Terug naar overzicht</Link>
      </p>
    </div>
  );
}