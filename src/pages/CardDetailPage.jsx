import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient.js";

import CardImage from "../components/card/CardImage.jsx";
import CardInfo from "../components/card/CardInfo.jsx";
import FavoriteButton from "../components/card/FavoriteButton.jsx";
import RatingStars from "../components/card/RatingStars.jsx";
import CommentsList from "../components/card/CommentsList.jsx";
import CommentForm from "../components/card/CommentForm.jsx";

export default function CardDetailPage({ cards, onToggleFavorite, onRateCard }) {
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

  async function handleSubmitComment() {
    const text = commentText.trim();
    const name = author.trim() || "Anoniem";
    if (!card || !text) return;

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

  if (!card) {
    return (
      <div>
        <p>Kaart niet gevonden.</p>
        <p><Link to="/">Terug naar overzicht</Link></p>
      </div>
    );
  }

  return (
    <div>
      <p>
        <Link to="/">Terug naar overzicht</Link> |{" "}
        <Link to="/favorites">Naar favorieten</Link>
      </p>

      <CardImage src={card.imageUrl || card.image} alt={card.title} />

      <h1>{card.title}</h1>

      <CardInfo card={card} />

      <FavoriteButton
        isFavorite={card.isFavorite}
        onClick={() => onToggleFavorite(card.id)}
      />

      <RatingStars
        value={card.rating || 0}
        onRate={(stars) => onRateCard(card.id, stars)}
      />

      <hr />

      <h2>Comments</h2>

      <CommentsList loading={loadingComments} comments={comments} />

      <CommentForm
        author={author}
        setAuthor={setAuthor}
        commentText={commentText}
        setCommentText={setCommentText}
        onSubmit={handleSubmitComment}
      />
    </div>
  );
}