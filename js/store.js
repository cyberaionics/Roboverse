/* ============================================================
   STORE  —  unified data layer for the public site + admin console.
   ------------------------------------------------------------
   Two backends, one API:
     • SUPABASE  (live)  — once supabase-config.js has real keys
     • DEMO      (local) — localStorage, so everything works offline

   Public API (all async, all return Promises):
     Store.mode                      -> 'supabase' | 'demo'
     Store.ready                     -> Promise (resolves after init)
     Store.list(type)                -> [rows...]  (ordered, with .id)
     Store.save(type, row)           -> savedRow
     Store.remove(type, id)          -> void
     Store.move(type, id, dir)       -> void   (dir = -1 up, +1 down)
     Store.seedFromDefaults()        -> void   (one-time migration)
     Store.uploadImage(file)         -> publicUrl
     Store.auth.signIn(password)     -> {ok, error}
     Store.auth.signOut()            -> void
     Store.auth.isAuthed()           -> Promise<bool>
     Store.auth.changePassword(pw)   -> {ok, error}
   ============================================================ */
(function () {
  const CFG = window.SUPABASE_CONFIG || {};
  const hasKeys =
    CFG.url && CFG.anonKey &&
    !String(CFG.url).startsWith("PASTE_") &&
    !String(CFG.anonKey).startsWith("PASTE_");

  const MODE = hasKeys ? "supabase" : "demo";

  /* ---------------------------------------------------------
     CONTENT SCHEMA  — drives the auto-generated forms.
     Field types: text, textarea, number, select, tags, pairs,
                  paras (blank-line-separated paragraphs), image.
     `source` names the window global in data.jsx used to seed.
     --------------------------------------------------------- */
  const F = (key, label, type, extra) => Object.assign({ key, label, type }, extra || {});

  const TYPES = [
    {
      type: "project", label: "Projects", icon: "◆", source: "PROJECTS", titleKey: "title",
      fields: [
        F("title", "Title", "text"),
        F("slug", "Slug (URL id)", "text", { hint: "lowercase-with-dashes, used in project.html?id=" }),
        F("cat", "Category", "select", { options: ["Autonomous", "Aerial", "Manipulation", "Bio-inspired"] }),
        F("tag", "Tag", "text", { hint: "short badge, e.g. Rover" }),
        F("tagline", "Tagline", "textarea"),
        F("year", "Year", "text"),
        F("status", "Status", "text", { hint: "e.g. In Field, Active, Champion" }),
        F("team", "Team(s)", "text", { hint: "e.g. Software & AI · Mechanical" }),
        F("hue", "Accent hue", "number", { hint: "0–360 colour wheel", min: 0, max: 360 }),
        F("image", "Hero image", "image"),
        F("overview", "Overview", "paras", { hint: "one paragraph per block — leave a blank line between" }),
        F("specs", "Specs", "pairs", { a: "Label", b: "Value" }),
        F("highlights", "Highlights", "tags"),
        F("gallery", "Gallery labels", "tags", { hint: "captions for image slots" }),
      ],
    },
    {
      type: "event", label: "Events", icon: "▣", source: "EVENTS", titleKey: "title",
      fields: [
        F("title", "Title", "text"),
        F("slug", "Slug (URL id)", "text"),
        F("status", "Status", "select", { options: ["live", "upcoming", "past"] }),
        F("dateLabel", "Date label", "text", { hint: "e.g. MAR 14–17" }),
        F("year", "Year", "text"),
        F("time", "Time", "text"),
        F("venue", "Venue", "text"),
        F("type", "Type", "text", { hint: "e.g. Workshop, Competition" }),
        F("blurb", "Blurb", "textarea"),
        F("image", "Hero image", "image"),
        F("overview", "Overview", "paras"),
        F("agenda", "Agenda", "pairs", { a: "Phase", b: "What happens" }),
        F("gallery", "Gallery labels", "tags"),
      ],
    },
    {
      type: "person", label: "Team Members", icon: "○", source: "PEOPLE", titleKey: "name",
      fields: [
        F("name", "Name", "text"),
        F("role", "Role", "text"),
        F("team", "Division", "select", { options: ["Core", "Mechanical", "Electronics", "Software & AI", "Operations"] }),
        F("yr", "Year · Branch", "text", { hint: "e.g. Final Year · ME" }),
        F("image", "Photo", "image"),
      ],
    },
    {
      type: "team", label: "Divisions", icon: "◐", source: "TEAMS", titleKey: "h",
      fields: [
        F("n", "Number", "text", { hint: "e.g. 01" }),
        F("h", "Name", "text"),
        F("p", "Description", "textarea"),
        F("chips", "Skill chips", "tags"),
        F("hue", "Accent hue", "number", { min: 0, max: 360 }),
        F("lead", "Lead", "text"),
        F("count", "Member count", "number"),
        F("does", "What they do", "tags", { hint: "one responsibility per item" }),
      ],
    },
    {
      type: "achievement", label: "Achievements", icon: "★", source: "ACH", titleKey: "cap",
      fields: [
        F("big", "Big number", "text"),
        F("suf", "Suffix", "text", { hint: "e.g. +, rd, k+" }),
        F("cap", "Caption", "textarea"),
      ],
    },
    {
      type: "timeline", label: "Timeline", icon: "│", source: "TIMELINE", titleKey: "h",
      fields: [
        F("yr", "Year", "text"),
        F("h", "Heading", "text"),
        F("p", "Description", "textarea"),
      ],
    },
    {
      type: "innovation", label: "Home Highlights", icon: "✦", source: "INNOVATIONS", titleKey: "title",
      fields: [
        F("kicker", "Kicker", "text", { hint: "e.g. LATEST BUILD" }),
        F("title", "Title", "text"),
        F("text", "Text", "textarea"),
        F("ph", "Placeholder label", "text"),
        F("image", "Image", "image"),
        F("href", "Links to", "text", { hint: "e.g. project.html?id=..." }),
        F("hue", "Accent hue", "number", { min: 0, max: 360 }),
      ],
    },
    {
      type: "value", label: "Values", icon: "❖", source: "VALUES", titleKey: "h",
      fields: [
        F("ix", "Index", "text", { hint: "e.g. 01" }),
        F("h", "Heading", "text"),
        F("p", "Description", "textarea"),
      ],
    },
  ];

  const typeMeta = (t) => TYPES.find((x) => x.type === t);

  /* ---------- defaults (from data.jsx globals) for seeding ---------- */
  function defaultsFor(type) {
    const meta = typeMeta(type);
    const src = meta && window[meta.source];
    return Array.isArray(src) ? src.map((o) => Object.assign({}, o)) : [];
  }

  /* ============================================================
     DEMO BACKEND  (localStorage)
     ============================================================ */
  const LS_KEY = "rc_content_v1";
  const demo = {
    _all: null,
    _load() {
      if (this._all) return this._all;
      let saved = null;
      try { saved = JSON.parse(localStorage.getItem(LS_KEY) || "null"); } catch (e) {}
      this._all = saved || {};
      return this._all;
    },
    _commit() { try { localStorage.setItem(LS_KEY, JSON.stringify(this._all)); } catch (e) {} },
    list(type) {
      const all = this._load();
      if (all[type]) return all[type].map((r) => Object.assign({}, r));
      // not overridden yet → fall back to site defaults, stamped with ids
      return defaultsFor(type).map((r, i) => Object.assign({ id: `def-${type}-${i}` }, r));
    },
    _ensure(type) {
      const all = this._load();
      if (!all[type]) all[type] = this.list(type); // materialise defaults so edits persist
      return all[type];
    },
    save(type, row) {
      const arr = this._ensure(type);
      if (row.id) {
        const i = arr.findIndex((r) => r.id === row.id);
        if (i >= 0) arr[i] = Object.assign({}, row);
        else arr.push(row);
      } else {
        row = Object.assign({ id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }, row);
        arr.push(row);
      }
      this._commit();
      return row;
    },
    remove(type, id) {
      const all = this._load();
      const arr = this._ensure(type);
      all[type] = arr.filter((r) => r.id !== id);
      this._commit();
    },
    move(type, id, dir) {
      const arr = this._ensure(type);
      const i = arr.findIndex((r) => r.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= arr.length) return;
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
      this._commit();
    },
    seedFromDefaults() {
      const all = this._load();
      TYPES.forEach((m) => { all[m.type] = this.list(m.type); });
      this._commit();
    },
    async uploadImage(file) {
      return await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result);     // data URL persisted inline (demo only)
        r.onerror = rej;
        r.readAsDataURL(file);
      });
    },
    auth: {
      _pw() { return localStorage.getItem("rc_demo_pw") || CFG.demoPassword || "robotics-admin"; },
      async signIn(pw) {
        if (pw === this._pw()) { sessionStorage.setItem("rc_demo_session", "1"); return { ok: true }; }
        return { ok: false, error: "Incorrect password." };
      },
      async signOut() { sessionStorage.removeItem("rc_demo_session"); },
      async isAuthed() { return sessionStorage.getItem("rc_demo_session") === "1"; },
      async changePassword(pw) {
        if (!pw || pw.length < 6) return { ok: false, error: "Use at least 6 characters." };
        localStorage.setItem("rc_demo_pw", pw); return { ok: true };
      },
    },
  };

  /* ============================================================
     SUPABASE BACKEND
     ============================================================ */
  let sb = null;
  const supa = {
    _client() {
      if (!sb) sb = window.supabase.createClient(CFG.url, CFG.anonKey);
      return sb;
    },
    async list(type) {
      const { data, error } = await this._client()
        .from("content").select("*").eq("type", type).order("position", { ascending: true });
      if (error) { console.error(error); return []; }
      return (data || []).map((r) => Object.assign({ id: r.id, _pos: r.position, image: r.image_url }, r.data));
    },
    async save(type, row) {
      const c = this._client();
      const { id, _pos, image, ...rest } = row;
      const payload = { type, data: rest, image_url: image || null };
      if (id && !String(id).startsWith("def-") && !String(id).startsWith("c-")) {
        const { data, error } = await c.from("content").update(payload).eq("id", id).select().single();
        if (error) throw error;
        return Object.assign({ id: data.id, _pos: data.position, image: data.image_url }, data.data);
      }
      // new: append at end
      const { count } = await c.from("content").select("*", { count: "exact", head: true }).eq("type", type);
      payload.position = count || 0;
      const { data, error } = await c.from("content").insert(payload).select().single();
      if (error) throw error;
      return Object.assign({ id: data.id, _pos: data.position, image: data.image_url }, data.data);
    },
    async remove(type, id) {
      const { error } = await this._client().from("content").delete().eq("id", id);
      if (error) throw error;
    },
    async move(type, id, dir) {
      const rows = await this.list(type);
      const i = rows.findIndex((r) => r.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= rows.length) return;
      const c = this._client();
      await c.from("content").update({ position: j }).eq("id", rows[i].id);
      await c.from("content").update({ position: i }).eq("id", rows[j].id);
    },
    async seedFromDefaults() {
      const c = this._client();
      for (const m of TYPES) {
        const { count } = await c.from("content").select("*", { count: "exact", head: true }).eq("type", m.type);
        if (count && count > 0) continue; // don't double-seed
        const rows = defaultsFor(m.type).map((d, i) => {
          const { image, ...rest } = d;
          return { type: m.type, position: i, data: rest, image_url: image || null };
        });
        if (rows.length) { const { error } = await c.from("content").insert(rows); if (error) throw error; }
      }
    },
    async uploadImage(file) {
      const c = this._client();
      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await c.storage.from(CFG.imageBucket).upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data } = c.storage.from(CFG.imageBucket).getPublicUrl(path);
      return data.publicUrl;
    },
    auth: {
      async signIn(pw) {
        const { error } = await supa._client().auth.signInWithPassword({ email: CFG.adminEmail, password: pw });
        return error ? { ok: false, error: error.message } : { ok: true };
      },
      async signOut() { await supa._client().auth.signOut(); },
      async isAuthed() {
        const { data } = await supa._client().auth.getSession();
        return !!(data && data.session);
      },
      async changePassword(pw) {
        const { error } = await supa._client().auth.updateUser({ password: pw });
        return error ? { ok: false, error: error.message } : { ok: true };
      },
    },
  };

  /* ============================================================
     PUBLIC FACADE
     ============================================================ */
  const backend = MODE === "supabase" ? supa : demo;

  const Store = {
    mode: MODE,
    TYPES,
    typeMeta,
    defaultsFor,
    ready: Promise.resolve(),
    list: (t) => backend.list(t),
    save: (t, r) => backend.save(t, r),
    remove: (t, id) => backend.remove(t, id),
    move: (t, id, d) => backend.move(t, id, d),
    seedFromDefaults: () => backend.seedFromDefaults(),
    uploadImage: (f) => backend.uploadImage(f),
    auth: backend.auth,
  };

  window.Store = Store;
})();
