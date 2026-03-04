const z = require("zod").default;

exports.articleIdParamSchema = z.object({
  articleId: z.coerce.number().int().positive(),
});

exports.createCommentSchema = z.object({
  articleId: z.coerce.number().int().positive(),
  content: z.string().min(1).max(1000),
});

exports.deleteCommentSchema = z.object({
  commentId: z.coerce.number().int().positive(),
});
