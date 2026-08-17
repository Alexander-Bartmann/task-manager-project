import z, { email } from "zod";

const priorities = z.enum(["low", "medium", "high"]);

const taskSchema = z.object({
  title: z.string(),
  text: z.string(),
  date: z.string(),
  priority: priorities,
  categoryId: z.string().optional(),
});

const categorySchema = z.object({
  name: z.string(),
});

const userSchema = z.object({
  password: z.string().min(8),
  email: z.email(),
});

export { taskSchema, priorities, categorySchema, userSchema };
