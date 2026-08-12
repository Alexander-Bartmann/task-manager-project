import React, { useState } from "react";

function NameForm() {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(text);
    setText("");
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
          className="w-full p-2 border rounded"
        />
        <button type="submit">Hinzufügen</button>
      </form>
    </>
  );
}

export default NameForm;
