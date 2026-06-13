/* global React, Store */
/* ============================================================
   ADMIN FORMS  —  auto-generated field editors + record editor
   ============================================================ */
const { useState: aUseState, useRef: aUseRef } = React;

/* ---------- tags (array of strings) ---------- */
function TagsField({ value, onChange, hint }) {
  const [draft, setDraft] = aUseState("");
  const arr = Array.isArray(value) ? value : [];
  const add = () => { const v = draft.trim(); if (v) { onChange([...arr, v]); setDraft(""); } };
  return (
    <div>
      <div className="tags-box">
        {arr.map((t, i) => (
          <span key={i} className="tag-chip">
            {t}
            <button type="button" onClick={() => onChange(arr.filter((_, j) => j !== i))} aria-label="Remove">×</button>
          </span>
        ))}
        <input
          value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
          onBlur={add} placeholder="type + Enter"
        />
      </div>
      {hint && <div className="fhint">{hint}</div>}
    </div>
  );
}

/* ---------- pairs (array of [a, b]) ---------- */
function PairsField({ value, onChange, a, b, hint }) {
  const arr = Array.isArray(value) ? value : [];
  const set = (i, k, v) => { const next = arr.map((row) => row.slice()); next[i][k] = v; onChange(next); };
  return (
    <div>
      {arr.map((row, i) => (
        <div className="pair-row" key={i}>
          <input className="input" value={row[0] || ""} placeholder={a || "Label"} onChange={(e) => set(i, 0, e.target.value)} />
          <input className="input" value={row[1] || ""} placeholder={b || "Value"} onChange={(e) => set(i, 1, e.target.value)} />
          <button type="button" onClick={() => onChange(arr.filter((_, j) => j !== i))} aria-label="Remove row">×</button>
        </div>
      ))}
      <button type="button" className="btn-x ghost" style={{ marginTop: 4 }} onClick={() => onChange([...arr, ["", ""]])}>+ Add row</button>
      {hint && <div className="fhint">{hint}</div>}
    </div>
  );
}

/* ---------- paragraphs (array of strings via blank-line split) ---------- */
function ParasField({ value, onChange, hint }) {
  const text = Array.isArray(value) ? value.join("\n\n") : (value || "");
  return (
    <div>
      <textarea
        className="textarea" style={{ minHeight: 130 }} value={text}
        onChange={(e) => onChange(e.target.value.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean))}
      />
      {hint && <div className="fhint">{hint}</div>}
    </div>
  );
}

/* ---------- image upload ---------- */
function ImageField({ value, onChange, hint }) {
  const [busy, setBusy] = aUseState(false);
  const [err, setErr] = aUseState("");
  const ref = aUseRef(null);
  const pick = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setErr(""); setBusy(true);
    try { const url = await Store.uploadImage(file); onChange(url); }
    catch (ex) { setErr(ex.message || "Upload failed"); }
    setBusy(false);
  };
  return (
    <div>
      <div className="img-field">
        <div className="img-prev" style={value ? { backgroundImage: `url(${value})` } : null}>
          {!value && <span>NO IMAGE</span>}
        </div>
        <div className="img-ctl">
          <input ref={ref} type="file" accept="image/*" onChange={pick} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" className="btn-x" onClick={() => ref.current && ref.current.click()}>
              {value ? "Replace" : "Upload image"}
            </button>
            {value && <button type="button" className="btn-x ghost" onClick={() => onChange("")}>Remove</button>}
          </div>
          {busy && <div className="uploading"><span className="spin" /> Uploading…</div>}
          {err && <div className="fhint" style={{ color: "oklch(0.75 0.18 25)" }}>{err}</div>}
          {hint && <div className="fhint">{hint}</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------- one field, dispatched by type ---------- */
function Field({ f, value, onChange }) {
  const wide = ["textarea", "paras", "pairs", "tags", "image"].includes(f.type);
  let control;
  if (f.type === "textarea") control = <textarea className="textarea" value={value || ""} onChange={(e) => onChange(e.target.value)} />;
  else if (f.type === "number") control = <input className="input" type="number" value={value ?? ""} min={f.min} max={f.max} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} />;
  else if (f.type === "select") control = (
    <select className="select" value={value || ""} onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>Choose…</option>
      {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
  else if (f.type === "tags") control = <TagsField value={value} onChange={onChange} hint={f.hint} />;
  else if (f.type === "pairs") control = <PairsField value={value} onChange={onChange} a={f.a} b={f.b} hint={f.hint} />;
  else if (f.type === "paras") control = <ParasField value={value} onChange={onChange} hint={f.hint} />;
  else if (f.type === "image") control = <ImageField value={value} onChange={onChange} hint={f.hint} />;
  else control = <input className="input" value={value || ""} onChange={(e) => onChange(e.target.value)} />;

  const showHint = f.hint && !["tags", "pairs", "paras", "image"].includes(f.type);
  return (
    <div className={`field ${wide ? "col-full" : ""}`}>
      <label>{f.label}</label>
      {control}
      {showHint && <div className="fhint">{f.hint}</div>}
    </div>
  );
}

/* ---------- record editor (slide-over) ---------- */
function Editor({ meta, record, onClose, onSaved, toast }) {
  const [form, setForm] = aUseState(() => Object.assign({}, record));
  const [saving, setSaving] = aUseState(false);
  const isNew = !record.id;

  const set = (k, v) => setForm((f) => Object.assign({}, f, { [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      const saved = await Store.save(meta.type, form);
      toast("Saved", "ok");
      onSaved(saved);
    } catch (ex) {
      toast(ex.message || "Save failed", "err");
      setSaving(false);
    }
  };

  return (
    <div className="ov" role="dialog" aria-modal="true">
      <div className="ov-bg" onClick={onClose} />
      <div className="ov-panel">
        <div className="ov-head">
          <h3>{isNew ? "New" : "Edit"} · {meta.label.replace(/s$/, "")}</h3>
          <button className="x" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="ov-form">
          <div className="field-grid">
            {meta.fields.map((f) => (
              <div key={f.key} className={["textarea", "paras", "pairs", "tags", "image"].includes(f.type) ? "col-full" : ""}>
                <Field f={f} value={form[f.key]} onChange={(v) => set(f.key, v)} />
              </div>
            ))}
          </div>
        </div>
        <div className="ov-foot">
          <button className="btn-x ghost" onClick={onClose}>Cancel</button>
          <button className="btn-x primary" onClick={save} disabled={saving}>
            {saving ? <><span className="spin" /> Saving…</> : (isNew ? "Publish" : "Save changes")}
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TagsField, PairsField, ParasField, ImageField, Field, Editor });
