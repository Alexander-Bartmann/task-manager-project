import { useEffect, useState } from "react";
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

    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-200">
      <div className="mx-auto max-w-3xl p-4 md:p-8 bg-slate-50">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Task Manager
          </h1>
          {token && (
            <button
              onClick={() => {
                setToken(null);
                setTasks([]);
              }}
              className="cursor-pointer rounded-md border border-slate-300 px-3 py-1.5
                   text-sm text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          )}
        </div>
        {token ? (
          <div>
            {(taskStatus === "loading" || categoryStatus === "loading") && (
              <p className="text-sm text-slate-500">Lädt...</p>
            )}
            {(taskStatus === "error" || categoryStatus === "error") && (
              <p className="text-sm text-red-600">
                Fehler beim Laden der Tasks.
              </p>
            )}
            {fehler && (
              <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {fehler}
              </p>
            )}

            <div className="mb-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Suchen..."
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm
                   focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as "all" | "done" | "notDone")
                }
                aria-label="Tasks filtern"
                className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-sm
                   focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Alle</option>
                <option value="done">Erledigt</option>
                <option value="notDone">Offen</option>
              </select>
            </div>

            <AddTaskForm onAddTask={handleAddTask} categories={categories} />

            <div className="mt-4 flex flex-col gap-2">
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
            </div>

            {filteredTasks.length === 0 && taskStatus === "success" && (
              <p className="py-8 text-center text-sm text-slate-500">
                Keine Tasks gefunden
              </p>
            )}

            <div className="mt-8 rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="mb-3 text-sm font-semibold text-slate-900">
                Kategorien
              </h2>

              <AddCategoryForm onAddCategory={handleAddCategory} />

              {categories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <span
                      key={category.id}
                      className="flex items-center gap-1.5 rounded-full bg-slate-100
                         px-3 py-1 text-sm text-slate-700"
                    >
                      {category.name}
                      <button
                        onClick={() => deleteCategory(category.id)}
                        aria-label={`Kategorie ${category.name} löschen`}
                        className="cursor-pointer text-slate-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {categories.length === 0 && categoryStatus === "success" && (
                <p className="mt-3 text-sm text-slate-500">
                  Noch keine Kategorien
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Login
              </h2>
              <Login onLogin={setToken} />
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Registrierung
              </h2>
              <Register
                onRegistered={() => {
                  setRegisterSuccess(true);
                }}
              />
              {registerSuccess && (
                <p className="mt-3 text-sm text-green-700">
                  Registrieung erfolgreich! Bitte einloggen
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
