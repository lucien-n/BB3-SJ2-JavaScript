const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

const DUMMY_HASH = "$2a$10$abcdefghijklmnopqrstuvwxyzabcdefghi";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET not configured");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * */
exports.register = async (req, res) => {
  try {
    const { data, success, error } = registerSchema.safeParse(req.body);
    if (!success) return res.status(422).json(error);

    const { username, email, password } = data;

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existing.length > 0)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await pool.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword],
      );
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Email already taken" });
      }
      throw err;
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("register error :", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * */
exports.login = async (req, res) => {
  try {
    const { data, success, error } = loginSchema.safeParse(req.body);
    if (!success) return res.status(422).json(error);

    const { email, password } = data;

    const [rows] = await pool.query(
      "SELECT id, username, email, password, avatar FROM users WHERE email = ?",
      [email],
    );

    const user = rows[0];

    const passwordValid = await bcrypt.compare(
      password,
      user ? user.password : DUMMY_HASH,
    );

    if (!user || !passwordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("login error :", err);
    res.status(500).json({ message: "Server error" });
  }
};
