import { useState } from "react";
// useState importieren - das Werkzeug, um "Werte, die sich ändern können" zu speichern

function ShoppingList() {
  // ERSTER State: hält NUR den aktuellen Text im Eingabefeld
  // Startwert "" (leerer String), weil das Feld am Anfang leer ist
  const [text, setText] = useState("");

  // ZWEITER State: hält die KOMPLETTE Liste aller bisher hinzugefügten Einträge
  // Startwert [] (leeres Array), weil am Anfang noch nichts in der Liste ist
  const [items, setItems] = useState<string[]>([]);
  // <string[]> sagt TypeScript explizit: "das wird eine Liste von Texten"
  // (ohne das würde TS nur "any[]" annehmen - schlecht typisiert)

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // verhindert, dass der Browser die Seite neu lädt (Standard-Formular-Verhalten)

    setItems([...items, text]);
    // NEUE Liste bauen: alle bisherigen Einträge (...items) PLUS den neuen Text
    // Spread-Operator (...) kopiert die alten Einträge, text wird hinten angehängt

    setText("");
    // Eingabefeld wieder leeren, nachdem der Eintrag übernommen wurde
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          // Input zeigt IMMER den aktuellen Wert von "text" (Controlled Input)
          onChange={(e) => setText(e.target.value)}
          // bei jedem Tastendruck: text-State auf den neuen Eingabewert setzen
          placeholder="Enter text..."
        />
        <button type="submit">Hinzufügen</button>
      </form>

      <ul>
        {items.map((item) => (
          // items.map(): geht durch JEDEN Eintrag in der Liste durch
          // "item" ist bei jedem Durchlauf EIN einzelner Text aus dem Array
          <li key={item}>{item}</li>
          // key={item}: React braucht eine eindeutige Kennung pro Listenelement
          // {item}: zeigt den Text dieses einen Eintrags an
        ))}
      </ul>
    </>
  );
}

export default ShoppingList;
