const { pool } = require("../config/db");
const {
  articleIdParamSchema,
  commentIdParamSchema,
  createCommentSchema,
} = require("../validators/comment.validator");

/**
 * @param {import("express").Request} req
 * @returns {number}
 */
function parseArticleId(req) {
  const { success, error, data } = articleIdParamSchema.safeParse(req.params);
  if (!success) throw error;

  const { articleId } = data;
  return articleId;
}

/**
 * @param {import("express").Request} req
 * @returns {number}
 */
function parseCommentId(req) {
  const { success, error, data } = commentIdParamSchema.safeParse(req.params);
  if (!success) throw error;

  const { commentId } = data;
  return commentId;
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * */
exports.getCommentsByArticle = async (req, res) => {
  try {
    const articleId = parseArticleId(req);

    const [rows] = await pool.query(
      `
      SELECT comments.*, users.username, users.avatar
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.article_id = ?
      ORDER BY comments.created_at DESC
      `,
      [articleId],
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * */
exports.createComment = async (req, res) => {
  try {
    const articleId = parseArticleId(req);

    const { success, data, error } = createCommentSchema.safeParse(req.body);
    if (!success) return res.status(400).json(error);

    const { content } = data;

    if (!content?.trim())
      return res.status(422).json({ message: "Content is required" });

    const [result] = await pool.query(
      `
      INSERT INTO comments (content, article_id, user_id)
      VALUES (?, ?, ?)
      `,
      [content, req.params.articleId, req.userId],
    );

    const [rows] = await pool.query(
      `
      SELECT comments.*, users.username, users.avatar
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.id = ?
      `,
      [result.insertId],
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * */
exports.deleteComment = async (req, res) => {
  try {
    const commentId = parseCommentId(req);

    const [comments] = await pool.query("SELECT * FROM comments WHERE id = ?", [
      commentId,
    ]);

    if (comments.length === 0)
      return res.status(404).json({ message: "Comment not found" });

    if (comments[0].user_id !== req.userId)
      return res.status(403).json({ message: "Not authorized" });

    await pool.query("DELETE FROM comments WHERE id = ?", [commentId]);

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
