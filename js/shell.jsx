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
      <span className="ring2" /> <img src="https://raw.githubusercontent.com/cyberaionics/Roboverse/main/assets/Logo.png" alt="Emblem logo" className="e-image" /> <span className="dia" />
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
  { id: "projects", hue: 230 },
  { id: "events", hue: 205 },
  { id: "teams", hue: 150 },
  { id: "about", hue: 285 },
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
              <span className="mt-body">
                <span className="mt-label">{t.label}</span>
                <span className="mt-desc">{t.desc}</span>
              </span>
              <span className="mt-enter">ENTER <i className="arr">→</i></span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}


function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-glow footer-glow-one" />
      <div className="footer-glow footer-glow-two" />

      <div className="wrap">
        {/* Large call to action */}
        <div className="footer-cta reveal">
          <div className="footer-cta-content">
            <div className="eyebrow">
              <span className="footer-status-dot" />
              EST. 2017 · IIT DHARWAD
            </div>

            <h2 className="footer-big">
              Let's build the
              <br />
              <span>future, together.</span>
            </h2>

            <p className="footer-cta-description">
              Have an idea, a project, or a robot to build?
              Let's make something extraordinary.
            </p>

            <div className="footer-cta-actions">
              <a
                href="mailto:robotics@iitdh.ac.in"
                className="footer-secondary-btn"
              >
                Get in touch
              </a>
            </div>
          </div>

          <div className="footer-visual" aria-hidden="true">
            <div className="footer-orbit orbit-one" />
            <div className="footer-orbit orbit-two" />
            <div className="footer-orbit orbit-three" />
            <div className="footer-orbit-core">
              <BrandMark />
            </div>
            <span className="footer-cross cross-one">+</span>
            <span className="footer-cross cross-two">+</span>
            <span className="footer-cross cross-three">+</span>
            <span className="footer-visual-label">
              BUILD · TEST · REPEAT
            </span>
          </div>
        </div>

        {/* Footer divider */}
        <div className="footer-divider" />

        {/* Brand and navigation */}
        <div className="footer-top">
          <div className="footer-brand">
            <a href="index.html" className="brand">
              <BrandMark />
              <span>
                <span className="brand-name">ROBOTICS CLUB</span>
                <span className="brand-sub">IIT DHARWAD</span>
              </span>
            </a>

            <p>
              Student robotics collective at the Indian Institute
              of Technology Dharwad. Built by students, for students.
            </p>

            <div className="footer-tags">
              <span>HARDWARE</span>
              <span>SOFTWARE</span>
              <span>INNOVATION</span>
            </div>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <h5>EXPLORE</h5>
              <a href="about.html">About <span>↗</span></a>
              <a href="projects.html">Projects <span>↗</span></a>
              <a href="events.html">Events <span>↗</span></a>
              <a href="teams.html">Teams <span>↗</span></a>
            </div>

            <div className="footer-col">
              <h5>FOLLOW US</h5>
              <a
                href="https://www.instagram.com/roboticsclub_iitdh/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram <span>↗</span>
              </a>
              <a
                href="https://www.linkedin.com/company/robotics-club-iit-dharwad/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn <span>↗</span>
              </a>
              <a
                href="https://github.com/robotics-club-iitdh"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <span>↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Robotics Club · IIT Dharwad
          </span>

          <span className="footer-bottom-center">
            ENGINEERED WITH CURIOSITY <span>✳</span>
          </span>

          <a href="#top" className="footer-back-top">
            BACK TO TOP ↑
          </a>
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
