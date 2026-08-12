export interface Task {
  id: string;
  title: string;
  text: string;
  done: boolean;
  priority: "low" | "medium" | "high";
  date: string;
}
