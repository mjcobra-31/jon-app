import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, orderBy, query } from "firebase/firestore";
import "./App.css";

function App() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    setNotes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const saveNote = async () => {
    await addDoc(collection(db, "notes"), {
      text: note,
      createdAt: new Date(),
    });
    setSaved(true);
    setNote("");
    setTimeout(() => setSaved(false), 3000);
    fetchNotes(); // refresh the list after saving
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

          {/* ── Saved Notes List ── */}
          <div className="notes-list">
            <div className="divider" />
            <h2 className="section-title">Saved Notes</h2>
            {notes.length === 0 ? (
              <p className="empty-msg">No notes yet. Write something!</p>
            ) : (
              notes.map((n) => (
                <div className="note-card" key={n.id}>
                  <p className="note-text">{n.text}</p>
                  <span className="note-date">
                    {n.createdAt?.toDate?.().toLocaleString("en-US") ?? ""}
                  </span>
                </div>
              ))
            )}
          </div>

        </div>
      </main>

    </div>
  );
}

export default App;