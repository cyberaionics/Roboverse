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
   url: "https://zrhqwmvvcwcaltucjabo.supabase.co",          // e.g. https://abcd1234.supabase.co
   anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyaHF3bXZ2Y3djYWx0dWNqYWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NTE1NzYsImV4cCI6MjEwODQyNzU3Nn0.1rHawY46Y9_1rzt_JRj61JPCcMwNs_Tr6mLLk-NpfOs",     // the public "anon" key (safe to ship)

   /* The single admin account you create in Supabase → Authentication → Users.
      Members only ever type the PASSWORD on the secret page — this email is
      filled in for them behind the scenes. The password is changeable from
      inside the console (Settings tab) or the Supabase dashboard. */
   adminEmail: "robotics@iitdh.ac.in",

   /* Storage bucket for uploaded images (created by setup.sql). */
   imageBucket: "site-images",

   /* DEMO MODE ONLY — the password used before Supabase is connected.
      Ignored once `url`/`anonKey` above are real. Change it if you like. RoboticsIITdH@123 */
   demoPassword: "robotics-admin",
};
