import { useState } from "react";

function AddCategoryForm({
  onAddCategory,
}: {
  onAddCategory: (name: string) => void;
}) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCategory(name);
    setName("");
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Kategorie Name"
        />
        <button type="submit">Hinzufügen</button>
      </form>
    </>
  );
}

export default AddCategoryForm;
