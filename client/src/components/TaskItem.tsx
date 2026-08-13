import { useState } from "react";
import type { Category, Task } from "../types";

const priorityStyles = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

const priorityLabels = {
  low: "Niedrig",
  medium: "Mittel",
  high: "Hoch",
};

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm " +
  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

function TaskItem({
  task,
  onToggle,
  onDelete,
  onSaved,
  categories,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSaved: (task: Task) => void;
  categories: Category[];
}) {
  const [isModifying, setIsModifying] = useState(false);
  const [modifiedTask, setModifiedTask] = useState<Task>(task);

  const category = categories.find((cat) => cat.id === task.categoryId);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setModifiedTask({ ...modifiedTask, [e.target.name]: e.target.value });
  };

  if (isModifying) {
    return (
      <div className="rounded-lg border border-blue-300 bg-white p-4">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            name="title"
            placeholder="Titel"
            value={modifiedTask.title}
            onChange={handleChange}
            className={inputClass}
          />
          <input
            type="text"
            name="text"
            placeholder="Beschreibung"
            value={modifiedTask.text}
            onChange={handleChange}
            className={inputClass}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              name="priority"
              value={modifiedTask.priority}
              onChange={handleChange}
              className={`${inputClass} cursor-pointer bg-white`}
              aria-label="Priorität"
            >
              <option value="">Priorität wählen</option>
              <option value="low">Niedrig</option>
              <option value="medium">Mittel</option>
              <option value="high">Hoch</option>
            </select>{" "}
            <select
              name="categoryId"
              value={modifiedTask.categoryId ?? ""}
              onChange={handleChange}
              aria-label="Kategorie"
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
              value={modifiedTask.date}
              onChange={handleChange}
              className={`${inputClass} cursor-pointer`}
              aria-label="Fälligkeitsdatum"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setIsModifying(false)}
            className="cursor-pointer rounded-md border border-slate-300 px-3 py-1.5
                       text-sm text-slate-700 hover:bg-slate-100"
          >
            Abbrechen
          </button>
          <button
            onClick={() => {
              onSaved(modifiedTask);
              setIsModifying(false);
            }}
            className="cursor-pointer rounded-md bg-blue-600 px-3 py-1.5
                       text-sm font-medium text-white hover:bg-blue-700"
          >
            Speichern
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        {/* links: Inhalt */}
        <div className="flex flex-1 items-start gap-3">
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => onToggle(task.id)}
            aria-label="Task erledigt"
            className="mt-1 h-4 w-4 cursor-pointer"
          />
          <div className="flex-1">
            <p
              className={`font-medium ${
                task.done ? "text-slate-400 line-through" : "text-slate-900"
              }`}
            >
              {task.title}
            </p>

            {task.text && (
              <p className="mt-0.5 text-sm text-slate-600">{task.text}</p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              {task.priority && (
                <span
                  className={`rounded px-2 py-0.5 font-medium ${
                    priorityStyles[task.priority]
                  }`}
                >
                  {priorityLabels[task.priority]}
                </span>
              )}
              <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                {category ? category.name : "Keine Kategorie"}
              </span>
              {task.date && (
                <span className="text-slate-500">
                  {new Date(task.date).toLocaleDateString("de-DE")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* rechts: Aktionen */}
        <div className="flex shrink-0 gap-1">
          <button
            onClick={() => setIsModifying(true)}
            aria-label="Task bearbeiten"
            className="cursor-pointer rounded p-1.5 text-slate-500
                       hover:bg-slate-100 hover:text-slate-900"
          >
            🖊
          </button>
          <button
            onClick={() => onDelete(task.id)}
            aria-label="Task löschen"
            className="cursor-pointer rounded p-1.5 text-slate-500
                       hover:bg-red-50 hover:text-red-600"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
