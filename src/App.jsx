import { useState, useEffect } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import { supabase } from "./supabaseClient.js";
import './App.css'

import GalleryHome from "./pages/GalleryHome.jsx";
import CardDetailPage from "./pages/CardDetailPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import AdminGate from "./pages/AdminGate.jsx";

function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchCards() {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .order("title", { ascending: true });

      if (error) {
        console.error("Fout bij laden cards:", error);
        setErrorMsg("Kon kaarten niet laden.");
        setCards([]);
      } else {
        const mapped = (data ?? []).map((row) => ({
          id: row.id,
          title: row.title ?? "",
          serie: row.serie ?? "",
          side: row.side ?? "",
          type: row.type ?? "",
          role: row.role ?? "",
          rarity: row.rarity ?? "",
          year: row.year ?? "",
          image: getPublicImageUrl(row.image),
          description: row.description ?? "",
          playtext: row.playtext ?? "",
          roles: Array.isArray(row.roles) ? row.roles : [],
          power: row.power ?? undefined,
          ability: row.ability ?? undefined,
          rank: row.rank ?? undefined,
          armor: row.armor ?? undefined,
          maneuver: row.maneuver ?? undefined,
          hyperspeed: row.hyperspeed ?? undefined,
          landspeed: row.landspeed ?? undefined,
          deploy: row.deploy ?? undefined,
          forfeit: row.forfeit ?? undefined,
          destiny: Array.isArray(row.destiny) ? row.destiny : (row.destiny ?? undefined),
          forceiconsls: row.forceiconsls ?? undefined,
          forceiconsds: row.forceiconsds ?? undefined,
          isFavorite: row.is_favorite ?? false,
          rating: row.rating ?? 0,
          comments: [],
        }));

        setCards(mapped);
      }

      setLoading(false);
    }

    fetchCards();
  }, []);

  if (loading) return <p>Kaarten laden...</p>;
  if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;

function getPublicImageUrl(path) {
  if (!path) return "";                 // <-- voorkomt null/undefined
  const cleaned = String(path).replace(/^\/+/, "");
  const { data } = supabase.storage.from("card-images").getPublicUrl(cleaned);
  return data?.publicUrl ?? "";
}

async function handleToggleFavorite(id) {
  const current = cards.find((c) => String(c.id) === String(id));
  if (!current) return;

  const nextValue = !current.isFavorite;

  setCards((prev) =>
    prev.map((c) =>
      String(c.id) === String(id) ? { ...c, isFavorite: nextValue } : c
    )
  );

  const { error } = await supabase
    .from("cards")
    .update({ is_favorite: nextValue })
    .eq("id", id);


  if (error) {
    console.error("Favorite opslaan mislukt:", error);

    setCards((prev) =>
      prev.map((c) =>
        String(c.id) === String(id) ? { ...c, isFavorite: !nextValue } : c
      )
    );

    alert("Kon favoriet niet opslaan.");
  }
}

async function handleRateCard(id, rating) {
  let oldRating = 0;

  setCards((prev) => {
    const found = prev.find((c) => String(c.id) === String(id));
    oldRating = found?.rating ?? 0;

    return prev.map((card) =>
      String(card.id) === String(id) ? { ...card, rating } : card
    );
  });

  const { error } = await supabase
    .from("cards")
    .update({ rating })
    .eq("id", id);

  if (error) {
    console.error("Rating opslaan mislukt:", error);

    setCards((prev) =>
      prev.map((card) =>
        String(card.id) === String(id) ? { ...card, rating: oldRating } : card
      )
    );

    alert("Kon rating niet opslaan.");
  }
}

const toTextOrNull = (v) => {
  const s = String(v ?? "").trim();
  return s ? s : null;
};

const toNumberOrNull = (v) => {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

async function handleAddCard(formData) {
  const payload = {
  title: String(formData.title ?? "").trim(),
  serie: toTextOrNull(formData.serie),
  side: toTextOrNull(formData.side),
  type: toTextOrNull(formData.type),
  role: toTextOrNull(formData.role),
  rarity: toTextOrNull(formData.rarity),
  year: toNumberOrNull(formData.year),
  image: toTextOrNull(formData.image),
  description: toTextOrNull(formData.description),
  playtext: toTextOrNull(formData.playtext),
  roles: formData.roles
    ? String(formData.roles).split(",").map(r => r.trim()).filter(Boolean)
    : [],
  power: toNumberOrNull(formData.power),
  ability: toNumberOrNull(formData.ability),
  armor: toNumberOrNull(formData.armor),
  maneuver: toNumberOrNull(formData.maneuver),
  hyperspeed: toNumberOrNull(formData.hyperspeed),
  landspeed: toNumberOrNull(formData.landspeed),
  deploy: toNumberOrNull(formData.deploy),
  forfeit: toNumberOrNull(formData.forfeit),
  destiny: toNumberOrNull(formData.destiny),
  forceiconsls: toNumberOrNull(formData.forceiconsls),
  forceiconsds: toNumberOrNull(formData.forceiconsds),
};
  const { data, error } = await supabase
    .from("cards")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    console.error("Insert error:", error);
    alert("Toevoegen mislukt (RLS/policy?)");
    return;
  }

  setCards(prev => [
    {
      ...data,
      image: getPublicImageUrl(data.image),
      isFavorite: data.is_favorite ?? false,
      rating: data.rating ?? 0,
      comments: [],
    },
    ...prev,
  ]);
}

async function handleUpdateCard(id, formData) {
  const payload = {
  title: String(formData.title ?? "").trim(),
  serie: toTextOrNull(formData.serie),
  side: toTextOrNull(formData.side),
  type: toTextOrNull(formData.type),
  role: toTextOrNull(formData.role),
  rarity: toTextOrNull(formData.rarity),
  year: toNumberOrNull(formData.year),
  image: toTextOrNull(formData.image),
  description: toTextOrNull(formData.description),
  playtext: toTextOrNull(formData.playtext),
  roles: formData.roles
    ? String(formData.roles).split(",").map(r => r.trim()).filter(Boolean)
    : [],
  power: toNumberOrNull(formData.power),
  ability: toNumberOrNull(formData.ability),
  armor: toNumberOrNull(formData.armor),
  maneuver: toNumberOrNull(formData.maneuver),
  hyperspeed: toNumberOrNull(formData.hyperspeed),
  landspeed: toNumberOrNull(formData.landspeed),
  deploy: toNumberOrNull(formData.deploy),
  forfeit: toNumberOrNull(formData.forfeit),
  destiny: toNumberOrNull(formData.destiny),
  forceiconsls: toNumberOrNull(formData.forceiconsls),
  forceiconsds: toNumberOrNull(formData.forceiconsds),
};

  const { data, error } = await supabase
    .from("cards")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Update error:", error);
    alert("Bewerken mislukt (RLS/policy?)");
    return;
  }

  setCards(prev =>
    prev.map(card =>
      String(card.id) === String(id)
        ? {
            ...card,
            ...data,
            image: getPublicImageUrl(data.image),
          }
        : card
    )
  );
}

async function handleDeleteCard(id) {
  if (!window.confirm("Weet je zeker dat je deze kaart wilt verwijderen?")) return;

  const { error } = await supabase
    .from("cards")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    alert("Verwijderen mislukt (RLS/policy?)");
    return;
  }

  setCards(prev => prev.filter(card => String(card.id) !== String(id)));
}

    return (
    <Routes>
      <Route path="/" element={<GalleryHome cards={cards} onToggleFavorite={handleToggleFavorite} onRateCard={handleRateCard} />} />
      <Route path="/card/:id" element={<CardDetailPage cards={cards} onToggleFavorite={handleToggleFavorite} onRateCard={handleRateCard} />} />
      <Route path="/favorites" element={<FavoritesPage cards={cards} onToggleFavorite={handleToggleFavorite} />} />
      <Route path="/admin" element={<AdminGate cards={cards} onAddCard={handleAddCard} onUpdateCard={handleUpdateCard} onDeleteCard={handleDeleteCard} />} />  
    </Routes>
  );
}

export default App;
