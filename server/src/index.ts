import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { prisma } from "./db.js";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { taskSchema, categorySchema, userSchema } from "./schemas.js";
import rateLimit from "express-rate-limit";

const app: Express = express();
app.use(express.json());
app.use(cors());
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Zu viele Versuche. Bitte später erneut." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter);

app.get("/", (req: Request, res: Response) => {
  res.send("Server läuft");
});

app.get("/tasks", requireAuth, async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId || typeof userId !== "string") {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }
  try {
    const tasks = await prisma.task.findMany({ where: { userId } });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Serverfehler" });
  }
});

app.post("/tasks", requireAuth, async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId || typeof userId !== "string") {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }
  try {
    const result = taskSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Ungültige Daten" });
    }
    const newTask = await prisma.task.create({
      data: {
        ...result.data,
        done: false,
        userId: userId,
      },
    });
    res.json(newTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Serverfehler" });
  }
});

app.patch("/tasks/:id", requireAuth, async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.userId;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Ungültige ID" });
  }
  if (!userId || typeof userId !== "string") {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }
  try {
    const task = await prisma.task.findUnique({ where: { id, userId } });
    if (!task) {
      return res.status(404).json({ error: "Task nicht gefunden" });
    }
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { done: !task.done },
    });
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Serverfehler" });
  }
});

app.put("/tasks/:id", requireAuth, async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.userId;
  if (!userId || typeof userId !== "string") {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Ungültige ID" });
  }
  try {
    const result = taskSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Ungültige Daten" });
    }
    const task = await prisma.task.findUnique({ where: { id, userId } });
    if (!task) {
      return res.status(404).json({ error: "Task nicht gefunden" });
    }
    const modifyingTask = await prisma.task.update({
      where: { id, userId },
      data: result.data,
    });
    res.json(modifyingTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Serverfehler" });
  }
});

app.delete("/tasks/:id", requireAuth, async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.userId;
  if (!userId || typeof userId !== "string") {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Ungültige ID" });
  }
  try {
    const task = await prisma.task.findUnique({ where: { id, userId } });
    if (!task) {
      return res.status(404).json({ error: "Task nicht gefunden" });
    }
    const deletedTask = await prisma.task.delete({
      where: { id, userId },
    });
    res.json(deletedTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Serverfehler" });
  }
});

app.post("/register", authLimiter, async (req: Request, res: Response) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    console.error(result.error);
    return res.status(400).json({ error: "Ungültige Daten" });
  }
  const { email, password } = result.data;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "E-Mail bereits vergeben" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    const { password: _, ...rest } = user;
    return res.status(201).json(rest);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Serverfehler" });
  }
});

app.post("/login", authLimiter, async (req: Request, res: Response) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    console.error(result.error);
    return res.status(400).json({ error: "Ungültige Daten" });
  }
  const { email, password } = result.data;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "E-Mail oder Passwort falsch" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "E-Mail oder Passwort falsch" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
    const { password: _, ...rest } = user;
    res.json({ ...rest, token });
    return;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Serverfehler" });
  }
});

app.get("/categories", requireAuth, async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId || typeof userId !== "string") {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }
  try {
    const categories = await prisma.category.findMany({ where: { userId } });
    res.json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Serverfehler" });
  }
});

app.post("/categories", requireAuth, async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId || typeof userId !== "string") {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }
  try {
    const result = categorySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Ungültige Daten" });
    }
    const newCategory = await prisma.category.create({
      data: {
        ...result.data,
        userId: userId,
      },
    });
    res.json(newCategory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Serverfehler" });
  }
});

app.put("/categories/:id", requireAuth, async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.userId;
  if (!userId || typeof userId !== "string") {
    return res.status(401).json({ error: "Nicht eingeloggt" });
  }
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Ungültige ID" });
  }
  try {
    const result = categorySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Ungültige Daten" });
    }
    const category = await prisma.category.findUnique({
      where: { id, userId },
    });
    if (!category) {
      return res.status(404).json({ error: "Kategorie nicht gefunden" });
    }
    const modifyingCategory = await prisma.category.update({
      where: { id, userId },
      data: result.data,
    });
    res.json(modifyingCategory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Serverfehler" });
  }
});

app.delete(
  "/categories/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const userId = req.userId;
    if (!userId || typeof userId !== "string") {
      return res.status(401).json({ error: "Nicht eingeloggt" });
    }
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Ungültige ID" });
    }
    try {
      const category = await prisma.category.findUnique({
        where: { id, userId },
      });
      if (!category) {
        return res.status(404).json({ error: "Kategorie nicht gefunden" });
      }
      const deletedCategory = await prisma.category.delete({
        where: { id, userId },
      });
      res.json(deletedCategory);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Serverfehler" });
    }
  },
);

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Kein Token vorhanden" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Kein Token vorhanden" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Ungültiger Token" });
  }
}

app.listen(3000);
