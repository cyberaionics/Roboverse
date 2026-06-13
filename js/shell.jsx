/* global React, NAV, useState, useEffect, useRef */

/* apply saved accent / grid prefs early so every page is consistent */
const SCHEMES = {
  "Cyan / Lime": ["oklch(0.82 0.15 205)", "oklch(0.88 0.18 132)"],
  "Magenta / Cyan": ["oklch(0.72 0.2 350)", "oklch(0.82 0.15 205)"],
  "Amber / Crimson": ["oklch(0.82 0.16 75)", "oklch(0.66 0.21 25)"],
  "Ice / Violet": ["oklch(0.86 0.1 230)", "oklch(0.72 0.17 300)"],
};
function applyPrefs() {
  try {
    const name = localStorage.getItem("rc_scheme");
    if (name && SCHEMES[name]) {
      document.documentElement.style.setProperty("--a1", SCHEMES[name][0]);
      document.documentElement.style.setProperty("--a2", SCHEMES[name][1]);
    }
    if (localStorage.getItem("rc_grid") === "0") document.body.classList.add("no-grid");
  } catch (e) { }
}
applyPrefs();

function BrandMark({ small }) {
  return (
    <span className={`brand-mark ${small ? "sm" : ""}`}>
      <span className="ring2" /><span className="dia" />
    </span>
  );
}

/* fixed top bar: brand (left) + menu button (right) */
function TopBar({ current }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div className="topbar">
        <a href="index.html" className="brand">
          <BrandMark />
          <span>
            <span className="brand-name">ROBOTICS CLUB</span>
            <span className="brand-sub">IIT DHARWAD</span>
          </span>
        </a>
        <button className={`menu-btn ${open ? "open" : ""}`} onClick={() => setOpen(true)} aria-label="Open menu">
          <span className="menu-btn-label">MENU</span>
          <span className="menu-btn-ico"><i /><i /></span>
        </button>
      </div>
      <MenuOverlay open={open} onClose={() => setOpen(false)} current={current} />
    </>
  );
}

/* tiles shown in the grid (Home + Contact live on the vertical rail) */
const MENU_TILES = [
  { id: "projects", hue: 230, glyph: "PR" },
  { id: "events", hue: 205, glyph: "EV" },
  { id: "teams", hue: 150, glyph: "TM" },
  { id: "about", hue: 285, glyph: "AB" },
];

function MenuOverlay({ open, onClose, current }) {
  const byId = Object.fromEntries(NAV.map((n) => [n.id, n]));
  const home = byId.home, contact = byId.contact;
  const tiles = MENU_TILES.map((t) => ({ ...t, ...byId[t.id] }));

  return (
    <div className={`menu-overlay ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="menu-bg-grid" />
      <span className="menu-glow g1" /><span className="menu-glow g2" />
      <div className="menu-top">
        <a href="index.html" className="brand"><BrandMark /><span><span className="brand-name">ROBOTICS CLUB</span><span className="brand-sub">IIT DHARWAD</span></span></a>
        <button className="menu-close" onClick={onClose} aria-label="Close menu">
          <span>CLOSE</span><span className="x"><i /><i /></span>
        </button>
      </div>

      <div className="menu-stage">
        <nav className="menu-grid">
          {tiles.map((t, i) => (
            <a
              key={t.id}
              href={t.href}
              className={`menu-tile ${current === t.id ? "active" : ""}`}
              style={{ "--hue": t.hue, transitionDelay: `${0.07 * i + 0.08}s` }}
            >
              <span className="mt-tint" />
              <span className="mt-grain" />
              <span className="mt-num"><i />{t.n}</span>
              <span className="mt-glyph" aria-hidden="true">{t.glyph}</span>
              <span className="mt-body">
                <span className="mt-label">{t.label}</span>
                <span className="mt-desc">{t.desc}</span>
              </span>
              <span className="mt-enter">ENTER <i className="arr">→</i></span>
            </a>
          ))}
        </nav>

        <nav className="menu-rail">
          <a href={home.href} className={`rail-link ${current === home.id ? "active" : ""}`} style={{ transitionDelay: ".34s" }}>
            <span className="rl-label">{home.label}</span>
            <span className="rl-n">{home.n}</span>
          </a>
          <a href={contact.href} className={`rail-link ${current === contact.id ? "active" : ""}`} style={{ transitionDelay: ".42s" }}>
            <span className="rl-label">{contact.label}</span>
            <span className="rl-n">{contact.n}</span>
          </a>
        </nav>
      </div>

      <div className="menu-foot">
        <div className="menu-foot-col">
          <span className="eyebrow">GET IN TOUCH</span>
          <a href="mailto:robotics@iitdh.ac.in">robotics@iitdh.ac.in</a>
        </div>
        <div className="menu-foot-col">
          <span className="eyebrow">FIND US</span>
          <span className="mf-text">Innovation Hub, IIT Dharwad<br />Karnataka 580011</span>
        </div>
        <div className="menu-foot-col">
          <span className="eyebrow">SOCIAL</span>
          <div className="mf-social">
            <a href="#" onClick={(e) => e.preventDefault()}>Instagram</a>
            <a href="#" onClick={(e) => e.preventDefault()}>LinkedIn</a>
            <a href="#" onClick={(e) => e.preventDefault()}>GitHub</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-cta reveal">
          <div className="eyebrow">EST. 2017 · IIT DHARWAD</div>
          <h2 className="footer-big">Let's build the<br />future, together.</h2>
          <a href="index.html#contact" className="btn btn-primary">Work with us <span className="arr">→</span></a>
        </div>
        <div className="footer-top">
          <div className="footer-brand">
            <a href="index.html" className="brand"><BrandMark /><span><span className="brand-name">ROBOTICS CLUB</span><span className="brand-sub">IIT DHARWAD</span></span></a>
            <p>Student robotics collective at the Indian Institute of Technology Dharwad. Built by students, for students.</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col"><h5>Explore</h5>
              <a href="about.html">About</a><a href="projects.html">Projects</a><a href="events.html">Events</a><a href="teams.html">Teams</a>
            </div>
            <div className="footer-col"><h5>Connect</h5>
              <a href="index.html#contact">Sponsor us</a><a href="index.html#contact">Collaborate</a><a href="mailto:robotics@iitdh.ac.in">Email</a>
            </div>
            <div className="footer-col"><h5>Social</h5>
              <a href="#" onClick={(e) => e.preventDefault()}>Instagram ↗</a><a href="#" onClick={(e) => e.preventDefault()}>LinkedIn ↗</a><a href="#" onClick={(e) => e.preventDefault()}>GitHub ↗</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Robotics Club · IIT Dharwad</span>
          <span>Design Prototype · 15.39°N 74.99°E</span>
        </div>
      </div>
    </footer>
  );
}

/* back button used on detail pages */
function BackBar({ href, label }) {
  return (
    <a href={href} className="back-bar">
      <span className="back-ico">←</span>
      <span>{label}</span>
    </a>
  );
}

Object.assign(window, { SCHEMES, applyPrefs, BrandMark, TopBar, MenuOverlay, SiteFooter, BackBar });
