/* global React, ReactDOM, TopBar, SiteFooter, Cursor, useReveal, useParallax, Reveal, Counter, Ph, Corners, SectionHead, TEAMS, PEOPLE */

const PIPELINE = [
  { n: "01", h: "Design", p: "Mechanical & electronics teams turn a concept into CAD, schematics and a build plan." },
  { n: "02", h: "Build", p: "Parts are machined, printed and assembled; boards are populated and wired up." },
  { n: "03", h: "Program", p: "Software & AI brings it alive — firmware, perception, planning and control." },
  { n: "04", h: "Compete", p: "We test, tune and take it to the arena. Then we tear down and do it better." },
];

function Division({ t, i }) {
  return (
    <div className="tdiv" style={{ "--td-h": `oklch(0.8 0.15 ${t.hue})` }}>
      <Reveal className="tdiv-visual" data-par={i % 2 ? "0.03" : "-0.03"}>
        <span className="tdiv-num">{t.n}</span>
        <div className="hud" style={{ position: "absolute", inset: 0 }}><Corners /><Ph label={`${t.h.toUpperCase()} TEAM`} /></div>
      </Reveal>
      <div>
        <Reveal><div className="tdiv-kicker">DIVISION {t.n}</div></Reveal>
        <Reveal delay={60}><h3>{t.h}</h3></Reveal>
        <Reveal delay={100}><p>{t.p}</p></Reveal>
        <div className="tdiv-does">
          {t.does.map((d, k) => <Reveal key={d} delay={120 + k * 50} className="d">{d}</Reveal>)}
        </div>
        <Reveal delay={180}>
          <div className="tdiv-foot">
            <span className="lead-by">LED BY · <b>{t.lead}</b></span>
            <div className="tdiv-chips">{t.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* global React, ReactDOM, Store, TopBar, SiteFooter, Cursor, useReveal, useParallax, Reveal, Counter, Ph, Corners, SectionHead, TEAMS, PEOPLE */
const { useState, useEffect } = React;

// Keep PIPELINE and Division components as they are!

function TeamsPage() {
  useReveal(); useParallax();
  const [divisions, setDivisions] = useState([]);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    Store.ready.then(() => {
      // Fetch Divisions
      Store.list("team").then((tData) => {
        setDivisions(tData.length ? tData : window.TEAMS);
      }).catch(() => setDivisions(window.TEAMS));

      // Fetch Team Members
      Store.list("person").then((pData) => {
        setPeople(pData.length ? pData : window.PEOPLE);
      }).catch(() => setPeople(window.PEOPLE));
    });
  }, []);

  // Show premium loading state until data loads
  if (!divisions.length || !people.length) {
    return (
      <div className="gate" style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="mono dim" style={{ color: "var(--text-3)" }}>
          <span className="spin" /> &nbsp;Loading team details…
        </div>
      </div>
    );
  }

  const total = divisions.reduce((s, t) => s + (t.count || 0), 0);
  const stats = [
    { n: divisions.length, suf: "", l: "Divisions" },
    { n: total, suf: "+", l: "Active members" },
    { n: 12, suf: "", l: "Live projects" },
    { n: 9, suf: "", l: "Titles won" },
  ];

  return (
    <>
      <Cursor />
      <TopBar current="teams" />
      <main className="page">
        <section className="wrap page-intro">
          <Reveal><div className="kicker">05 / TEAMS</div></Reveal>
          <Reveal delay={60}><h1 className="page-title" style={{ marginTop: 16 }}>Four divisions.<br /><em>One</em> machine.</h1></Reveal>
          <Reveal delay={120}><p className="page-lead">Every robot is the product of four teams working in sync — from the first CAD sketch to the final match on the arena floor. Find where you fit.</p></Reveal>
          <div className="team-hero-grid">
            {stats.map((s, i) => (
              <Reveal key={s.l} delay={i * 70} className="tstat">
                <div className="n"><Counter to={s.n} suf={s.suf} /></div>
                <div className="l">{s.l}</div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="wrap" style={{ paddingBottom: "clamp(40px,6vw,80px)" }}>
          {divisions.map((t, i) => <Division key={t.n} t={t} i={i} />)}
        </section>

        <section className="pad" style={{ borderTop: "1px solid var(--line-soft)" }}>
          <div className="wrap">
            <SectionHead index="—" kicker="HOW WE WORK"
              title="From sketch to <em>arena</em>."
              lead="Every build moves through the same four stages — and every member learns each one." />
            <div className="pipeline">
              {PIPELINE.map((p) => (
                <Reveal key={p.n} className="pipe">
                  <div className="pn">{p.n}</div><h4>{p.h}</h4><p>{p.p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="pad" style={{ borderTop: "1px solid var(--line-soft)", paddingTop: "clamp(48px,7vw,90px)" }}>
          <div className="wrap">
            <SectionHead index="—" kicker="THE CORE TEAM"
              title="The hands behind the <em>hardware</em>." />
            <div className="leads-grid">
              {people.map((p, i) => (
                <Reveal key={p.name} delay={i * 50} className="lead-card">
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={{ width: "100%", height: "240px", objectFit: "cover", borderRadius: "12px", border: "1px solid var(--line-soft)" }} />
                  ) : (
                    <Ph label="PORTRAIT" />
                  )}
                  <div className="lc-body">
                    <h4>{p.name}</h4>
                    <div className="lc-role">{p.role}</div>
                    <div className="lc-yr">{p.yr}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TeamsPage />);