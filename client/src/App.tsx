import { useEffect, useState } from "react";
import "./App.css";
import TaskItem from "./components/TaskItem";
import type { Category, Task } from "./types";
import AddTaskForm from "./components/AddTaskForm";
import Login from "./components/Login";
import Register from "./components/Register";
import AddCategoryForm from "./components/AddCategoryForm";
import { API_URL } from "./config";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [fehler, setFehler] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "done" | "notDone">("all");
  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem("token");
    return stored;
  });
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [taskStatus, setTaskStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [categoryStatus, setCategoryStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    const loadCategories = async () => {
      if (!token) return;
      setCategoryStatus("loading");
      try {
        const response = await fetch(`${API_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          setCategoryStatus("error");
          return;
        }
        const data = await response.json();
        setCategories(data);
        setCategoryStatus("success");
      } catch (error) {
        setCategoryStatus("error");
        console.error("Laden der Kategorien fehlgeschlagen", error);
      }
    };
    loadCategories();
  }, [token]);

  useEffect(() => {
    const loadTasks = async () => {
      if (!token) return;
      setTaskStatus("loading");
      try {
        const response = await fetch(`${API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          setTaskStatus("error");
          return;
        }
        const data = await response.json();
        setTasks(data);
        setTaskStatus("success");
      } catch (error) {
        setTaskStatus("error");
        console.error("Laden der Task fehlgeschlagen", error);
      }
    };
    loadTasks();
  }, [token]);

  const toggleTask = async (id: string) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, done: !task.done } : task,
        ),
      );
    } catch (error) {
      console.error("Toggle fehlgeschlagen:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Löschen fehlgeschlagen:", error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories((pevCategory) =>
        pevCategory.filter((category) => category.id !== id),
      );
    } catch (error) {
      console.error("Löschen fehlgeschlagen", error);
    }
  };

  const handleAddTask = async (task: Task) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });
      if (!response.ok) {
        const data = await response.json();
        setFehler(data.error);
        return;
      }
      const savedTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, savedTask]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCategory = async (name: string) => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        const data = await response.json();
        setFehler(data.error);
        return;
      }
      const savedCategory = await response.json();
      setCategories((prevCategories) => [...prevCategories, savedCategory]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveTask = async (task: Task) => {
    try {
      await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });
      setTasks((prevTasks) =>
        prevTasks.map((currentTask) =>
          currentTask.id === task.id ? task : currentTask,
        ),
      );
    } catch (error) {
      console.error("Speichern fehlgeschlagen:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    let matchesFilter = false;
    if (filter === "all") matchesFilter = true;
    if (filter === "done") matchesFilter = task.done;
    if (filter === "notDone") matchesFilter = !task.done;

    const matchesSearch = task.title.includes(search);

    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <h1 className="text-3xl font-bold text-blue-600">Test</h1>

      {token ? (
        <>
          {(taskStatus === "loading" || categoryStatus === "loading") && (
            <p>Lädt...</p>
          )}
          {(taskStatus === "error" || categoryStatus === "error") && (
            <p>Fehler beim Laden der Tasks.</p>
          )}
          {fehler && <p>{fehler}</p>}
          <label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 🔍"
              className="w-full p-2 border rounded"
            />
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "done" | "notDone")
              }
            >
              <option value="all">Alle</option>
              <option value="done">Erledigt</option>
              <option value="notDone">Offen</option>
            </select>
          </label>
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onSaved={handleSaveTask}
              categories={categories}
            />
          ))}
          {filteredTasks.length === 0 && taskStatus === "success" && (
            <p>Keine Task gefunden</p>
          )}
          <AddTaskForm onAddTask={handleAddTask} categories={categories} />

          <AddCategoryForm onAddCategory={handleAddCategory} />
          {categories.map((category) => (
            <div key={category.id}>
              {category.name}
              <button
                onClick={() => {
                  deleteCategory(category.id);
                }}
              >
                Löschen
              </button>
            </div>
          ))}
          {categories.length === 0 && categoryStatus === "success" && (
            <p>Keine Kategorie gefunden</p>
          )}
          <button
            onClick={() => {
              setToken(null);
              setTasks([]);
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <div className="p-4 border rounded-lg mb-4">
            <h2>Login</h2>
            <Login onLogin={setToken} />
          </div>
          <div className="p-4 border rounded-lg mb-4">
            <h2>Registrierung</h2>
            <Register
              onRegistered={() => {
                setRegisterSuccess(true);
              }}
            />
            {registerSuccess && (
              <p>Registrieung erfolgreich! Bitte einloggen</p>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default App;
