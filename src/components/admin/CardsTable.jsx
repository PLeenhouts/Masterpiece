export default function CardsTable({ cards, onEdit, onDelete }) {
  if (cards.length === 0) return <p>Er zijn nog geen kaarten.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Titel</th>
          <th>Serie</th>
          <th>Side</th>
          <th>Type</th>
          <th>Jaar</th>
          <th>Rarity</th>
          <th>Afbeelding (pad)</th>
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
            <td>{card.imagePath ?? ""}</td>
            <td>
              <button type="button" onClick={() => onEdit(card)}>Bewerken</button>
              <button type="button" onClick={() => onDelete(card.id)}>Verwijderen</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}