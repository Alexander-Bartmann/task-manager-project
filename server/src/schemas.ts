import z from "zod";

const priorities = z.enum(["low", "medium", "high"]);

const taskSchema = z.object({
  title: z.string().trim().min(1, "Titel darf nicht leer sein"),
  text: z.string(),
  date: z.string(),
  priority: priorities,
  categoryId: z.string().nullable().optional(),
});

const categorySchema = z.object({
  name: z.string(),
});

const userSchema = z.object({
  password: z.string().min(8),
  email: z.email(),
});

export { taskSchema, priorities, categorySchema, userSchema };
