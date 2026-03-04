const { pool } = require("../config/db");
const { getByArticleSchema } = require("../validators/comment.validator");

exports.getCommentsByArticle = async (req, res) => {
  try {
    const { success, data, error } = getByArticleSchema.safeParse(req.params);

    if (!success) {
      return res.status(400).json(error);
    }

    const { articleId } = data;

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

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim())
      return res.status(422).json({ message: "Content is required" });

    const [result] = await pool.query(
      `
      INSERT INTO comments (content, article_id, user_id)
      VALUES (?, ?, ?)
      `,
      [content, req.params.articleId, req.userId],
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const [comments] = await pool.query("SELECT * FROM comments WHERE id = ?", [
      req.params.commentId,
    ]);

    if (comments.length === 0)
      return res.status(404).json({ message: "Comment not found" });

    if (comments[0].user_id !== req.userId)
      return res.status(403).json({ message: "Not authorized" });

    await pool.query("DELETE FROM comments WHERE id = ?", [
      req.params.commentId,
    ]);

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
