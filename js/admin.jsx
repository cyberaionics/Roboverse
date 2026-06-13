/* global React, ReactDOM, Store, Editor */
/* ============================================================
   ADMIN CONSOLE  —  app shell, auth gate, dashboard
   ============================================================ */
const { useState, useEffect, useCallback } = React;

/* ---------- tiny toast hook ---------- */
function useToast() {
  const [t, setT] = useState(null);
  const show = useCallback((msg, kind = "ok") => {
    setT({ msg, kind, id: Date.now() });
    setTimeout(() => setT((cur) => (cur && cur.msg === msg ? null : cur)), 2600);
  }, []);
  const node = t ? <div className={`toast ${t.kind}`} key={t.id}>{t.msg}</div> : null;
  return [node, show];
}

function ModeTag() {
  const live = Store.mode === "supabase";
  return (
    <span className={`mode-tag ${live ? "live" : "demo"}`}>
      <span className="pulse" />
      {live ? <>Live · <b>Supabase</b></> : <>Demo · <b>local only</b></>}
    </span>
  );
}

/* ============================================================
   LOGIN GATE
   ============================================================ */
function Gate({ onIn }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!pw) return;
    setBusy(true); setErr("");
    const res = await Store.auth.signIn(pw);
    setBusy(false);
    if (res.ok) onIn();
    else setErr(res.error || "Access denied.");
  };

  return (
    <div className="gate">
      <form className="gate-card" onSubmit={submit}>
        <div className="gate-brand">
          <span className="gate-dot"><i /></span>
          <span>
            <b>ROBOTICS CLUB</b>
            <span>ADMIN CONSOLE · IIT DHARWAD</span>
          </span>
        </div>
        <h1>Restricted access</h1>
        <p className="sub">Enter the admin password to manage site content. This page is unlisted — keep the link private.</p>

        {err && <div className="alert err">{err}</div>}

        <div className="field">
          <label>Admin password</label>
          <input
            className="input" type="password" value={pw} autoFocus
            onChange={(e) => setPw(e.target.value)} placeholder="••••••••••"
          />
        </div>

        <button className="btn-x primary full" type="submit" disabled={busy}>
          {busy ? <><span className="spin" /> Verifying…</> : "Unlock console →"}
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22 }}>
          <ModeTag />
          <a className="view-site mono" href="index.html" style={{ fontSize: 12, color: "var(--text-3)", textDecoration: "none" }}>← back to site</a>
        </div>
      </form>
    </div>
  );
}

/* ============================================================
   LIST VIEW  (one content type)
   ============================================================ */
function thumbFor(meta, rec) {
  if (rec.image) return { style: { backgroundImage: `url(${rec.image})` }, label: null };
  return { style: null, label: meta.icon };
}
function titleFor(meta, rec) {
  return rec[meta.titleKey] || rec.title || rec.name || rec.h || rec.cap || "Untitled";
}
function subFor(meta, rec) {
  if (meta.type === "project") return `${rec.cat || "—"} · ${rec.status || ""}`;
  if (meta.type === "event") return `${(rec.status || "").toUpperCase()} · ${rec.dateLabel || ""} ${rec.year || ""}`;
  if (meta.type === "person") return `${rec.role || ""} · ${rec.team || ""}`;
  if (meta.type === "team") return `Lead ${rec.lead || "—"} · ${rec.count || 0} members`;
  if (meta.type === "achievement") return `${rec.big || ""}${rec.suf || ""}`;
  if (meta.type === "timeline") return rec.yr || "";
  if (meta.type === "innovation") return rec.kicker || "";
  if (meta.type === "value") return rec.ix || "";
  return "";
}

function ListView({ meta, toast }) {
  const [rows, setRows] = useState(null);
  const [editing, setEditing] = useState(null); // record being edited, or {} for new

  const load = useCallback(async () => {
    setRows(null);
    try { setRows(await Store.list(meta.type)); }
    catch (ex) { toast(ex.message || "Load failed", "err"); setRows([]); }
  }, [meta.type, toast]);

  useEffect(() => { load(); }, [load]);

  const del = async (rec) => {
    if (!window.confirm(`Delete "${titleFor(meta, rec)}"? This cannot be undone.`)) return;
    try { await Store.remove(meta.type, rec.id); toast("Deleted", "ok"); load(); }
    catch (ex) { toast(ex.message || "Delete failed", "err"); }
  };
  const move = async (rec, dir) => {
    try { await Store.move(meta.type, rec.id, dir); load(); }
    catch (ex) { toast(ex.message || "Reorder failed", "err"); }
  };

  return (
    <div>
      <div className="cmain-head">
        <div>
          <div className="kick">{meta.icon} {String(rows ? rows.length : "") } {meta.label}</div>
          <h2>{meta.label}</h2>
          <p>Add, edit, reorder and remove. Changes publish to the live site instantly{Store.mode === "demo" ? " (demo: saved to this browser only)" : ""}.</p>
        </div>
        <button className="btn-x primary" onClick={() => setEditing({})}>+ New {meta.label.replace(/s$/, "")}</button>
      </div>

      {rows === null && <div className="empty"><span className="spin" /> Loading…</div>}
      {rows && rows.length === 0 && <div className="empty">No {meta.label.toLowerCase()} yet. Click “New” to add the first one.</div>}

      {rows && rows.length > 0 && (
        <div className="rec-list">
          {rows.map((rec, i) => {
            const th = thumbFor(meta, rec);
            return (
              <div className="rec" key={rec.id}>
                <div className="ord">
                  <button onClick={() => move(rec, -1)} disabled={i === 0} aria-label="Move up">▲</button>
                  <button onClick={() => move(rec, +1)} disabled={i === rows.length - 1} aria-label="Move down">▼</button>
                </div>
                <div className="thumb" style={th.style}>{th.label && <span>{th.label}</span>}</div>
                <div className="meta">
                  <b>{titleFor(meta, rec)}</b>
                  <small>{subFor(meta, rec)}</small>
                </div>
                <div className="acts">
                  <button onClick={() => setEditing(rec)}>EDIT</button>
                  <button className="del" onClick={() => del(rec)}>DELETE</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <Editor
          meta={meta} record={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
          toast={toast}
        />
      )}
    </div>
  );
}

/* ============================================================
   SETTINGS
   ============================================================ */
function Settings({ toast }) {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const change = async (e) => {
    e.preventDefault();
    if (pw !== pw2) { toast("Passwords don't match", "err"); return; }
    setBusy(true);
    const res = await Store.auth.changePassword(pw);
    setBusy(false);
    if (res.ok) { toast("Password updated", "ok"); setPw(""); setPw2(""); }
    else toast(res.error || "Could not change password", "err");
  };

  const seed = async () => {
    if (!window.confirm("Import the current site content as editable records? Existing records of each type are kept (only empty types are seeded).")) return;
    setSeeding(true);
    try { await Store.seedFromDefaults(); toast("Imported site defaults", "ok"); }
    catch (ex) { toast(ex.message || "Import failed", "err"); }
    setSeeding(false);
  };

  return (
    <div>
      <div className="cmain-head">
        <div>
          <div className="kick">⚙ Console settings</div>
          <h2>Settings</h2>
        </div>
      </div>

      <div className="set-card">
        <h4>Change admin password</h4>
        <p>{Store.mode === "supabase"
          ? "Updates the password for the shared admin account in Supabase. Everyone who logs in uses this password."
          : "Demo mode: stored in this browser only. Once Supabase is connected this updates the real account password."}</p>
        <form onSubmit={change}>
          <div className="field"><label>New password</label>
            <input className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="at least 6 characters" />
          </div>
          <div className="field"><label>Confirm password</label>
            <input className="input" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
          </div>
          <button className="btn-x primary" type="submit" disabled={busy || !pw}>{busy ? <><span className="spin" /> Saving…</> : "Update password"}</button>
        </form>
      </div>

      <div className="set-card">
        <h4>Import site content</h4>
        <p>Pull the current hard-coded site content into the console as editable records. Run this once after connecting Supabase so you can edit what's already there.</p>
        <button className="btn-x" onClick={seed} disabled={seeding}>{seeding ? <><span className="spin" /> Importing…</> : "Import current site content"}</button>
      </div>

      <div className="set-card">
        <h4>Connection</h4>
        <p>Where this console is reading and writing data.</p>
        <div className="kv"><span>MODE</span><b>{Store.mode === "supabase" ? "Live — Supabase" : "Demo — localStorage"}</b></div>
        <div className="kv"><span>ADMIN EMAIL</span><b>{(window.SUPABASE_CONFIG || {}).adminEmail || "—"}</b></div>
        <div className="kv"><span>IMAGE BUCKET</span><b>{(window.SUPABASE_CONFIG || {}).imageBucket || "—"}</b></div>
        {Store.mode === "demo" && <div className="alert info" style={{ marginTop: 16 }}>Add your Supabase keys in <b>supabase-config.js</b> to go live. See ADMIN_SETUP.md.</div>}
      </div>
    </div>
  );
}

/* ============================================================
   CONSOLE SHELL
   ============================================================ */
function Console({ onOut }) {
  const [tab, setTab] = useState(Store.TYPES[0].type);
  const [toastNode, toast] = useToast();
  const activeMeta = Store.TYPES.find((t) => t.type === tab);

  const logout = async () => { await Store.auth.signOut(); onOut(); };

  return (
    <div className="console">
      <div className="cbar">
        <span className="brand-min"><i /><b>Console</b></span>
        <ModeTag />
        <span className="spacer" />
        <a className="view-site" href="index.html" target="_blank" rel="noopener">View site ↗</a>
        <button className="btn-x ghost" onClick={logout}>Log out</button>
      </div>

      <div className="cbody">
        <nav className="crail">
          <div className="crail-h">Content</div>
          {Store.TYPES.map((t) => (
            <button key={t.type} className={`nav-item ${tab === t.type ? "active" : ""}`} onClick={() => setTab(t.type)}>
              <span className="ic">{t.icon}</span>{t.label}
            </button>
          ))}
          <div className="crail-h" style={{ marginTop: 18 }}>System</div>
          <button className={`nav-item ${tab === "__settings" ? "active" : ""}`} onClick={() => setTab("__settings")}>
            <span className="ic">⚙</span>Settings
          </button>
        </nav>

        <main className="cmain">
          {tab === "__settings"
            ? <Settings toast={toast} />
            : <ListView key={tab} meta={activeMeta} toast={toast} />}
        </main>
      </div>
      {toastNode}
    </div>
  );
}

/* ============================================================
   ROOT
   ============================================================ */
function App() {
  const [authed, setAuthed] = useState(null); // null = checking

  useEffect(() => {
    let alive = true;
    Store.auth.isAuthed().then((ok) => { if (alive) setAuthed(ok); });
    return () => { alive = false; };
  }, []);

  if (authed === null) {
    return <div className="gate"><div className="mono dim"><span className="spin" /> &nbsp;Loading console…</div></div>;
  }
  return authed
    ? <Console onOut={() => setAuthed(false)} />
    : <Gate onIn={() => setAuthed(true)} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
