/* global React, ReactDOM, TopBar, SiteFooter, Cursor, SCHEMES, useReveal, useParallax, Reveal, Counter, Ph, Corners, SectionHead, INNOVATIONS, ACH, MARQUEE, useState, useEffect, useTweaks, TweaksPanel, TweakSection, TweakColor, TweakToggle */

function Splash() {
  return (
    <section className="splash">
      <span className="splash-glow g1" data-par="0.06" /><span className="splash-glow g2" data-par="0.1" />
      <div className="splash-inner">
        <div className="emblem">
          <span className="e-ring r1" /><span className="e-ring r2" /><span className="e-ring r3" />
          <span className="e-core" /><span className="e-tick" />
        </div>
        <h1 className="splash-name">ROBOTICS<br /><span className="l2">CLUB</span></h1>
        <p className="splash-tag">Indian Institute of Technology, Dharwad — where students turn ideas into autonomous machines.</p>
        <div className="splash-meta">
          <span><i className="d" /> EST. 2017</span>
          <span><i className="d" /> 4 DIVISIONS</span>
          <span><i className="d" /> 40+ MEMBERS</span>
        </div>
      </div>
      <div className="scroll-cue"><span>SCROLL</span><span className="bar" /></div>
    </section>
  );
}

function Ticker() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">{items.map((m, i) => <span key={i}>{m}</span>)}</div>
    </div>
  );
}

function AboutIntro() {
  return (
    <section className="pad" id="about-intro">
      <div className="wrap">
        <SectionHead index="01 / WHO WE ARE" kicker="THE CLUB"
          title="A workshop where <em>ideas</em> become machines." />
        <div className="about-grid">
          <div className="about-copy">
            <Reveal><p>The <strong>Robotics Club of IIT Dharwad</strong> is a student-run collective of engineers, programmers and tinkerers united by one belief — the fastest way to learn is to build.</p></Reveal>
            <Reveal delay={80}><p>From combat robots and autonomous rovers to vision-guided arms, our members take projects from a blank sheet of CAD all the way to the competition arena.</p></Reveal>
            <Reveal delay={140}>
              <a href="about.html" className="btn btn-ghost" style={{ marginTop: 14 }}>More about us <span className="arr">→</span></a>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <div className="hud about-visual" data-par="0.04">
              <Corners />
              <Ph label="WORKSHOP / TEAM" />
              <div className="hud about-tag" style={{ padding: "12px 16px" }}>
                <Corners />
                <div className="eyebrow">DHARWAD, KARNATAKA · INDIA</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Innovations() {
  return (
    <section className="pad" id="innovations" style={{ borderTop: "1px solid var(--line-soft)" }}>
      <div className="wrap">
        <SectionHead index="02 / HIGHLIGHTS" kicker="ON THE FLOOR"
          title="The innovations that <em>take us forward</em>."
          lead="The builds, arenas and lab work defining our current season." />
        <div className="win-grid">
          {INNOVATIONS.map((w, i) => (
            <Reveal key={w.title} delay={i * 90} as="a" className="win" href={w.href} style={{ "--win-h": `oklch(0.8 0.15 ${w.hue})` }}>
              <div className="win-media"><Ph label={w.ph} /></div>
              <div className="win-body">
                <div className="win-kicker">{w.kicker}</div>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
                <span className="win-link">View <span className="arr">→</span></span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Achievements() {
  return (
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
  );
}

const SPONSOR_REASONS = ["Sponsorship", "Event collaboration", "Competition / organizer", "Media & press", "Other"];

function SponsorContact() {
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); setSent(true); };
  return (
    <section id="contact" className="pad contact" style={{ borderTop: "1px solid var(--line-soft)" }}>
      <span className="hero-glow g1" style={{ opacity: 0.08 }} data-par="0.05" />
      <div className="wrap contact-inner">
        <div>
          <Reveal><div className="kicker">03 / CONTACT</div></Reveal>
          <Reveal delay={60}><h2 style={{ marginTop: 18 }}>Sponsor, host or <em>collaborate</em> with us.</h2></Reveal>
          <Reveal delay={120}><p className="lead">For sponsors, organizers and partners: reach out about backing a build season, co-hosting an event, or featuring our teams at your competition.</p></Reveal>
          <Reveal delay={170}>
            <div className="sponsor-list">
              <div className="sp"><span className="si">01</span><span><b style={{ color: "var(--text)" }}>Sponsorship</b> — power a build season and put your brand on our robots and at our events.</span></div>
              <div className="sp"><span className="si">02</span><span><b style={{ color: "var(--text)" }}>Collaboration</b> — co-host workshops, hackathons or expos with the club.</span></div>
              <div className="sp"><span className="si">03</span><span><b style={{ color: "var(--text)" }}>Competitions</b> — invite our teams to compete or demo at your arena.</span></div>
            </div>
          </Reveal>
          <Reveal delay={220}>
            <div style={{ marginTop: 34, display: "grid", gap: 12 }}>
              <div className="eyebrow">▸ robotics@iitdh.ac.in</div>
              <div className="eyebrow">▸ Innovation Hub, IIT Dharwad, Karnataka 580011</div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={140}>
          <form className="hud contact-form" style={{ padding: 28 }} onSubmit={submit}>
            <Corners />
            <div className="field"><label>Organization</label><input required placeholder="Company / institution" /></div>
            <div className="contact-row">
              <div className="field"><label>Contact name</label><input required placeholder="Your name" /></div>
              <div className="field"><label>Email</label><input required type="email" placeholder="you@company.com" /></div>
            </div>
            <div className="field"><label>Reason for reaching out</label>
              <select>{SPONSOR_REASONS.map((r) => <option key={r}>{r}</option>)}</select>
            </div>
            <div className="field"><label>Message</label><textarea placeholder="Tell us what you have in mind…" /></div>
            {sent
              ? <div className="form-ok">✓ Thanks — your message has reached the club. We'll respond shortly.</div>
              : <button className="btn btn-primary" type="submit" style={{ justifyContent: "center" }}>Send message <span className="arr">→</span></button>}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function HomeTweaks() {
  const [scheme, setScheme] = useState(() => localStorage.getItem("rc_scheme") || "Cyan / Lime");
  const [grid, setGrid] = useState(() => localStorage.getItem("rc_grid") !== "0");
  const [cursor, setCursor] = useState(() => localStorage.getItem("rc_cursor") !== "0");
  useEffect(() => {
    const [a1, a2] = SCHEMES[scheme] || SCHEMES["Cyan / Lime"];
    document.documentElement.style.setProperty("--a1", a1);
    document.documentElement.style.setProperty("--a2", a2);
    localStorage.setItem("rc_scheme", scheme);
  }, [scheme]);
  useEffect(() => { document.body.classList.toggle("no-grid", !grid); localStorage.setItem("rc_grid", grid ? "1" : "0"); }, [grid]);
  useEffect(() => { localStorage.setItem("rc_cursor", cursor ? "1" : "0"); }, [cursor]);
  return (
    <TweaksPanel>
      <TweakSection label="Accent scheme" />
      <TweakColor label="Palette" value={SCHEMES[scheme]} options={Object.values(SCHEMES)}
        onChange={(arr) => { const n = Object.keys(SCHEMES).find((k) => SCHEMES[k][0] === arr[0] && SCHEMES[k][1] === arr[1]); if (n) setScheme(n); }} />
      <TweakSection label="Display" />
      <TweakToggle label="Grid backdrop" value={grid} onChange={setGrid} />
      <TweakToggle label="Custom cursor (reload)" value={cursor} onChange={setCursor} />
    </TweaksPanel>
  );
}

function Home() {
  useReveal(); useParallax();
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      setTimeout(() => { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: "smooth" }); }, 300);
    }
  }, []);
  return (
    <>
      <Cursor />
      <TopBar current="home" />
      <main>
        <Splash />
        <Ticker />
        <AboutIntro />
        <Innovations />
        <Achievements />
        <SponsorContact />
      </main>
      <SiteFooter />
      <HomeTweaks />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Home />);
