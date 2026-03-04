import z from "zod";

const USERNAME_MIN_LENGTH = 3;
const PASSWORD_MIN_LENGTH = 6;

export const registerSchema = z.object({
  username: z.string().min(USERNAME_MIN_LENGTH),
  email: z.email(),
  password: z.string().min(PASSWORD_MIN_LENGTH),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(PASSWORD_MIN_LENGTH),
});
