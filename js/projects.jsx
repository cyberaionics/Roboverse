/* global React, ReactDOM, TopBar, SiteFooter, Cursor, useReveal, useParallax, Reveal, Ph, SectionHead, PROJECTS, PROJ_CATS */
const { useState, useMemo } = React;

function ProjectCard({ p, i, featured }) {
  return (
    <Reveal as="a" delay={(i % 3) * 70} href={`project.html?id=${p.slug}`}
      className={`pcard ${featured ? "pwide" : ""}`} style={{ "--ph-h": `oklch(0.8 0.15 ${p.hue})` }}>
      <div className="pcard-media">
        <Ph label={p.title.toUpperCase()} />
        <span className="pcard-num">{String(i + 1).padStart(2, "0")}</span>
        <span className="pcard-stat"><i className="d" />{p.status}</span>
      </div>
      <div className="pcard-body">
        <div className="pcard-tags"><span className="t">{p.cat}</span><span className="t">{p.tag}</span></div>
        <h3>{p.title}</h3>
        <p>{featured ? p.overview[0] : p.tagline}</p>
        <div className="pcard-foot">
          <span className="pcard-view">View project <span className="arr">→</span></span>
          <span className="pcard-yr">{p.year}</span>
        </div>
      </div>
    </Reveal>
  );
}

function ProjectsPage() {
  useReveal(); useParallax();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const list = useMemo(() => PROJECTS.filter((p) => {
    const okCat = cat === "All" || p.cat === cat;
    const okQ = !q || (p.title + p.tagline + p.cat + p.tag).toLowerCase().includes(q.toLowerCase());
    return okCat && okQ;
  }), [cat, q]);

  return (
    <>
      <Cursor />
      <TopBar current="projects" />
      <main className="page">
        <section className="wrap page-intro">
          <Reveal><div className="kicker">03 / PROJECTS</div></Reveal>
          <Reveal delay={60}><h1 className="page-title" style={{ marginTop: 16 }}>The machines<br />from the <em>build floor</em>.</h1></Reveal>
          <Reveal delay={120}><p className="page-lead">Every robot our teams have engineered across recent build seasons — explore the systems, the specs and the stories behind them.</p></Reveal>
        </section>

        <section className="wrap" style={{ paddingBottom: "clamp(80px,11vw,150px)" }}>
          <Reveal>
            <div className="proj-toolbar">
              <div className="filters">
                {PROJ_CATS.map((c) => (
                  <button key={c} className={`filter ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>
                ))}
              </div>
              <div className="proj-search">
                <span className="si">⌕</span>
                <input placeholder="SEARCH PROJECTS" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
            </div>
          </Reveal>

          {list.length === 0
            ? <div className="empty">NO PROJECTS MATCH YOUR FILTER</div>
            : <div className="pgrid">
                {list.map((p, i) => <ProjectCard key={p.slug} p={p} i={i} featured={cat === "All" && !q && i === 0} />)}
              </div>}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ProjectsPage />);
