import { useState } from "react";
type Task = {
  id: string;
  text: string;
  done: boolean;
};

function TodoToggle() {
  const [todo, setTodo] = useState<Task[]>([
    { id: crypto.randomUUID(), text: "random text 1", done: false },
    { id: crypto.randomUUID(), text: "random text 2", done: true },
    { id: crypto.randomUUID(), text: "random text 3", done: false },
  ]);

  const toggleTask = (id: string) => {
    setTodo((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  };
  return (
    <>
      {todo.map((task) => (
        <div key={task.id}>
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => toggleTask(task.id)}
          />
          <p>{task.text}</p>
        </div>
      ))}
    </>
  );
}

export default TodoToggle;
