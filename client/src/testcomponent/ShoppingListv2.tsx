import React, { useState } from "react";

function ShoppingListv2() {
  const [text, setText] = useState("");
  const [list, setList] = useState<string[]>([]);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setList([...list, text]);
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
      <ul>
        {list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
}

export default ShoppingListv2;
