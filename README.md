# Task Manager

Fullstack-Anwendung zur Aufgabenverwaltung mit Benutzerkonten. Jeder Nutzer registriert sich, meldet sich an und verwaltet ausschließlich seine eigenen Tasks und Kategorien — die Zugriffsprüfung erfolgt serverseitig bei jedem Request.

**Live:** https://task-manager-alex.netlify.app

> Hinweis: Das Backend läuft auf einem kostenlosen Render-Tarif und schläft nach 15 Minuten Inaktivität ein. Der erste Aufruf kann daher 30–60 Sekunden dauern.

<img width="1628" height="924" alt="image" src="https://github.com/user-attachments/assets/63f83d3a-19b3-403e-996b-02d09ba915ea" />

---

## Funktionen

- **Registrierung und Login** mit gehashten Passwörtern (bcrypt) und JWT
- **Tasks** anlegen, bearbeiten, abhaken, löschen
- **Prioritäten** (niedrig / mittel / hoch) und Fälligkeitsdatum
- **Kategorien** anlegen, zuweisen und löschen
- **Suche und Filter** nach Status
- **Mehrbenutzerfähig** — jeder sieht ausschließlich seine eigenen Daten
- **Responsive**, mobile-first umgesetzt

---

## Tech Stack

**Frontend**
React 19 · TypeScript · Vite · Tailwind CSS v4

**Backend**
Node.js · Express 5 · TypeScript · Prisma ORM · PostgreSQL (Neon)

**Auth und Validierung**
JSON Web Tokens · bcrypt · Zod · express-rate-limit

**Deployment**
Netlify (Frontend) · Render (Backend) · Neon (Datenbank)

---

## Architektur und Entscheidungen

### JWT statt Session-Cookies

Frontend und Backend sind getrennt deployed. Bei serverseitigen Sessions müsste der Server sich merken, wer eingeloggt ist — also einen Session-Store vorhalten (Datenbank oder Redis) und diesen über beide Umgebungen hinweg erreichbar machen.

Ein JWT ist zustandslos: Es trägt die User-ID selbst und ist signiert. Der Server prüft die Signatur und weiß Bescheid, ohne etwas zu speichern. Das passt zur getrennten Architektur und spart eine Komponente.

### Prisma statt SQL

Prisma generiert TypeScript-Typen aus dem Datenbankschema. Ein Tippfehler in einem Spaltennamen fällt dadurch beim Schreiben auf, nicht erst zur Laufzeit. Bei rohem SQL wäre jede Query ein String ohne Prüfung.

Dazu kommen versionierte Migrationen — der Schemastand ist nachvollziehbar und reproduzierbar, statt manuell gepflegt.

### Zod trotz TypeScript

TypeScript prüft beim Kompilieren. Im fertigen JavaScript sind alle Typen entfernt — `req.body` ist zur Laufzeit ein beliebiges Objekt und könnte alles enthalten.

Zod prüft zur Laufzeit gegen ein Schema und liefert danach typisierte Daten. Kurz: **TypeScript schützt vor eigenen Fehlern, Zod vor fremden Daten.**

### Validierung im Backend, nicht nur im Frontend

Das Frontend ist optional. Jeder kann die API direkt mit curl oder Postman ansprechen und alle Formularprüfungen umgehen. Deshalb wird jeder Request serverseitig geprüft — Frontend-Validierung ist reiner Bedienkomfort.

### Einheitlicher Routen-Aufbau

Alle zwölf Routen folgen derselben Reihenfolge:

1. Authentifizierung prüfen → `401`
2. Eingabe validieren (Zod, ID) → `400`
3. Datensatz laden und Besitzverhältnis prüfen → `404`
4. Aktion ausführen
5. Antwort mit passendem Statuscode

Die günstigen Prüfungen stehen bewusst vor den Datenbankzugriffen. Alles ab dem ersten `await` liegt in einem `try/catch`; Fehlerdetails werden geloggt, nach außen geht eine generische Meldung.

### 404 statt 403 bei fremden Daten

Ein `403` würde bestätigen, dass eine ID existiert — nur eben nicht dem Anfragenden gehört. Damit ließen sich IDs durchprobieren. Ein `404` gibt diese Information nicht preis. Aus demselben Grund liefert der Login bei falscher E-Mail und falschem Passwort dieselbe Meldung.

### Rate Limiting

Global 100 Anfragen pro 15 Minuten je IP, für `/login` und `/register` nur 10. Ohne diese Begrenzung ließen sich Passwörter automatisiert durchprobieren oder die Datenbank mit Registrierungen fluten.

---

## Lokal starten

**Voraussetzungen:** Node.js 20+, eine PostgreSQL-Datenbank (z. B. kostenlos bei [Neon](https://neon.tech))

```bash
git clone https://github.com/Alexander-Bartmann/task-manager-project.git
cd task-manager-project
```

**Backend**

```bash
cd server
npm install
```

`.env` anlegen:

```
DATABASE_URL="postgresql://..."
JWT_SECRET="ein-langes-zufaelliges-secret"
FRONTEND_URL="http://localhost:5173"
```

```bash
npx prisma migrate dev
npm run dev
```

**Frontend**

```bash
cd client
npm install
```

`.env` anlegen:

```
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
```

Erreichbar unter `http://localhost:5173`.

---

## API

Alle Task- und Kategorie-Endpunkte erfordern einen gültigen Token im Header:
`Authorization: Bearer <token>`

| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/register` | Registrierung |
| `POST` | `/login` | Login, gibt Token zurück |
| `GET` | `/tasks` | Eigene Tasks abrufen |
| `POST` | `/tasks` | Task anlegen |
| `PATCH` | `/tasks/:id` | Erledigt-Status umschalten |
| `PUT` | `/tasks/:id` | Task aktualisieren |
| `DELETE` | `/tasks/:id` | Task löschen |
| `GET` | `/categories` | Eigene Kategorien abrufen |
| `POST` | `/categories` | Kategorie anlegen |
| `PUT` | `/categories/:id` | Kategorie aktualisieren |
| `DELETE` | `/categories/:id` | Kategorie löschen |

---

## Nächste Schritte

Bewusst offen gelassen, in dieser Reihenfolge geplant:

- **Tests** — Vitest und React Testing Library für Komponenten, Playwright für den Auth-Flow
- **Routen aufteilen** — die Backend-Routen liegen aktuell in einer Datei und gehören nach Ressource getrennt
- **ESLint, Prettier, Husky** — einheitliche Formatierung, Prüfung vor dem Commit
- **GitHub Actions** — Lint und Tests automatisch bei jedem Push
- **Statistik-Ansicht** — erledigte Tasks pro Woche, Verteilung nach Priorität

---

## Zum Projekt

Eigenständig umgesetzt als Lernprojekt im Rahmen meines Quereinstiegs in die Webentwicklung. Ziel war eine vollständige Fullstack-Anwendung von der Datenmodellierung über Authentifizierung bis zum Deployment.

**Alexander Bartmann**
[alexander-bartmann.de](https://alexander-bartmann.de) · alexander-bartmann@outlook.de<img width="1628" height="924" alt="Bild_2026-08-13_211311260" src="https://github.com/user-attachments/assets/0df05edc-0c0a-461e-93fb-3e940f0b9c95" />

