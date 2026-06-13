/* global React, ReactDOM, TopBar, SiteFooter, Cursor, useReveal, useParallax, Reveal, Counter, Ph, Corners, SectionHead, VALUES, TIMELINE, ACH */

const DOES = [
  { ix: "A1", h: "Build", p: "Hardware, firmware and software for autonomous and remotely-operated machines." },
  { ix: "A2", h: "Compete", p: "We represent IIT Dharwad at national & international robotics arenas." },
  { ix: "A3", h: "Teach", p: "Free, open workshops on ROS, embedded systems, control and computer vision." },
];

function AboutPage() {
  useReveal(); useParallax();
  return (
    <>
      <Cursor />
      <TopBar current="about" />
      <main className="page">
        <section className="wrap page-intro about-hero">
          <Reveal><div className="kicker">02 / ABOUT</div></Reveal>
          <Reveal delay={60}><h1 className="page-title" style={{ marginTop: 16 }}>We are the<br /><em>builders</em>.</h1></Reveal>
          <Reveal delay={120}><p className="page-lead">The Robotics Club of IIT Dharwad is a student-run collective turning curiosity into hardware — one robot, one season, one challenge at a time.</p></Reveal>
        </section>

        {/* mission */}
        <section className="pad" style={{ paddingTop: "clamp(40px,6vw,72px)" }}>
          <div className="wrap mission-grid">
            <div>
              <Reveal><div className="kicker" style={{ marginBottom: 24 }}>OUR MISSION</div></Reveal>
              <Reveal delay={60}><p className="about-statement">To make <em>robotics</em> something every student can build, break and master.</p></Reveal>
            </div>
            <div className="mission-copy">
              <Reveal><p>We started in 2017 with a handful of students and a borrowed corner of the workshop. Today we're four divisions strong, running a dozen live builds and a campus-wide robotics culture.</p></Reveal>
              <Reveal delay={60}><p>We believe robotics shouldn't be gatekept behind labs or jargon. So we build in the open, teach what we learn, and hand the soldering iron to anyone curious enough to pick it up.</p></Reveal>
            </div>
          </div>
        </section>

        {/* what we do */}
        <section className="pad" style={{ borderTop: "1px solid var(--line-soft)" }}>
          <div className="wrap">
            <SectionHead index="—" kicker="WHAT WE DO" title="Build. Compete. <em>Teach.</em>" />
            <div className="about-features" style={{ marginTop: 0 }}>
              {DOES.map((f, i) => (
                <Reveal key={f.ix} delay={i * 80} className="feat">
                  <span className="ix">{f.ix}</span>
                  <div><h4>{f.h}</h4><p>{f.p}</p></div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* values */}
        <section className="pad" style={{ borderTop: "1px solid var(--line-soft)" }}>
          <div className="wrap">
            <SectionHead index="—" kicker="WHAT WE STAND FOR"
              title="The values that <em>hold the bench</em> together." />
            <div className="values-grid">
              {VALUES.map((v) => (
                <Reveal key={v.ix} className="value">
                  <div className="vn">{v.ix}</div><h4>{v.h}</h4><p>{v.p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* timeline */}
        <section className="pad" style={{ borderTop: "1px solid var(--line-soft)" }}>
          <div className="wrap">
            <SectionHead index="—" kicker="OUR JOURNEY"
              title="From a corner of the<br /><em>workshop</em> to the arena." />
            <div className="timeline">
              {TIMELINE.map((t) => (
                <Reveal key={t.yr} className="tl-row">
                  <div className="tl-yr">{t.yr}</div>
                  <div className="tl-main"><h4>{t.h}</h4><p>{t.p}</p></div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* stats band */}
        <section className="ach-band">
          <div className="ach-grid">
            {ACH.map((a) => (
              <Reveal key={a.cap} className="ach">
                <div className="big"><Counter to={parseInt(a.big, 10)} suf={a.suf} /></div>
                <div className="cap">{a.cap}</div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AboutPage />);
