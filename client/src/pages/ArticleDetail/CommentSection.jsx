import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

/**
 * @typedef {Object} Props
 * @property {number} articleId
 */

/** @param {Props} props */
const CommentsSection = ({ articleId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await API.get(`/articles/${articleId}/comments`);
        setComments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [articleId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await API.post(`/articles/${articleId}/comments`, {
        content: newComment,
      });
      setComments((prev) => [data, ...prev]);
      setNewComment("");
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
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
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

      {loading ? (
        <div>Chargement des commentaires...</div>
      ) : comments.length === 0 ? (
        <div>Aucun commentaire pour le moment.</div>
      ) : (
        comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              padding: "15px 0",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
              {comment.username}
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                color: "var(--text-muted)",
                marginBottom: "8px",
              }}
            >
              {new Date(comment.created_at).toLocaleDateString()}
            </div>
            <div style={{ whiteSpace: "pre-wrap" }}>{comment.content}</div>
          </div>
        ))
      )}
    </section>
  );
};

export default CommentsSection;
