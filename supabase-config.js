/* ============================================================
   SUPABASE CONFIG  —  fill these in to go LIVE.
   ------------------------------------------------------------
   While the URL/key below are left as the "PASTE_..." placeholders,
   the whole site + admin console run in DEMO mode (localStorage) so
   you can try everything offline. The moment you paste real values,
   it switches to your live Supabase project automatically.

   See ADMIN_SETUP.md for the 5-minute setup walkthrough.
   ============================================================ */

window.SUPABASE_CONFIG = {
  /* From Supabase → Project Settings → API */
  url:     "PASTE_YOUR_SUPABASE_URL",          // e.g. https://abcd1234.supabase.co
  anonKey: "PASTE_YOUR_SUPABASE_ANON_KEY",     // the public "anon" key (safe to ship)

  /* The single admin account you create in Supabase → Authentication → Users.
     Members only ever type the PASSWORD on the secret page — this email is
     filled in for them behind the scenes. The password is changeable from
     inside the console (Settings tab) or the Supabase dashboard. */
  adminEmail: "admin@robotics.iitdh.ac.in",

  /* Storage bucket for uploaded images (created by setup.sql). */
  imageBucket: "site-images",

  /* DEMO MODE ONLY — the password used before Supabase is connected.
     Ignored once `url`/`anonKey` above are real. Change it if you like. */
  demoPassword: "robotics-admin",
};
