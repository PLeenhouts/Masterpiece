import { useState, useEffect } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import { supabase } from "./supabaseClient.js";
import './App.css'

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
          armor: row.armor ?? undefined,
          deploy: row.deploy ?? undefined,
          forfeit: row.forfeit ?? undefined,
          destiny: Array.isArray(row.destiny) ? row.destiny : (row.destiny ?? undefined),
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
  const { data } = supabase.storage.from("card-images").getPublicUrl(path);
  return data.publicUrl;
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

async function handleAddCard(formData) {
  const payload = {
    title: formData.title.trim(),
    serie: formData.serie?.trim() || null,
    side: formData.side?.trim() || null,
    type: formData.type?.trim() || null,
    role: formData.role?.trim() || null,
    rarity: formData.rarity?.trim() || null,
    year: formData.year ? Number(formData.year) : null,
    image: formData.image?.trim() || null,
    description: formData.description?.trim() || null,
    playtext: formData.playtext?.trim() || null,
    roles: formData.roles ? formData.roles.split(",").map(r => r.trim()).filter(Boolean) : [],
    power: formData.power?.trim() || null,
    ability: formData.ability?.trim() || null,
    rank: formData.rank?.trim() || null,
    deploy: formData.deploy?.trim() || null,
    forfeit: formData.forfeit?.trim() || null,
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
    title: formData.title.trim(),
    serie: formData.serie?.trim() || null,
    side: formData.side?.trim() || null,
    type: formData.type?.trim() || null,
    role: formData.role?.trim() || null,
    rarity: formData.rarity?.trim() || null,
    year: formData.year ? Number(formData.year) : null,
    image: formData.image?.trim() || null,
    description: formData.description?.trim() || null,
    playtext: formData.playtext?.trim() || null,
    roles: formData.roles ? formData.roles.split(",").map(r => r.trim()).filter(Boolean) : [],
    power: formData.power?.trim() || null,
    ability: formData.ability?.trim() || null,
    rank: formData.rank?.trim() || null,
    deploy: formData.deploy?.trim() || null,
    forfeit: formData.forfeit?.trim() || null,
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
        <Link to="/favorites">Bekijk favorieten</Link> |{" "}
        <Link to="/admin">Admin</Link>
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
            
            <button onClick={() => onToggleFavorite(card.id)}
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
function CardDetailPage({ cards, onToggleFavorite, onRateCard }) {
  const { id } = useParams();
  const card = cards.find((c) => String(c.id) === String(id));
  const [author, setAuthor] = useState("");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

 useEffect(() => {
    if (!card) return;

    async function fetchComments() {
      setLoadingComments(true);

      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("card_id", card.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Comments laden mislukt:", error);
        setComments([]);
      } else {
        setComments(data ?? []);
      }

      setLoadingComments(false);
    }

    fetchComments();
  }, [card?.id]);

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

  async function handleSubmitComment() {
    const text = commentText.trim();
    const name = author.trim() || "Anoniem";
    if (!text || !card) return;

    const { data, error } = await supabase
      .from("comments")
      .insert({ card_id: card.id, author: name, text })
      .select("*")
      .single();

    if (error) {
      console.error("Comment opslaan mislukt:", error);
      alert("Kon comment niet opslaan.");
      return;
    }

    setComments((prev) => [data, ...prev]);
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
    
    <button onClick={() => onToggleFavorite(card.id)}
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

  {loadingComments ? (
    <p>Comments laden...</p>
  ) : comments.length > 0 ? (
    <ul>
      {comments.map((c) => (
        <li key={c.id}>
          <div>
            <strong>{c.author || "Anoniem"}</strong> –{" "}
            {c.created_at ? new Date(c.created_at).toLocaleString() : ""}
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

       <button onClick={() => onToggleFavorite(card.id)}
        className={`heart-button ${card.isFavorite ? "favorited" : ""}`}>
        ♥ 
       </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Beveiligde login Admin-pagina
function AdminGate({ cards, onAddCard, onUpdateCard, onDeleteCard }) {
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
    return <AdminPage cards={cards}        
                      onAddCard={onAddCard}
                      onUpdateCard={onUpdateCard}
                      onDeleteCard={onDeleteCard} 
            />;
  }

   return (
    <div>
      <h1>Admin login</h1>
      <p>Voer het admin-wachtwoord in om verder te gaan.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Inloggen</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        <Link to="/">Terug naar overzicht</Link>
      </p>
    </div>
  );
}

//admin-pagina
function AdminPage({ cards, onAddCard, onUpdateCard, onDeleteCard }) {
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [serie, setSerie] = useState("");
  const [side, setSide] = useState("");
  const [type, setType] = useState("");
  const [role, setRole] = useState("");
  const [rarity, setRarity] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [playtext, setPlaytext] = useState("");
  const [roles, setRoles] = useState("");
  const [power, setPower] = useState("");
  const [ability, setAbility] = useState("");
  const [rank, setRank] = useState("");
  const [deploy, setDeploy] = useState("");
  const [forfeit, setForfeit] = useState("");
  const [destiny, setDestiny] = useState("");

  function resetForm() {
    setEditId(null);
    setTitle("");
    setSerie("");
    setSide("");
    setType("");
    setRole("");
    setRarity("");
    setYear("");
    setImage("");
    setDescription("");
    setPlaytext("");
    setRoles("");
    setPower("");
    setAbility("");
    setRank("");
    setDeploy("");
    setForfeit("");
    setDestiny("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Titel is verplicht.");
      return;
    }

    const data = {
      title,
      serie,
      side,
      type,
      role,
      rarity,
      year,
      image,
      description,
      playtext,
      roles,
      power,
      ability,
      rank,
      deploy,
      forfeit,
      destiny,
    };

    if (editId) {
      onUpdateCard(editId, data);
    } else {
      onAddCard(data);
    }

    resetForm();
  }

  function handleEdit(card) {
    setEditId(card.id);
    setTitle(card.title || "");
    setSerie(card.serie || "");
    setSide(card.side || "");
    setType(card.type || "");
    setRole(card.role || "");
    setRarity(card.rarity || "");
    setYear(card.year ?? "");
    setImage(card.image || "");
    setDescription(card.description || "");
    setPlaytext(card.playtext || "");
    setRoles(
      Array.isArray(card.roles) ? card.roles.join(", ") : "");
    setPower(card.power ?? "");
    setAbility(card.ability ?? "");
    setRank(card.rank ?? "");
    setDeploy(card.deploy ?? "");
    setForfeit(card.forfeit ?? "");
    setDestiny(
      Array.isArray(card.destiny)
        ? card.destiny.join(", ")
        : card.destiny ?? ""
    );
  }

  return (
    <div>
      <h1>Admin – Kaarten beheren</h1>
      <p>
        <Link to="/">Terug naar overzicht</Link>
      </p>

      <h2>{editId ? "Kaart bewerken" : "Nieuwe kaart toevoegen"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Titel*:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Serie:
            <input
              type="text"
              value={serie}
              onChange={(e) => setSerie(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Side:
            <input
              type="text"
              value={side}
              onChange={(e) => setSide(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Type:
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Role:
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Rarity:
            <input
              type="text"
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Jaar:
            <input
              type="text"
              inputMode="numeric"
              value={year}              
              placeholder="Bijv. 2025"
              onChange={(e) => setYear(e.target.value)}             
            />
          </label>
        </div>

        <div>
          <label>
            Afbeelding-pad:
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="naam.jpg"
            />
          </label>
        </div>

        <div>
          <label>
            Beschrijving:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Gametekst (playtext):
            <input
              type="text"
              value={playtext}
              onChange={(e) => setPlaytext(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Rollen (kommagescheiden):
            <input
              type="text"
              value={roles}
              onChange={(e) => setRoles(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Power:
            <input
              type="text"
              value={power}
              onChange={(e) => setPower(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Ability:
            <input
              type="text"
              value={ability}
              onChange={(e) => setAbility(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Rank:
            <input
              type="text"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Deploy:
            <input
              type="text"
              value={deploy}
              onChange={(e) => setDeploy(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Forfeit:
            <input
              type="text"
              value={forfeit}
              onChange={(e) => setForfeit(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Destiny:
            <input
              type="text"
              value={destiny}
              onChange={(e) => setDestiny(e.target.value)}
            />
          </label>
        </div>

        <button type="submit">
          {editId ? "Wijzigingen opslaan" : "Toevoegen"}
        </button>
        {editId && (
          <button type="button" onClick={resetForm}>
            Annuleren
          </button>
        )}
      </form>

      <h2>Bestaande kaarten</h2>
      {cards.length === 0 ? (
        <p>Er zijn nog geen kaarten.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Titel</th>
              <th>Serie</th>
              <th>Side</th>
              <th>Type</th>
              <th>Jaar</th>
              <th>Rarity</th>
              <th>Afbeelding</th>
              <th>Acties</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr key={card.id}>
                <td>{card.title}</td>
                <td>{card.serie}</td>
                <td>{card.side}</td>
                <td>{card.type}</td>
                <td>{card.year}</td>
                <td>{card.rarity}</td>
                <td>{card.image}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleEdit(card)}
                  >
                    Bewerken
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteCard(card.id)}
                  >
                    Verwijderen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
