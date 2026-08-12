import { useState } from "react";

function FruitList() {
  const [fruit] = useState(["Apfel", "Banane", "Kiwi"]);
  return (
    <div>
      <ul>
        {fruit.map((fruits) => (
          <li key={fruits}>{fruits}</li>
        ))}
      </ul>
    </div>
  );
}

export default FruitList;
