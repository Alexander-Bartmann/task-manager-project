import z from "zod";

const userSchema = z.object({
  email: z.email("Bitte eine gültige E-Mail-Adresse eingeben"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein"),
});

export { userSchema };
