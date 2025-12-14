import { useEffect, useState } from "react";

export default function AdminForm({
  selectedCard,
  onAddCard,
  onUpdateCard,
  onCancel,
}) {
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedCard) {
      resetForm();
      return;
    }

    setTitle(selectedCard.title || "");
    setSerie(selectedCard.serie || "");
    setSide(selectedCard.side || "");
    setType(selectedCard.type || "");
    setRole(selectedCard.role || "");
    setRarity(selectedCard.rarity || "");
    setYear(selectedCard.year ?? "");
    setImage(selectedCard.imagePath || "");
    setDescription(selectedCard.description || "");
    setPlaytext(selectedCard.playtext || "");
    setRoles(Array.isArray(selectedCard.roles) ? selectedCard.roles.join(", ") : "");
    setPower(selectedCard.power ?? "");
    setAbility(selectedCard.ability ?? "");
    setRank(selectedCard.rank ?? "");
    setDeploy(selectedCard.deploy ?? "");
    setForfeit(selectedCard.forfeit ?? "");
    setDestiny(
      Array.isArray(selectedCard.destiny)
        ? selectedCard.destiny.join(", ")
        : selectedCard.destiny ?? ""
    );
  }, [selectedCard]);

  function resetForm() {
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

  async function handleSubmit(e) {
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

    try {
      setSaving(true);
    
      const ok = selectedCard
        ? await onUpdateCard(selectedCard.id, data)
        : await onAddCard(data);
      
      if (ok !== false) {
        resetForm();
        onCancel();
      }
    } catch (err) {
      console.error("Opslaan mislukt:", err);
      alert("Opslaan mislukt.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    resetForm();
    onCancel();
  }

  return (
    <>
      <h2>{selectedCard ? "Kaart bewerken" : "Nieuwe kaart toevoegen"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Titel*:
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
        </div>

        <div>
          <label>
            Serie:
            <input value={serie} onChange={(e) => setSerie(e.target.value)} />
          </label>
        </div>

        <div>
          <label>
            Side:
            <input value={side} onChange={(e) => setSide(e.target.value)} />
          </label>
        </div>

        <div>
          <label>
            Type:
            <input value={type} onChange={(e) => setType(e.target.value)} />
          </label>
        </div>

        <div>
          <label>
            Role:
            <input value={role} onChange={(e) => setRole(e.target.value)} />
          </label>
        </div>

        <div>
          <label>
            Rarity:
            <input value={rarity} onChange={(e) => setRarity(e.target.value)} />
          </label>
        </div>

        <div>
          <label>
            Jaar:
            <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Bijv. 2025"
              inputMode="numeric"
            />
          </label>
        </div>

        <div>
          <label>
            Afbeelding-pad:
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="naam.jpg of map/naam.jpg"
            />
          </label>
        </div>

        <div>
          <label>
            Beschrijving:
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Gametekst (playtext):
            <input
              value={playtext}
              onChange={(e) => setPlaytext(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Rollen (kommagescheiden):
            <input value={roles} onChange={(e) => setRoles(e.target.value)} />
          </label>
        </div>

        <div>
          <label>
            Power:
            <input value={power} onChange={(e) => setPower(e.target.value)} />
          </label>
        </div>

        <div>
          <label>
            Ability:
            <input value={ability} onChange={(e) => setAbility(e.target.value)} />
          </label>
        </div>

        <div>
          <label>
            Rank:
            <input value={rank} onChange={(e) => setRank(e.target.value)} />
          </label>
        </div>

        <div>
          <label>
            Deploy:
            <input value={deploy} onChange={(e) => setDeploy(e.target.value)} />
          </label>
        </div>

        <div>
          <label>
            Forfeit:
            <input value={forfeit} onChange={(e) => setForfeit(e.target.value)} />
          </label>
        </div>

        <div>
          <label>
            Destiny:
            <input value={destiny} onChange={(e) => setDestiny(e.target.value)} />
          </label>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Opslaan..." : selectedCard ? "Wijzigingen opslaan" : "Toevoegen"}
        </button>

        {selectedCard && (
          <button type="button" onClick={handleCancel} disabled={saving}>
            Annuleren
          </button>
        )}
      </form>
    </>
  );
}