export default function CommentForm({
  author,
  setAuthor,
  commentText,
  setCommentText,
  onSubmit,
}) {
  return (
    <div>
      <p>
        <input
          type="text"
          placeholder="Naam"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </p>

      <p>
        <textarea
          rows={2}
          placeholder="Schrijf een comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
      </p>

      <button type="button" onClick={onSubmit}>
        Plaats comment
      </button>
    </div>
  );
}