import { useState } from "react";
import type { Category, Task } from "../types";

function AddTaskForm({
  onAddTask,
  categories,
}: {
  onAddTask: (task: Task) => void;
  categories: Category[];
}) {
  const addTask = () => {
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

  const [newTask, setNewTask] = useState({
    title: "",
    text: "",
    priority: "",
    date: "",
    categoryId: "",
  });

  return (
    <>
      {" "}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
      >
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) =>
            setNewTask({ ...newTask, [e.target.name]: e.target.value })
          }
          name="title"
        />
        <input
          type="text"
          placeholder="Task text"
          value={newTask.text}
          onChange={(e) =>
            setNewTask({ ...newTask, [e.target.name]: e.target.value })
          }
          name="text"
        />
        <select
          value={newTask.priority}
          onChange={(e) =>
            setNewTask({ ...newTask, [e.target.name]: e.target.value })
          }
          name="priority"
        >
          <option value="">Select priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={newTask.categoryId}
          onChange={(e) =>
            setNewTask({ ...newTask, [e.target.name]: e.target.value })
          }
          name="categoryId"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          placeholder="Task date"
          value={newTask.date}
          onChange={(e) =>
            setNewTask({ ...newTask, [e.target.name]: e.target.value })
          }
          name="date"
        />
        <button type="submit">Add Task</button>
      </form>
    </>
  );
}

export default AddTaskForm;
