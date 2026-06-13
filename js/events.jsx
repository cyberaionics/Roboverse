/* global React, ReactDOM, TopBar, SiteFooter, Cursor, useReveal, useParallax, Reveal, EVENTS */

function EventCard({ ev, i }) {
  return (
    <Reveal as="a" delay={i * 60} href={`event.html?id=${ev.slug}`} className={`ecard ${ev.status === "live" ? "live" : ""}`}>
      <div className="ecard-date"><span className="dl">{ev.dateLabel}</span><span className="yr">{ev.year}</span></div>
      <div className="ecard-main">
        <h3>{ev.title}</h3>
        <p>{ev.blurb}</p>
        <div className="ev-meta"><span>◷ {ev.time}</span><span>⌖ {ev.venue}</span></div>
      </div>
      <div className="ecard-right">
        <span className="ecard-type">{ev.type}</span>
        <span className="ecard-go">→</span>
      </div>
    </Reveal>
  );
}

function EventSection({ title, badge, events }) {
  if (!events.length) return null;
  return (
    <section className="ev-section">
      <Reveal className="ev-section-head">
        {badge
          ? <span className="live-badge"><span className="pulse" /> LIVE NOW</span>
          : null}
        <h2>{title}</h2>
        <span className="count">[ {String(events.length).padStart(2, "0")} ]</span>
      </Reveal>
      <div className="ev-cards">
        {events.map((ev, i) => <EventCard key={ev.slug} ev={ev} i={i} />)}
      </div>
    </section>
  );
}

function EventsPage() {
  useReveal(); useParallax();
  const live = EVENTS.filter((e) => e.status === "live");
  const upcoming = EVENTS.filter((e) => e.status === "upcoming");
  const past = EVENTS.filter((e) => e.status === "past");

  return (
    <>
      <Cursor />
      <TopBar current="events" />
      <main className="page">
        <section className="wrap page-intro">
          <Reveal><div className="kicker">04 / EVENTS</div></Reveal>
          <Reveal delay={60}><h1 className="page-title" style={{ marginTop: 16 }}>Workshops,<br />sprints & <em>arenas</em>.</h1></Reveal>
          <Reveal delay={120}><p className="page-lead">Everything the club is running — happening now, coming up, and what we've already pulled off. Open to all students.</p></Reveal>
        </section>

        <section className="wrap" style={{ paddingBottom: "clamp(80px,11vw,150px)" }}>
          <EventSection title="Live" badge events={live} />
          <EventSection title="Upcoming" events={upcoming} />
          <EventSection title="Past" events={past} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<EventsPage />);
