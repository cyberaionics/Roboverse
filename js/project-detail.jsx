/* global React, ReactDOM, Store, TopBar, SiteFooter, Cursor, BackBar, useReveal, useParallax, Reveal, Ph, Corners, PROJECTS */
const { useState, useEffect } = React;

function ProjectDetail() {
  useReveal(); useParallax();
  const [p, setP] = useState(null);
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("id");

    Store.ready.then(() => {
      Store.list("project").then((data) => {
        const list = data.length ? data : window.PROJECTS;
        const index = list.findIndex((x) => x.slug === slug);
        const found = index >= 0 ? list[index] : list[0];
        const idx = list.findIndex((x) => x.slug === found.slug);

        setP(found);
        setNext(list[(idx + 1) % list.length]);
        setPrev(list[(idx - 1 + list.length) % list.length]);
      }).catch(() => {
        // Fallback to static defaults
        const list = window.PROJECTS;
        const index = list.findIndex((x) => x.slug === slug);
        const found = index >= 0 ? list[index] : list[0];
        const idx = list.findIndex((x) => x.slug === found.slug);

        setP(found);
        setNext(list[(idx + 1) % list.length]);
        setPrev(list[(idx - 1 + list.length) % list.length]);
      });
    });
  }, []);

  // Return a loading state until the store resolves
  if (!p) {
    return (
      <div className="gate" style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="mono dim" style={{ color: "var(--text-3)" }}>
          <span className="spin" /> &nbsp;Loading project details…
        </div>
      </div>
    );
  }

  const accent = { "--ph-h": `oklch(0.8 0.15 ${p.hue})` };

  return (
    <>
      <Cursor />
      <TopBar current="projects" />
      <main className="page" style={accent}>
        <div className="wrap"><BackBar href="projects.html" label="All projects" /></div>

        <section className="wrap detail-hero">
          <Reveal>
            <div className="detail-meta-top">
              <span className="dt-pill accent">{p.cat}</span>
              <span className="dt-pill">{p.tag}</span>
              <span className="dt-pill">{p.year}</span>
              <span className="dt-pill">{p.status}</span>
            </div>
          </Reveal>
          <Reveal delay={60}><h1 className="detail-title">{p.title}</h1></Reveal>
          <Reveal delay={120}><p className="detail-tagline">{p.tagline}</p></Reveal>
          <Reveal delay={160}>
            <div className="hud detail-media">
              <Corners />
              {p.image ? (
                <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Ph label={`${p.title.toUpperCase()} — HERO`} />
              )}
            </div>
          </Reveal>

        </section>

        <section className="wrap">
          <div className="detail-grid">
            <div className="detail-body">
              <Reveal><div className="kicker" style={{ marginBottom: 22 }}>OVERVIEW</div></Reveal>
              {p.overview.map((para, i) => <Reveal key={i} delay={i * 60}><p>{para}</p></Reveal>)}
              <Reveal delay={120}><div className="kicker" style={{ margin: "36px 0 8px" }}>HIGHLIGHTS</div></Reveal>
              <div className="hl-list">
                {p.highlights.map((h, i) => <Reveal key={h} delay={i * 50} className="hl">{h}</Reveal>)}
              </div>
              <Reveal delay={80}><p style={{ marginTop: 30, color: "var(--text-3)", fontSize: 14, fontFamily: "var(--font-mono)", letterSpacing: ".06em" }}>BUILT BY — {p.team}</p></Reveal>
            </div>
            <Reveal delay={120}>
              <div className="spec-card">
                <h4>Specifications</h4>
                {p.specs.map(([k, v]) => (
                  <div key={k} className="spec-row"><span className="sk">{k}</span><span className="sv">{v}</span></div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal><div className="kicker" style={{ marginTop: "clamp(48px,7vw,80px)" }}>GALLERY</div></Reveal>
          <div className="gallery">
            {p.gallery.map((g, i) => (
              <Reveal key={g} delay={i * 60}><div className="hud" style={{ position: "relative" }}><Corners /><Ph label={g} /></div></Reveal>
            ))}
          </div>

          <div className="detail-nav">
            <a href={`project.html?id=${prev.slug}`}>← {prev.title}</a>
            <a href="projects.html">All projects</a>
            <a href={`project.html?id=${next.slug}`}>{next.title} →</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ProjectDetail />);
