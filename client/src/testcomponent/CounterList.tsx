import { useState } from "react";

type List = { id: string; label: string; count: number };

function CounterList() {
  const [list, setList] = useState<List[]>([
    { id: crypto.randomUUID(), label: "bestellung", count: 2 },
    { id: crypto.randomUUID(), label: "reservierung", count: 4 },
    { id: crypto.randomUUID(), label: "tisch", count: 1 },
  ]);

  const toggleList = (id: string) => {
    setList((prev) =>
      prev.map((list) =>
        list.id === id ? { ...list, count: list.count + 1 } : list,
      ),
    );
  };
  return (
    <>
      {list.map((item) => (
        <li key={item.id}>
          {item.label} {item.count}
          <button onClick={() => toggleList(item.id)}>+1</button>
        </li>
      ))}
    </>
  );
}

export default CounterList;
