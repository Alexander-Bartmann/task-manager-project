import { useState } from "react";
import type { Category, Task } from "../types";

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm " +
  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

function AddTaskForm({
  onAddTask,
  categories,
}: {
  onAddTask: (task: Task) => void;
  categories: Category[];
}) {
  const [newTask, setNewTask] = useState({
    title: "",
    text: "",
    priority: "",
    date: "",
    categoryId: "",
  });
  const [fehler, setFehler] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const addTask = () => {
    setFehler("");

    if (!newTask.title.trim()) {
      setFehler("Titel darf nicht leer sein");
      return;
    }
    if (!newTask.priority) {
      setFehler("Bitte eine Priorität wählen");
      return;
    }

    const task: Task = {
      ...newTask,
      id: crypto.randomUUID(),
      done: false,
      priority: newTask.priority as "low" | "medium" | "high",
    };

    onAddTask(task);
    setNewTask({
      title: "",
      text: "",
      priority: "",
      date: "",
      categoryId: "",
    });
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">Neue Task</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
        className="flex flex-col gap-3"
      >
        <input
          type="text"
          name="title"
          placeholder="Titel"
          value={newTask.title}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="text"
          name="text"
          placeholder="Beschreibung (optional)"
          value={newTask.text}
          onChange={handleChange}
          className={inputClass}
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            name="priority"
            value={newTask.priority}
            onChange={handleChange}
            className={`${inputClass} cursor-pointer bg-white`}
          >
            <option value="">Priorität</option>
            <option value="low">Niedrig</option>
            <option value="medium">Mittel</option>
            <option value="high">Hoch</option>
          </select>

          <select
            name="categoryId"
            value={newTask.categoryId}
            onChange={handleChange}
            className={`${inputClass} cursor-pointer bg-white`}
          >
            <option value="">Keine Kategorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={newTask.date}
            onChange={handleChange}
            className={`${inputClass} cursor-pointer`}
          />
        </div>

        {fehler && <p className="text-sm text-red-600">{fehler}</p>}

        <button
          type="submit"
          className="cursor-pointer self-start rounded-md bg-blue-600 px-4 py-2
                     text-sm font-medium text-white hover:bg-blue-700"
        >
          Hinzufügen
        </button>
      </form>
    </div>
  );
}

export default AddTaskForm;
