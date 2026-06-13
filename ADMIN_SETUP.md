# Admin Console — Setup & Handover Guide

The club site has a private admin console for posting and editing content
(projects, events, team members, achievements, timeline, home highlights,
values) — including image uploads. It is built on **Supabase** for real
authentication and storage.

---

## The two layers of access

| Layer | What it is | Security role |
|---|---|---|
| **The secret URL** | `console-a7f3c9e2b8d14f6a93e0c5b1.html` — an unguessable filename, not linked anywhere on the site | **Convenience only.** Keeps the console out of sight. Do **not** rely on it as the lock. |
| **The password** | The admin account password, checked by Supabase | **The real lock.** Even if the URL leaks, nobody can change content without the password. |

> Hand the secret URL **and** the password to the next developer and the
> club secretary. Change the password whenever someone leaves (Settings tab
> inside the console, or the Supabase dashboard).

### Want a different secret URL?
Just rename `console-a7f3c9e2b8d14f6a93e0c5b1.html` to any long random
string you like (e.g. the hex of a SHA-256 you generate). Nothing else needs
to change — the filename *is* the secret link.

---

## Right now: DEMO mode (works offline)

Before you add Supabase keys, the console runs in **demo mode**:
- Log in with the demo password in `supabase-config.js` (default
  `robotics-admin`).
- Everything works, but data is saved **only in your browser** (localStorage)
  and images are stored inline. Nothing is shared or permanent.

Use this to try the GUI. To make it real and shared, do the 5 steps below.

---

## Going LIVE with Supabase (≈5 minutes)

**1. Create a project** at [supabase.com](https://supabase.com) (free tier is
   plenty). 

**2. Run the database script.** In the Supabase dashboard:
   `SQL Editor → New query` → paste all of **`supabase/setup.sql`** → **Run**.
   This creates the `content` table, security rules, and the `site-images`
   storage bucket.

**3. Create the admin user.** `Authentication → Users → Add user`:
   - Email: the same as `adminEmail` in `supabase-config.js`
     (default `admin@robotics.iitdh.ac.in`)
   - Password: choose a strong one — this is what members will type
   - Tick **Auto Confirm User** so it can log in immediately.

**4. Paste your keys.** In **`supabase-config.js`**, fill in:
   ```js
   url:     "https://xxxx.supabase.co",   // Settings → API → Project URL
   anonKey: "eyJhbGc...",                 // Settings → API → anon public key
   adminEmail: "admin@robotics.iitdh.ac.in",
   ```
   The `anon` key is **safe to ship publicly** — writing is blocked by the
   security rules unless you're logged in.

**5. Import existing content.** Open the console, log in, go to
   **Settings → Import current site content**. This copies everything that's
   currently hard-coded on the site into editable records. (Do this once.)

That's it — the console is now live. Edits are saved to Supabase and shared
across everyone.

---

## What admins can do

- **Projects, Events, Team Members, Divisions, Achievements, Timeline,
  Home Highlights, Values** — create, edit, reorder, delete.
- **Upload images** (hero shots, photos) straight from the editor.
- **Change the admin password** (Settings tab).

---

## Adding more admins

The simplest model is **one shared admin account** (current setup). To give
people their *own* logins instead, add each as a user in
`Authentication → Users`; they can all sign in (the console would need a small
tweak to ask for email + password instead of password only — ask the dev).

---

## ⚠️ Still to do: show this content on the public site

The console **saves** content to Supabase, but the public pages
(`index.html`, `projects.html`, …) currently still read the original
hard-coded data in `js/data.jsx`. The next step is to switch those pages to
read from the same `Store` layer so posts appear live. That wiring is the
follow-up task — ask the dev (or the assistant) to "wire the public site to
read from the store."

---

## Files map

| File | Purpose |
|---|---|
| `console-…​.html` | The secret console page (rename to change the link) |
| `supabase-config.js` | Your keys + admin email + demo password |
| `js/store.js` | Data layer (Supabase + demo), and the content schema |
| `js/admin.jsx`, `js/admin-forms.jsx` | The console UI |
| `css/admin.css` | Console styling |
| `supabase/setup.sql` | One-time database + storage setup |
