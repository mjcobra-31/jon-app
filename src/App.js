import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import "./App.css";

function App() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const saveNote = async () => {
    await addDoc(collection(db, "notes"), {
      text: note,
      createdAt: new Date(),
    });
    setSaved(true);
    setNote("");
    setTimeout(() => setSaved(false), 3000);
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="layout">

      {/* ── Left Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <p className="eyebrow">NOTES</p>
          <h1 className="brand">JON<span className="dot">.</span></h1>
          <p className="tagline">My personal<br />thought space.</p>
        </div>

        <div className="sidebar-meta">
          <div className="meta-line">
            <span className="meta-label">Date</span>
            <span className="meta-value">{dateStr}</span>
          </div>
          <div className="meta-line">
            <span className="meta-label">Status</span>
            <span className={`meta-value status ${saved ? "ok" : ""}`}>
              {saved ? "✓ Saved" : "Ready"}
            </span>
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="ornament">✦</div>
        </div>
      </aside>

      {/* ── Right Content ── */}
      <main className="content">
        <div className="content-inner">
          <div className="content-header">
            <h2 className="section-title">New Entry</h2>
            <span className="char-count">{note.length} chars</span>
          </div>

          <div className="divider" />

          <textarea
            className="note-input"
            placeholder="Begin writing..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div className="actions">
            <button
              className={`save-btn ${saved ? "saved" : ""}`}
              onClick={saveNote}
              disabled={!note.trim()}
            >
              {saved ? "✓  Note Saved" : "Save Note"}
            </button>
          </div>
        </div>
      </main>

    </div>
  );
}

export default App;