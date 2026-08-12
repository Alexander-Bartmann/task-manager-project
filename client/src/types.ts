export interface Task {
  id: string;
  title: string;
  text: string;
  done: boolean;
  priority: "low" | "medium" | "high";
  date: string;
  categoryId?: string;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
}
