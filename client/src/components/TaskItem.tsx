import { useState } from "react";
import type { Category, Task } from "../types";

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

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

  return (
    <>
      {isModifying ? (
        <div>
          <label>
            <input
              type="text"
              placeholder="Task Title"
              value={modifiedTask.title}
              onChange={(e) =>
                setModifiedTask({
                  ...modifiedTask,
                  [e.target.name]: e.target.value,
                })
              }
              name="title"
            />
            <input
              type="text"
              placeholder="Task description"
              value={modifiedTask.text}
              onChange={(e) =>
                setModifiedTask({
                  ...modifiedTask,
                  [e.target.name]: e.target.value,
                })
              }
              name="text"
            />
            <select
              value={modifiedTask.priority}
              onChange={(e) =>
                setModifiedTask({
                  ...modifiedTask,
                  [e.target.name]: e.target.value,
                })
              }
              name="priority"
            >
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              placeholder="Task date"
              value={modifiedTask.date}
              onChange={(e) =>
                setModifiedTask({
                  ...modifiedTask,
                  [e.target.name]: e.target.value,
                })
              }
              name="date"
            />
          </label>
          <button onClick={() => setIsModifying(false)}>Schließen</button>
          <button
            onClick={() => {
              onSaved(modifiedTask);
              setIsModifying(false);
            }}
          >
            Speichern
          </button>
        </div>
      ) : (
        <div
          className={`p-3 border rounded-lg mb-2 ${priorityColors[task.priority]}`}
        >
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => onToggle(task.id)}
            />
            <span className={task.done ? "line-through text-gray-400" : ""}>
              {task.title}
            </span>
            <p>
              {task.text}
              {task.date}
              <span>{category ? category.name : "Keine Kategorie"}</span>
            </p>
          </label>
          <button aria-label="task löschen" onClick={() => onDelete(task.id)}>
            Löschen 🗑
          </button>
          <button onClick={() => setIsModifying(true)}>Bearbeiten 🖊</button>
        </div>
      )}
    </>
  );
}

export default TaskItem;
