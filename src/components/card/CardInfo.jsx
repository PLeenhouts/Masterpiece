export default function CardInfo({ card }) {
  return (
    <>
      {card.serie !== undefined && <p><strong>Serie:</strong> {card.serie}</p>}
      {card.year !== undefined && <p><strong>Jaar:</strong> {card.year}</p>}
      {card.side !== undefined && <p><strong>Side:</strong> {card.side}</p>}
      {card.type !== undefined && <p><strong>Type kaart:</strong> {card.type}</p>}
      {card.role !== undefined && <p><strong>Soort:</strong> {card.role}</p>}
      {card.rarity !== undefined && <p><strong>Rarity:</strong> {card.rarity}</p>}
      {card.description !== undefined && <p><strong>Description:</strong> {card.description}</p>}
      {card.playtext !== undefined && <p><strong>Gametekst:</strong> {card.playtext}</p>}

      {Array.isArray(card.roles) && card.roles.filter(r => r.trim() !== "").length > 0 && (
        <p><strong>Rollen:</strong> {card.roles.filter(r => r.trim() !== "").join(", ")}</p>
      )}

      {card.power !== undefined && <p><strong>Power:</strong> {card.power}</p>}
      {card.ability !== undefined && <p><strong>Ability:</strong> {card.ability}</p>}
      {card.rank && card.rank.trim() !== "" && <p><strong>Rank:</strong> {card.rank}</p>}
      {card.armor !== undefined && <p><strong>Armor:</strong> {card.armor}</p>}
      {card.maneuver !== undefined && <p><strong>Maneuver:</strong> {card.maneuver}</p>}
      {card.hyperspeed !== undefined && <p><strong>Hyperspeed:</strong> {card.hyperspeed}</p>}
      {card.landspeed !== undefined && <p><strong>Landspeed:</strong> {card.landspeed}</p>}
      {card.deploy !== undefined && <p><strong>Deploy:</strong> {card.deploy}</p>}
      {card.forfeit !== undefined && <p><strong>Forfeit:</strong> {card.forfeit}</p>}
      {card.destiny !== undefined && (<p><strong>Destiny:</strong>{" "}{Array.isArray(card.destiny) ? card.destiny.join(" / ") : card.destiny}</p>)}
      {card.forceiconsls !== undefined && <p><strong>Force Icons LS:</strong> {card.forceiconsls}</p>}
      {card.forceiconsds !== undefined && <p><strong>Force Icons DS:</strong> {card.forceiconsds}</p>}
    </>
  );
}
