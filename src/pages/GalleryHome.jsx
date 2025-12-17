import { useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";

import SearchBar from "../components/gallery/SearchBar.jsx";
import FiltersPanel from "../components/gallery/FiltersPanel.jsx";
import CardGrid from "../components/card/CardGrid.jsx";

export default function GalleryHome({ cards, onToggleFavorite, onRateCard }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeries, setSelectedSeries] = useState([]);
  const [selectedSides, setSelectedSides] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const seriesOrder = ["Premiere", "A New Hope", "Hoth", "Dagobah", "Cloud City", "Jabba's Palace",  "Endor", "Death Star II"];
  const sideOrder = ["Light", "Dark"];
  const typeOrder = ["Character", "Starship", "Vehicle", "Weapon", "Device", "Effect", "Interrupt", "Location"];

  const seriesOptions = [...new Set(cards.map(c => c.serie).filter(Boolean))]
  .sort((a, b) => (seriesOrder.indexOf(a) === -1 ? 999 : seriesOrder.indexOf(a)) - (seriesOrder.indexOf(b) === -1 ? 999 : seriesOrder.indexOf(b)));
  const sideOptions = [...new Set(cards.map(c => c.side).filter(Boolean))]
  .sort((a, b) => (sideOrder.indexOf(a) === -1 ? 999 : sideOrder.indexOf(a)) - (sideOrder.indexOf(b) === -1 ? 999 : sideOrder.indexOf(b)));
  const typeOptions = [...new Set(cards.map(c => c.type).filter(Boolean))]
  .sort((a, b) => (typeOrder.indexOf(a) === -1 ? 999 : typeOrder.indexOf(a)) - (typeOrder.indexOf(b) === -1 ? 999 : typeOrder.indexOf(b)));

  const toggleInArray = (value, setter) => {
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const filteredCards = cards.filter((card) => {
    const term = searchTerm.toLowerCase().trim();

    if (selectedSeries.length > 0 && !selectedSeries.includes(card.serie)) return false;
    if (selectedSides.length > 0 && !selectedSides.includes(card.side)) return false;
    if (selectedTypes.length > 0 && !selectedTypes.includes(card.type)) return false;
    if (!term) return true;

    const statMatch = term.match(/^(power|ability|armor|maneuver|hyperspeed|landspeed|deploy|forfeit|destiny|forceiconsls|forceiconsds)\s+(.+)$/);
    if (statMatch) {
      const field = statMatch[1];
      const value = statMatch[2];

      if (field === "destiny") {
        if (Array.isArray(card.destiny)) return card.destiny.some((d) => String(d).toLowerCase() === value);
        if (card.destiny !== undefined) return String(card.destiny).toLowerCase() === value;
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
      ? card.roles.filter((r) => typeof r === "string").join(" ").toLowerCase()
      : "";

    const destinyText = Array.isArray(card.destiny)
      ? card.destiny.join(" ").toLowerCase()
      : card.destiny !== undefined
      ? String(card.destiny).toLowerCase()
      : "";

    const power = card.power !== undefined ? String(card.power) : "";
    const ability = card.ability !== undefined ? String(card.ability) : "";
    const armor = card.armor !== undefined ? String(card.armor) : "";
    const maneuver = card.maneuver !== undefined ? String(card.maneuver) : "";
    const hyperspeed = card.hyperspeed !== undefined ? String(card.hyperspeed) : "";
    const landspeed = card.landspeed !== undefined ? String(card.landspeed) : "";
    const deploy = card.deploy !== undefined ? String(card.deploy) : "";
    const forfeit = card.forfeit !== undefined ? String(card.forfeit) : "";
    const forceiconsls = card.forceiconsls !== undefined ? String(card.forceiconsls) : "";
    const forceiconsds = card.forceiconsds !== undefined ? String(card.forceiconsds) : "";

    const haystack = [title, type, series, side, rarity, rank, rolesText, destinyText, power, ability, armor, maneuver, hyperspeed, landspeed, deploy, forfeit, forceiconsls, forceiconsds].join(" ");
    return haystack.includes(term);
  });

  return (
    <div>
      <h1>“Holocron-Archives” - …Unlock the secrets of the Force… One card at a time.</h1>
      <p>Een virtueel overzicht van Star Wars CCG kaarten</p>
      <hr/>

      <div>
      <h2>Links</h2>
            <p>
        <Link to="/favorites">Naar favorietenpagina</Link> |{" "}
        <Link to="/admin">Inloggen als admin</Link>
      </p>
      </div>
      <hr/>


      <h2>Zoeken en/of filteren van kaarten</h2>
      <p>Je kunt hier zoeken op namen of kaarteigenschappen. Ook kun je hier bepaalde series en/of kaartsoorten filteren, om het zoeken makkelijker te maken.</p>
      <p>
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Zoek op titel of bijv. 'power 5'"
      />
      </p>
      <FiltersPanel
        seriesOptions={seriesOptions}
        selectedSeries={selectedSeries}
        onToggleSeries={(v) => toggleInArray(v, setSelectedSeries)}
        sideOptions={sideOptions}
        selectedSides={selectedSides}
        onToggleSide={(v) => toggleInArray(v, setSelectedSides)}
        typeOptions={typeOptions}
        selectedTypes={selectedTypes}
        onToggleType={(v) => toggleInArray(v, setSelectedTypes)}
      />
      <hr/>
      <h2>Kaartoverzicht</h2>
      <CardGrid
        cards={filteredCards}
        onToggleFavorite={onToggleFavorite}
        onRateCard={onRateCard}
        showRating={true}
      />
    </div>
  );
}
