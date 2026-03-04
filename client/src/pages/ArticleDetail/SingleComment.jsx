/**
 * @typedef {Object} Props
 * @property {import("../../types").Comment} comment
 * @property {() => void} onDelete
 */

import { useAuth } from "../../context/AuthContext";

/** @param {Props} props */
const SingleComment = ({ comment, onDelete }) => {
  const { user } = useAuth();

  const isOwner = user?.id === comment.user_id;

  return (
    <div
      key={comment.id}
      style={{
        padding: "15px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontWeight: "bold" }}>{comment.username}</div>

        {isOwner && (
          <button
            onClick={onDelete}
            style={{
              background: "transparent",
              border: "none",
              color: "#ef4444",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Supprimer
          </button>
        )}
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
  );
};

export default SingleComment;
