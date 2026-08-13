import { useState } from "react";

function AddCategoryForm({
  onAddCategory,
}: {
  onAddCategory: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [fehler, setFehler] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFehler("");

    if (!name.trim()) {
      setFehler("Name darf nicht leer sein");
      return;
    }

    onAddCategory(name);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Neue Kategorie"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm
                     focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="cursor-pointer shrink-0 rounded-md border border-slate-300 px-3 py-2
                     text-sm text-slate-700 hover:bg-slate-100"
        >
          Hinzufügen
        </button>
      </div>
      {fehler && <p className="text-sm text-red-600">{fehler}</p>}
    </form>
  );
}

export default AddCategoryForm;
