/* global React, ReactDOM, TopBar, SiteFooter, Cursor, BackBar, useReveal, useParallax, Reveal, Ph, Corners, EVENTS, findEvent */

function EventDetail() {
  useReveal(); useParallax();
  const params = new URLSearchParams(window.location.search);
  const ev = findEvent(params.get("id")) || EVENTS[0];
  const isLive = ev.status === "live";

  return (
    <>
      <Cursor />
      <TopBar current="events" />
      <main className="page">
        <div className="wrap"><BackBar href="events.html" label="All events" /></div>

        <section className="wrap detail-hero">
          <Reveal>
            <div className="detail-meta-top">
              {isLive && <span className="dt-pill accent" style={{ background: "var(--a2)", borderColor: "var(--a2)" }}>● LIVE NOW</span>}
              <span className="dt-pill">{ev.type}</span>
              <span className="dt-pill">{ev.dateLabel} · {ev.year}</span>
            </div>
          </Reveal>
          <Reveal delay={60}><h1 className="detail-title">{ev.title}</h1></Reveal>
          <Reveal delay={120}><p className="detail-tagline">{ev.blurb}</p></Reveal>

          <Reveal delay={150}>
            <div className="hud" style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderColor: "var(--line-soft)" }}>
              <div style={{ padding: "18px 20px", borderRight: "1px solid var(--line-soft)" }}>
                <div className="eyebrow">DATE</div><div style={{ marginTop: 6, fontFamily: "var(--font-mono)", color: "var(--a1)" }}>{ev.dateLabel} {ev.year}</div>
              </div>
              <div style={{ padding: "18px 20px", borderRight: "1px solid var(--line-soft)" }}>
                <div className="eyebrow">TIME</div><div style={{ marginTop: 6, fontFamily: "var(--font-mono)", color: "var(--a1)" }}>{ev.time}</div>
              </div>
              <div style={{ padding: "18px 20px" }}>
                <div className="eyebrow">VENUE</div><div style={{ marginTop: 6, fontFamily: "var(--font-mono)", color: "var(--text)" }}>{ev.venue}</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div className="hud detail-media" style={{ marginTop: 28 }}><Corners /><Ph label={`${ev.title.toUpperCase()}`} /></div>
          </Reveal>
        </section>

        <section className="wrap">
          <div className="detail-grid">
            <div className="detail-body">
              <Reveal><div className="kicker" style={{ marginBottom: 22 }}>ABOUT THIS EVENT</div></Reveal>
              {ev.overview.map((para, i) => <Reveal key={i} delay={i * 60}><p>{para}</p></Reveal>)}
            </div>
            <Reveal delay={120}>
              <div className="spec-card">
                <h4>Agenda</h4>
                {ev.agenda.map(([k, v]) => (
                  <div key={k} className="spec-row"><span className="sk">{k}</span><span className="sv">{v}</span></div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal><div className="kicker" style={{ marginTop: "clamp(48px,7vw,80px)" }}>GALLERY</div></Reveal>
          <div className="gallery">
            {ev.gallery.map((g, i) => (
              <Reveal key={g} delay={i * 60}><div className="hud" style={{ position: "relative" }}><Corners /><Ph label={g} /></div></Reveal>
            ))}
          </div>

          <div className="detail-nav">
            <a href="events.html">← All events</a>
            <a href="index.html#contact">Want to collaborate? →</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<EventDetail />);
