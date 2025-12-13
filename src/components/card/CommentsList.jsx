export default function CommentsList({ loading, comments }) {
  if (loading) return <p>Comments laden...</p>;
  if (!comments || comments.length === 0) return <p>Nog geen comments.</p>;

  return (
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
  );
}