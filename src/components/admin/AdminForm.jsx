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
  const [maneuver, setManeuver] = useState("");
  const [armor, setArmor] = useState("");
  const [hyperspeed, setHyperspeed] = useState("");
  const [landspeed, setLandspeed] = useState("");
  const [deploy, setDeploy] = useState("");
  const [forfeit, setForfeit] = useState("");
  const [destiny, setDestiny] = useState("");
  const [forceiconsls, setForceiconsls] = useState("");
  const [forceiconsds, setForceiconsds] = useState("");
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
    setManeuver(selectedCard.maneuver ?? "");
    setArmor(selectedCard.armor ?? "");
    setHyperspeed(selectedCard.hyperspeed ?? "");
    setLandspeed(selectedCard.landspeed ?? "");
    setDeploy(selectedCard.deploy ?? "");
    setForfeit(selectedCard.forfeit ?? "");
    setDestiny(
      Array.isArray(selectedCard.destiny)
        ? selectedCard.destiny.join(", ")
        : selectedCard.destiny ?? ""
    );
    setForceiconsls(selectedCard.forceiconsls ?? "");
    setForceiconsds(selectedCard.forceiconsds ?? "");
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
    setManeuver("");
    setArmor("");
    setHyperspeed("");
    setLandspeed("");
    setDeploy("");
    setForfeit("");
    setDestiny("");
    setForceiconsls("");
    setForceiconsds("");
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
      maneuver,
      armor,
      hyperspeed,
      landspeed,
      deploy,
      forfeit,
      destiny,
      forceiconsls,
      forceiconsds,
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
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Naam van kaart"/>
          </label>
        </div>

        <div>
          <label>
            Serie:
            <input value={serie} onChange={(e) => setSerie(e.target.value)} placeholder="Naam van serie"/>
          </label>
        </div>

        <div>
          <label>
            Side:
            <input value={side} onChange={(e) => setSide(e.target.value)} placeholder="Dark of Light side"/>
          </label>
        </div>

        <div>
          <label>
            Type:
            <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Type kaart"/>
          </label>
        </div>

        <div>
          <label>
            Role:
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Rol van kaart"/>
          </label>
        </div>

        <div>
          <label>
            Rarity:
            <input value={rarity} onChange={(e) => setRarity(e.target.value)} placeholder="Zeldzaamheid van kaart" />
          </label>
        </div>

        <div>
          <label>
            Jaar:
            <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="Uitgavejaar van kaart" inputMode="numeric" />
          </label>
        </div>

        <div>
          <label>
            Afbeelding-pad:
            <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="naam.jpg" />
          </label>
        </div>

        <div>
          <label>
            Beschrijving:
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Beschrijving van kaart" />
          </label>
        </div>

        <div>
          <label>
            Gametekst:
            <input value={playtext} onChange={(e) => setPlaytext(e.target.value)} placeholder="Speltekst van kaart" />
          </label>
        </div>

        <div>
          <label>
            Rollen (kommagescheiden):
            <input value={roles} onChange={(e) => setRoles(e.target.value)} placeholder="Rollen die kaart heeft" />
          </label>
        </div>

        <div>
          <label>
            Power:
            <input value={power} onChange={(e) => setPower(e.target.value)} placeholder="Power van de kaart" />
          </label>
        </div>

        <div>
          <label>
            Ability:
            <input value={ability} onChange={(e) => setAbility(e.target.value)} placeholder="Ability van de kaart" />
          </label>
        </div>

        <div>
          <label>
            Rank:
            <input value={rank} onChange={(e) => setRank(e.target.value)} placeholder="Forcerank van kaart" />
          </label>
        </div>

        <div>
          <label>
            Maneuver:
            <input value={maneuver} onChange={(e) => setManeuver(e.target.value)} placeholder="Maneuver van kaart" />
          </label>
        </div>

        <div> 
          <label>
            Armor:
            <input value={armor} onChange={(e) => setArmor(e.target.value)} placeholder="Armor van kaart" />
          </label>
        </div>

        <div>
          <label>
            Hyperspeed:
            <input value={hyperspeed} onChange={(e) => setHyperspeed(e.target.value)} placeholder="Hyperspeed van kaart" />
          </label>
        </div>

        <div>
          <label>
            Landspeed:
            <input value={landspeed} onChange={(e) => setLandspeed(e.target.value)} placeholder="Landspeed van kaart" />
          </label>
        </div>

        <div>
          <label>
            Deploy:
            <input value={deploy} onChange={(e) => setDeploy(e.target.value)} placeholder="Deploy van kaart" />
          </label>
        </div>

        <div>
          <label>
            Forfeit:
            <input value={forfeit} onChange={(e) => setForfeit(e.target.value)} placeholder="Forfeit van kaart" />
          </label>
        </div>

        <div>
          <label>
            Destiny:
            <input value={destiny} onChange={(e) => setDestiny(e.target.value)} placeholder="Destiny van kaart" />
          </label>
        </div>

        <div> 
          <label>
            Forceiconsls:
            <input value={destiny} onChange={(e) => setDestiny(e.target.value)} placeholder="Forceicons LS van kaart" />
          </label>
        </div>
        
        <div> 
          <label>
            Forceiconsds:
            <input value={destiny} onChange={(e) => setDestiny(e.target.value)} placeholder="Forceicons DS van kaart" />
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
