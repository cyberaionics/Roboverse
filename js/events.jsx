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

/* global React, ReactDOM, Store, TopBar, SiteFooter, Cursor, useReveal, useParallax, Reveal, EVENTS */
const { useState, useEffect } = React;

// Keep EventCard and EventSection components as they are!

function EventsPage() {
  useReveal(); useParallax();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    Store.ready.then(() => {
      Store.list("event").then((data) => {
        setEvents(data.length ? data : window.EVENTS);
      }).catch(() => {
        setEvents(window.EVENTS);
      });
    });
  }, []);

  const live = events.filter((e) => e.status === "live");
  const upcoming = events.filter((e) => e.status === "upcoming");
  const past = events.filter((e) => e.status === "past");

  return (
    <>
      <Cursor />
      <TopBar current="events" />
      <main className="page">
        <section className="wrap page-intro">
          <Reveal><div className="kicker">04 / EVENTS</div></Reveal>
          <Reveal delay={60}><h1 className="page-title" style={{ marginTop: 16 }}>What's happening<br />in the <em>arena</em>.</h1></Reveal>
          <Reveal delay={120}><p className="page-lead">Stay up to date with our upcoming bootcamps, workshops, local challenges, and our flagship inter-college RoboWeek festivals.</p></Reveal>
        </section>

        <section className="wrap" style={{ paddingBottom: "clamp(80px,11vw,150px)" }}>
          <EventSection title="Live Now" badge events={live} />
          <EventSection title="Upcoming Schedule" events={upcoming} />
          <EventSection title="Past Events" events={past} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<EventsPage />);
