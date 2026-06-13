/* global React */
const { useState, useEffect, useRef, useCallback } = React;

/* ============================================================
   CONTENT  — all placeholder, structured for real data later
   ============================================================ */

const NAV = [
  { id: "home", label: "Home", href: "index.html", n: "01", desc: "Start here" },
  { id: "about", label: "About", href: "about.html", n: "02", desc: "Who we are" },
  { id: "projects", label: "Projects", href: "projects.html", n: "03", desc: "What we build" },
  { id: "events", label: "Events", href: "events.html", n: "04", desc: "What's happening" },
  { id: "teams", label: "Teams", href: "teams.html", n: "05", desc: "The divisions" },
  { id: "contact", label: "Contact", href: "index.html#contact", n: "06", desc: "Work with us" },
];

/* ----- projects (each routes to project.html?id=slug) ----- */
const PROJECTS = [
  {
    slug: "pathfinder-mk3", cat: "Autonomous", tag: "Rover", title: "Pathfinder Mk-III",
    tagline: "Six-wheel autonomous rover with SLAM navigation and a 5-DOF arm.",
    year: "2025", status: "In Field", hue: 205, team: "Software & AI · Mechanical",
    overview: [
      "Pathfinder Mk-III is our flagship autonomous ground vehicle — a six-wheel rocker-bogie platform built to traverse unstructured terrain while mapping its surroundings in real time.",
      "The rover fuses LiDAR, stereo vision and wheel odometry into a single SLAM pipeline, then plans collision-free paths to a goal with a 5-DOF manipulator arm for sample retrieval.",
    ],
    specs: [["Drive", "6× brushless, rocker-bogie"], ["Sensing", "3D LiDAR + stereo"], ["Compute", "Jetson Orin NX"], ["Autonomy", "Nav2 + custom SLAM"], ["Arm", "5-DOF, 2 kg payload"], ["Runtime", "~4 hrs"]],
    highlights: ["Real-time SLAM at 10 Hz", "Autonomous waypoint navigation", "Vision-guided sample pickup", "Field-tested over rough terrain"],
    gallery: ["ROVER — FULL BODY", "DRIVETRAIN DETAIL", "ARM + GRIPPER", "FIELD TEST"],
  },
  {
    slug: "skylark-fpv", cat: "Aerial", tag: "Drone", title: "Skylark FPV",
    tagline: "Autonomous quadrotor for mapping and payload delivery.",
    year: "2025", status: "Flight Test", hue: 132, team: "Electronics · Software & AI",
    overview: [
      "Skylark is a custom autonomous quadrotor designed for precision agriculture mapping and light payload delivery across the IIT Dharwad campus.",
      "It carries a downward multispectral camera and runs onboard waypoint missions with GPS + optical-flow position hold, returning stitched field maps after each sortie.",
    ],
    specs: [["Frame", "450 mm carbon X"], ["Lift", "4× 920 KV"], ["Flight ctrl", "PX4 / Pixhawk"], ["Payload", "500 g"], ["Endurance", "~22 min"], ["Comms", "915 MHz telemetry"]],
    highlights: ["Autonomous waypoint missions", "Multispectral field mapping", "Optical-flow position hold", "Return-to-home failsafe"],
    gallery: ["QUAD — TOP VIEW", "FLIGHT CONTROLLER", "IN FLIGHT", "MAPPED FIELD"],
  },
  {
    slug: "dexa-6-arm", cat: "Manipulation", tag: "Arm", title: "DEXA-6 Arm",
    tagline: "6-axis collaborative arm with force feedback and vision-guided picking.",
    year: "2024", status: "Active", hue: 300, team: "Mechanical · Software & AI",
    overview: [
      "DEXA-6 is a desktop-scale six-axis collaborative arm built to explore vision-guided manipulation and force-controlled assembly.",
      "A wrist-mounted camera detects parts on the bench, and the controller blends position and force control to pick, place and insert with sub-millimetre repeatability.",
    ],
    specs: [["Axes", "6 DOF"], ["Reach", "600 mm"], ["Payload", "2 kg"], ["Repeatability", "±0.1 mm"], ["Feedback", "Joint torque"], ["Control", "ROS 2 + MoveIt"]],
    highlights: ["Vision-guided pick & place", "Force-controlled insertion", "Collision-aware planning", "Teach-by-demonstration"],
    gallery: ["ARM — HOME POSE", "WRIST CAMERA", "GRIPPER CLOSEUP", "PICK SEQUENCE"],
  },
  {
    slug: "sentinel-agv", cat: "Autonomous", tag: "Ground", title: "Sentinel AGV",
    tagline: "Indoor autonomous guided vehicle for logistics.",
    year: "2024", status: "Deployed", hue: 205, team: "Software & AI · Electronics",
    overview: [
      "Sentinel is a differential-drive autonomous guided vehicle that ferries payloads between stations inside the lab using a pre-built 2D map.",
      "It localises with LiDAR, avoids dynamic obstacles, and docks itself to charge — a compact testbed for warehouse-style autonomy.",
    ],
    specs: [["Drive", "Differential, 2-wheel"], ["Sensing", "2D LiDAR"], ["Payload", "15 kg"], ["Nav", "Nav2 / AMCL"], ["Speed", "1.2 m/s"], ["Charging", "Auto-dock"]],
    highlights: ["Map-based localisation", "Dynamic obstacle avoidance", "Self-docking charge", "Multi-stop missions"],
    gallery: ["AGV — CHASSIS", "LiDAR MOUNT", "DOCKING STATION", "FLOOR MAP"],
  },
  {
    slug: "hexapod-zero", cat: "Bio-inspired", tag: "Walker", title: "Hexapod Zero",
    tagline: "Spider-gait hexapod with adaptive terrain locomotion.",
    year: "2025", status: "Prototype", hue: 75, team: "Mechanical · Electronics",
    overview: [
      "Hexapod Zero is a six-legged walker built to study legged locomotion and gait generation over uneven ground.",
      "Eighteen servos drive a tripod gait stabilised by an onboard IMU, with body pose actively levelled as the terrain shifts.",
    ],
    specs: [["Legs", "6 × 3-DOF"], ["Actuators", "18 servos"], ["Balance", "9-axis IMU"], ["Gait", "Tripod / wave"], ["Compute", "ESP32 + Pi"], ["Mass", "1.8 kg"]],
    highlights: ["Adaptive tripod gait", "Active body levelling", "Terrain-aware foot placement", "Inverse-kinematics engine"],
    gallery: ["HEXAPOD — STANCE", "LEG LINKAGE", "WALKING", "TERRAIN TEST"],
  },
  {
    slug: "ironclad-15kg", cat: "Manipulation", tag: "Combat", title: "Ironclad 15kg",
    tagline: "Featherweight combat robot — drum spinner with hardened armour.",
    year: "2024", status: "Champion", hue: 25, team: "Mechanical · Electronics",
    overview: [
      "Ironclad is our 15 kg featherweight combat robot — a drum-spinner built to take hits and dish them out in the arena.",
      "A hardened steel drum stores enormous kinetic energy, while an AR500 armour shell and brushless drive keep it aggressive and alive deep into matches.",
    ],
    specs: [["Class", "Featherweight 15 kg"], ["Weapon", "Steel drum spinner"], ["Drive", "4× brushless"], ["Armour", "AR500 + HDPE"], ["Speed", "5 m/s"], ["Record", "Arena champion"]],
    highlights: ["Tournament champion run", "High-energy drum weapon", "Survives full-power hits", "Invertible drive"],
    gallery: ["IRONCLAD — ARENA", "DRUM WEAPON", "ARMOUR PANELS", "MATCH ACTION"],
  },
];
const PROJ_CATS = ["All", "Autonomous", "Aerial", "Manipulation", "Bio-inspired"];

/* ----- innovations strip on the home page ----- */
const INNOVATIONS = [
  { kicker: "LATEST BUILD", title: "Pathfinder Mk-III", text: "Our autonomous rover now maps and navigates rough terrain end-to-end.", ph: "AUTONOMOUS ROVER", href: "project.html?id=pathfinder-mk3", hue: 205 },
  { kicker: "ON THE ARENA", title: "National Combat Title", text: "Ironclad took the featherweight crown at the inter-college combat arena.", ph: "COMBAT ROBOT", href: "project.html?id=ironclad-15kg", hue: 25 },
  { kicker: "IN THE LAB", title: "Autonomy Stack", text: "A shared ROS 2 perception & planning stack now powers every ground robot.", ph: "PERCEPTION STACK", href: "projects.html", hue: 132 },
];

/* ----- events (each routes to event.html?id=slug) ----- */
const EVENTS = [
  {
    slug: "roboweek-26", title: "RoboWeek '26", status: "live",
    dateLabel: "MAR 14–17", year: "2026", time: "09:00 – 18:00 IST", venue: "Innovation Hub, IIT Dharwad",
    type: "Flagship Festival", blurb: "Our flagship 4-day robotics festival — workshops, an open expo and the inter-college arena, happening now.",
    overview: ["RoboWeek is the club's biggest event of the year: four days of hands-on workshops, a public project expo, guest talks and the headline inter-college combat & autonomous arena.", "The arena is live right now — follow along for bracket updates and match results."],
    agenda: [["Day 1", "Opening + ROS workshops"], ["Day 2", "Project expo + industry talks"], ["Day 3", "Arena qualifiers"], ["Day 4", "Arena finals + awards"]],
    gallery: ["ARENA FLOOR", "EXPO HALL", "WORKSHOP", "AWARDS"],
  },
  {
    slug: "ros2-bootcamp", title: "ROS 2 Bootcamp", status: "upcoming",
    dateLabel: "APR 02", year: "2026", time: "10:00 – 17:00 IST", venue: "CSE Lab 2, IIT Dharwad",
    type: "Workshop", blurb: "Hands-on weekend intensive on ROS 2, Gazebo simulation and the Nav2 stack.",
    overview: ["A weekend intensive that takes you from zero to a working ROS 2 navigation stack in simulation.", "Bring a laptop — we'll set up the toolchain together and finish by driving a simulated robot autonomously."],
    agenda: [["Morning", "ROS 2 nodes, topics, services"], ["Midday", "Gazebo simulation"], ["Afternoon", "Nav2 path planning"], ["Wrap", "Mini autonomy challenge"]],
    gallery: ["WORKSHOP ROOM", "SIM SCREEN", "GROUP", "RESULT"],
  },
  {
    slug: "linefollower-sprint", title: "Line-Follower Sprint", status: "upcoming",
    dateLabel: "APR 19", year: "2026", time: "All day", venue: "Innovation Hub, IIT Dharwad",
    type: "Build Challenge", blurb: "Beginner-friendly 48-hour challenge — design and tune a PID line-following robot.",
    overview: ["A beginner-friendly build challenge: teams design, build and tune a line-following robot in 48 hours, then race it on our track.", "No experience needed — mentors and parts are provided."],
    agenda: [["Kickoff", "Rules + parts handout"], ["Build", "48-hour build window"], ["Tune", "Track practice runs"], ["Race", "Timed finals"]],
    gallery: ["THE TRACK", "BUILD BENCH", "TUNING", "RACE"],
  },
  {
    slug: "industry-talk-autonomy", title: "Industry Talk: Autonomy", status: "past",
    dateLabel: "DEC 08", year: "2025", time: "16:00 – 18:00 IST", venue: "Auditorium, IIT Dharwad",
    type: "Guest Talk", blurb: "Robotics engineers from leading autonomy labs on building real self-driving systems.",
    overview: ["A guest lecture from engineers working on production autonomy stacks, covering perception, planning and the gap between research and deployment.", "Followed by an open Q&A with students."],
    agenda: [["Talk", "Perception → planning → control"], ["Demo", "Real-world failure cases"], ["Q&A", "Open floor"]],
    gallery: ["AUDITORIUM", "SLIDES", "Q&A", "MEETUP"],
  },
  {
    slug: "eyantra-finals", title: "e-Yantra Finals", status: "past",
    dateLabel: "NOV 22", year: "2025", time: "—", venue: "IIT Bombay",
    type: "Competition", blurb: "Our team placed 3rd in the national e-Yantra Robotics Competition finals.",
    overview: ["The club's autonomy team travelled to IIT Bombay for the e-Yantra national finals and came home with a 3rd-place finish.", "Months of simulation and hardware iteration paid off on the competition floor."],
    agenda: [["Theme", "Autonomous task challenge"], ["Result", "3rd place — national finals"]],
    gallery: ["TEAM AT FINALS", "ROBOT", "TASK ARENA", "PODIUM"],
  },
  {
    slug: "intro-to-robotics", title: "Intro to Robotics", status: "past",
    dateLabel: "AUG 30", year: "2025", time: "17:00 – 19:00 IST", venue: "Innovation Hub, IIT Dharwad",
    type: "Workshop", blurb: "Welcome session for first-years — sensors, motors and your first microcontroller.",
    overview: ["Our annual welcome workshop for first-year students: a friendly tour of sensors, motors and microcontrollers with a hands-on blink-to-bot exercise.", "The on-ramp into every club division."],
    agenda: [["Intro", "What the club does"], ["Hands-on", "Microcontroller basics"], ["Build", "Your first circuit"]],
    gallery: ["FULL ROOM", "BREADBOARD", "FIRST BOT", "MENTORS"],
  },
];

/* ----- teams / divisions ----- */
const TEAMS = [
  { n: "01", h: "Mechanical", p: "CAD, fabrication, drivetrains and structural design — from SolidWorks models straight to the machine shop.", chips: ["CAD", "CNC", "3D Print", "Drivetrain", "Fabrication"], hue: 25, lead: "R. Iyer", count: 12,
    does: ["Design chassis, drivetrains & mechanisms", "Run the CNC, lathe and 3D-print farm", "Tolerance, assemble and stress-test builds"] },
  { n: "02", h: "Electronics", p: "PCB design, power systems, sensor integration and the embedded firmware that brings hardware to life.", chips: ["PCB", "Embedded", "Power", "Sensors", "Firmware"], hue: 132, lead: "K. Patel", count: 10,
    does: ["Design custom PCBs & power systems", "Integrate sensors and motor drivers", "Write firmware for microcontrollers"] },
  { n: "03", h: "Software & AI", p: "ROS stacks, computer vision, path planning and the control algorithms that make our robots think.", chips: ["ROS", "Vision", "SLAM", "Control", "ML"], hue: 205, lead: "S. Nair", count: 14,
    does: ["Build perception & SLAM pipelines", "Write planning & control algorithms", "Train and deploy vision models"] },
  { n: "04", h: "Operations", p: "Sponsorships, events, outreach and logistics — the engine that keeps the club running and funded.", chips: ["Sponsors", "Events", "Outreach", "Media", "Design"], hue: 300, lead: "M. Rao", count: 8,
    does: ["Secure sponsors & manage budgets", "Run events, expos and outreach", "Handle media, design and comms"] },
];

const ACH = [
  { big: "9", suf: "", cap: "National titles across combat & autonomous categories" },
  { big: "3", suf: "rd", cap: "Place — e-Yantra Robotics Competition, IIT Bombay" },
  { big: "40", suf: "k+", cap: "Sponsorship raised for the 2025–26 build season" },
  { big: "15", suf: "+", cap: "Workshops run for the campus & nearby schools" },
];

const PEOPLE = [
  { name: "A. Sharma", role: "Club Lead", team: "Core", yr: "Final Year · ME" },
  { name: "R. Iyer", role: "Mechanical Head", team: "Mechanical", yr: "Third Year · ME" },
  { name: "K. Patel", role: "Electronics Head", team: "Electronics", yr: "Second Year · EE" },
  { name: "S. Nair", role: "Software Head", team: "Software & AI", yr: "Third Year · CSE" },
  { name: "M. Rao", role: "Operations Head", team: "Operations", yr: "Third Year · EE" },
  { name: "D. Gupta", role: "AI / Vision Lead", team: "Software & AI", yr: "Final Year · CSE" },
];

const VALUES = [
  { ix: "01", h: "Build to learn", p: "We believe the fastest way to understand a system is to build it, break it, and build it again." },
  { ix: "02", h: "Open by default", p: "Knowledge, tools and parts are shared. Every member can learn any division." },
  { ix: "03", h: "Compete with class", p: "We push hard on the arena floor and carry ourselves well off it." },
  { ix: "04", h: "Make it accessible", p: "Robotics shouldn't be gatekept — we teach the campus and nearby schools for free." },
];

const TIMELINE = [
  { yr: "2017", h: "Founded", p: "A handful of students start the club in a borrowed corner of the workshop." },
  { yr: "2019", h: "First arena", p: "Our first combat robot enters — and survives — a national competition." },
  { yr: "2022", h: "Autonomy", p: "The Software & AI division forms; the first SLAM rover takes shape." },
  { yr: "2024", h: "Champions", p: "Ironclad wins its featherweight class; the club crosses 40 members." },
  { yr: "2026", h: "Today", p: "Four divisions, a dozen live builds, and a campus-wide robotics culture." },
];

const MARQUEE = ["ROS 2", "AUTONOMY", "COMPUTER VISION", "EMBEDDED", "SLAM", "MANIPULATION", "CONTROL THEORY", "FPV", "CAD / CAM", "MACHINE LEARNING"];

const findProject = (slug) => PROJECTS.find((p) => p.slug === slug);
const findEvent = (slug) => EVENTS.find((e) => e.slug === slug);

/* ============================================================
   PRIMITIVES
   ============================================================ */

function useReveal() {
  useEffect(() => {
    let raf = 0;
    const root = document.documentElement;
    const revealInView = (instant) => {
      const vh = window.innerHeight;
      if (instant) root.classList.add("reveal-instant");
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (instant ? (r.top < vh && r.bottom > 0) : (r.top < vh * 0.92 && r.bottom > 0)) el.classList.add("in");
      });
      if (instant) requestAnimationFrame(() => root.classList.remove("reveal-instant"));
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => revealInView(false)); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) revealInView(false); });
    revealInView(false);
    const t1 = setTimeout(() => revealInView(false), 120);
    const t2 = setTimeout(() => revealInView(false), 400);
    const safety = setTimeout(() => revealInView(true), 1200);
    return () => {
      window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); clearTimeout(safety);
    };
  }, []);
}

/* parallax: elements with [data-par] translate on scroll. value = speed factor */
function useParallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const apply = () => {
      const vh = window.innerHeight;
      document.querySelectorAll("[data-par]").forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-par")) || 0;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${(-center * speed).toFixed(1)}px, 0)`;
      });
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(apply); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    apply();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);
}

function Reveal({ children, delay = 0, as = "div", className = "", ...rest }) {
  const Tag = as;
  return <Tag className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>{children}</Tag>;
}

function Counter({ to, suf = "", dur = 1400 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const finish = () => { done.current = true; setVal(to); };
    const run = () => {
      if (done.current) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
        done.current = true; window.removeEventListener("scroll", run);
        if (document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVal(to); return; }
        const t0 = performance.now();
        const tick = (now) => { const p = Math.min(1, (now - t0) / dur); setVal(Math.round((1 - Math.pow(1 - p, 3)) * to)); if (p < 1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      }
    };
    window.addEventListener("scroll", run, { passive: true });
    run();
    const t = setTimeout(run, 200);
    const safety = setTimeout(() => { if (!done.current) { const r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) finish(); } }, 1300);
    return () => { window.removeEventListener("scroll", run); clearTimeout(t); clearTimeout(safety); };
  }, [to, dur]);
  return <span ref={ref}>{val}<span className="suf">{suf}</span></span>;
}

function Ph({ label, className = "", style }) {
  return <div className={`ph ${className}`} data-label={label} style={style} />;
}

function Corners() {
  return (<><i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" /></>);
}

function SectionHead({ index, kicker, title, lead, right }) {
  return (
    <div className="sec-head">
      <div>
        <Reveal><div className="kicker">{kicker}</div></Reveal>
        <Reveal delay={60}><h2 className="sec-title" style={{ marginTop: 18 }} dangerouslySetInnerHTML={{ __html: title }} /></Reveal>
        {lead && <Reveal delay={120}><p className="lead" style={{ marginTop: 18 }}>{lead}</p></Reveal>}
      </div>
      {right && <Reveal delay={100}><div style={{ textAlign: "right" }}><div className="sec-index">{index}</div>{right}</div></Reveal>}
      {!right && index && <Reveal delay={100}><div className="sec-index" style={{ alignSelf: "flex-end" }}>{index}</div></Reveal>}
    </div>
  );
}

function Cursor() {
  useEffect(() => {
    if (window.matchMedia("(max-width: 900px)").matches) return;
    if (localStorage.getItem("rc_cursor") === "0") return;
    const dot = document.createElement("div"); dot.className = "cursor-dot";
    const ring = document.createElement("div"); ring.className = "cursor-ring";
    document.body.append(dot, ring);
    let rx = 0, ry = 0, x = 0, y = 0;
    const move = (e) => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; };
    const loop = () => { rx += (x - rx) * 0.18; ry += (y - ry) * 0.18; ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; raf = requestAnimationFrame(loop); };
    let raf = requestAnimationFrame(loop);
    const over = (e) => { if (e.target.closest("a,button,.proj-card,.team-cell,.ev,.win,.tl-row,input,textarea,select")) ring.classList.add("hot"); };
    const out = (e) => { if (e.target.closest("a,button,.proj-card,.team-cell,.ev,.win,.tl-row,input,textarea,select")) ring.classList.remove("hot"); };
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => { window.removeEventListener("mousemove", move); document.removeEventListener("mouseover", over); document.removeEventListener("mouseout", out); cancelAnimationFrame(raf); dot.remove(); ring.remove(); };
  }, []);
  return null;
}

Object.assign(window, {
  React, useState, useEffect, useRef, useCallback,
  NAV, PROJECTS, PROJ_CATS, INNOVATIONS, EVENTS, TEAMS, ACH, PEOPLE, VALUES, TIMELINE, MARQUEE,
  findProject, findEvent,
  useReveal, useParallax, Reveal, Counter, Ph, Corners, SectionHead, Cursor,
});
