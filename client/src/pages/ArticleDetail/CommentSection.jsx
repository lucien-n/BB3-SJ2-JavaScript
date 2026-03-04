import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import SingleComment from "./SingleComment";

/**
 * @typedef {Object} Props
 * @property {number} articleId
 */

/** @param {Props} props */
const CommentsSection = ({ articleId }) => {
  const { user } = useAuth();
  /** @type {[import("../../types").Comment[], React.Dispatch<React.SetStateAction<import("../../types").Comment[]>>]} */
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await API.get(`/articles/${articleId}/comments`);
        setComments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [articleId]);

  /** @param {SubmitEvent} ev */
  const handleAddComment = async (ev) => {
    ev.preventDefault();
    if (!newCommentContent.trim()) return;

    try {
      const { data } = await API.post(`/articles/${articleId}/comments`, {
        content: newCommentContent,
      });
      setComments((prev) => [data, ...prev]);
      setNewCommentContent("");
    } catch (err) {
      console.error(err);
    }
  };

  /** @param {string} commentId */
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Supprimer ce commentaire ?")) return;

    try {
      await API.delete(`/articles/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section style={{ marginTop: "60px" }}>
      <h2 style={{ marginBottom: "20px" }}>Commentaires ({comments.length})</h2>

      {user && (
        <form onSubmit={handleAddComment} style={{ marginBottom: "30px" }}>
          <textarea
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            placeholder="Écrire un commentaire..."
            rows={4}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              marginBottom: "10px",
              resize: "vertical",
            }}
          />
          <button type="submit" className="btn">
            Publier
          </button>
        </form>
      )}

      {isLoading ? (
        <div>Chargement des commentaires...</div>
      ) : comments.length === 0 ? (
        <div>Aucun commentaire pour le moment.</div>
      ) : (
        comments.map((comment) => (
          <SingleComment
            key={comment.id}
            comment={comment}
            onDelete={() => handleDeleteComment(comment.id)}
          />
        ))
      )}
    </section>
  );
};

export default CommentsSection;
