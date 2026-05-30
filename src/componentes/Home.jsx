import { useState, useEffect, useRef } from "react";
import "../css/home.css";

const STATS = [
  { num: "6.000", unit: "kg/mes", label: "de e-waste procesados" },
  { num: "93%",   unit: "",       label: "de equipos recuperados" },
  { num: "2",     unit: "zonas",  label: "de recolección activas" },
  { num: "10",    unit: "puntos", label: "limpios operativos" },
];

const SERVICIOS = [
  {
    icon: "♻",
    titulo: "Reciclaje de e-waste",
    desc: "Desmontamos y clasificamos notebooks, PCs y componentes electrónicos para recuperar materiales valiosos y reducir el impacto ambiental.",
    tag: "Proceso automatizado",
  },
  {
    icon: "🔧",
    titulo: "Reacondicionamiento",
    desc: "El 1% de los equipos recibidos tienen vida útil restante. Los reacondicionamos y reintroducimos al mercado a precio accesible.",
    tag: "Economía circular",
  },
  {
    icon: "🚛",
    titulo: "Recolección urbana",
    desc: "Operamos rutas de recolección en Guaymallén y Maipú/Godoy Cruz, con logística adaptada a condiciones climáticas adversas.",
    tag: "Zona 1 y Zona 2",
  },
  {
    icon: "📊",
    titulo: "Simulación operativa",
    desc: "Usamos modelos de probabilidad (distribuciones uniformes, Poisson, exponencial) para optimizar recursos y proyectar demanda.",
    tag: "Modelos estocásticos",
  },
];

const PASOS = [
  { n:"01", titulo:"Recolección", desc:"Retiramos equipos desde puntos limpios habilitados en Mendoza." },
  { n:"02", titulo:"Clasificación", desc:"Separamos notebooks, PCs y componentes por tipo y estado." },
  { n:"03", titulo:"Evaluación", desc:"El 93% apto para tratamiento; el 7% restante va a disposición final." },
  { n:"04", titulo:"Tratamiento", desc:"Reciclaje (99%) o reacondicionamiento (1%) según posibilidades." },
  { n:"05", titulo:"Reporte", desc:"Generamos métricas diarias: tiempos, empleados necesarios y proyección." },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function AnimNum({ target, suffix="" }) {
  const [val, setVal] = useState(0);
  const [ref, visible] = useInView();
  useEffect(() => {
    if (!visible) return;
    const isInt = /^\d+$/.test(target.replace(",",""));
    if (!isInt) { setVal(target); return; }
    const end = parseInt(target.replace(/\D/g,""));
    let start = 0;
    const step = Math.ceil(end / 50);
    const t = setInterval(() => {
      start = Math.min(start + step, end);
      setVal(start.toLocaleString("es-AR"));
      if (start >= end) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [visible, target]);
  return <span ref={ref}>{val || "0"}{suffix}</span>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroRef, heroVisible] = useInView(0.01);
  const [statsRef, statsVisible] = useInView();
  const [servRef, servVisible] = useInView();
  const [pasosRef, pasosVisible] = useInView();
  const [ctaRef, ctaVisible] = useInView();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,700;0,900;1,300;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0E1A14; color: #E8EDE8; font-family: 'DM Sans', sans-serif; }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 48px; height: 68px;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.4s;
        }
        .nav.scrolled {
          background: rgba(14,26,20,0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: #2DCF8F; display: flex; align-items: center;
          justify-content: center; font-size: 18px;
        }
        .nav-logo-text { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
        .nav-links { display: flex; align-items: center; gap: 36px; list-style: none; }
        .nav-links a { font-size: 14px; color: rgba(255,255,255,0.65); text-decoration: none; font-weight: 500; transition: color 0.2s; }
        .nav-links a:hover { color: #2DCF8F; }
        .nav-cta {
          background: #2DCF8F; color: #0E1A14; font-size: 13px; font-weight: 600;
          padding: 9px 20px; border-radius: 24px; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .nav-cta:hover { background: #3FFFAB; transform: translateY(-1px); }

        /* ── HERO ── */
        /*.hero {
          min-height: 100vh; position: relative; overflow: hidden;
          display: flex; align-items: center;
          padding: 120px 48px 80px;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 60% 40%, rgba(45,207,143,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 20% 80%, rgba(45,207,143,0.06) 0%, transparent 50%),
            #0E1A14;
        }
        .hero-grain {
          position: absolute; inset: 0; opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }
        .hero-circle {
          position: absolute; right: -100px; top: 50%; transform: translateY(-50%);
          width: 600px; height: 600px; border-radius: 50%;
          border: 1px solid rgba(45,207,143,0.12);
          animation: spin 40s linear infinite;
        }
        .hero-circle::before {
          content:''; position: absolute; inset: 40px; border-radius: 50%;
          border: 1px solid rgba(45,207,143,0.08);
        }
        .hero-circle::after {
          content:''; position: absolute; inset: 100px; border-radius: 50%;
          border: 1px solid rgba(45,207,143,0.05);
        }
        @keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }

        .hero-content { position: relative; z-index: 2; max-width: 680px; }
        .hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(45,207,143,0.12); border: 1px solid rgba(45,207,143,0.25);
          color: #2DCF8F; font-size: 12px; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; padding: 6px 14px; border-radius: 20px;
          margin-bottom: 28px;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s 0.1s, transform 0.6s 0.1s;
        }
        .hero-tag.show { opacity: 1; transform: translateY(0); }
        .hero-tag-dot { width: 6px; height: 6px; border-radius: 50%; background: #2DCF8F; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }

        .hero-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(48px, 7vw, 88px);
          font-weight: 900; line-height: 1.0; letter-spacing: -2px;
          margin-bottom: 28px; color: #fff;
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.7s 0.25s, transform 0.7s 0.25s;
        }
        .hero-title.show { opacity: 1; transform: translateY(0); }
        .hero-title em { font-style: italic; color: #2DCF8F; }

        .hero-desc {
          font-size: 18px; line-height: 1.7; color: rgba(255,255,255,0.55);
          max-width: 500px; margin-bottom: 44px; font-weight: 300;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s 0.4s, transform 0.7s 0.4s;
        }
        .hero-desc.show { opacity: 1; transform: translateY(0); }

        .hero-actions {
          display: flex; align-items: center; gap: 20px;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s 0.55s, transform 0.7s 0.55s;
        }
        .hero-actions.show { opacity: 1; transform: translateY(0); }
        .btn-primary {
          background: #2DCF8F; color: #0E1A14; font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600; padding: 14px 32px;
          border-radius: 30px; border: none; cursor: pointer; transition: all 0.2s;
          text-decoration: none; display: inline-block;
        }
        .btn-primary:hover { background: #3FFFAB; transform: translateY(-2px); box-shadow: 0 12px 40px rgba(45,207,143,0.3); }
        .btn-ghost {
          color: rgba(255,255,255,0.6); font-size: 15px; font-weight: 500;
          text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
          transition: color 0.2s;
        }
        .btn-ghost:hover { color: #fff; }
        .btn-ghost-arrow { transition: transform 0.2s; }
        .btn-ghost:hover .btn-ghost-arrow { transform: translateX(4px); }

        /* ── STATS ── */
       /* .stats {
          padding: 80px 48px;
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: rgba(255,255,255,0.06); border-radius: 20px; overflow: hidden; }
        .stat-item {
          background: rgba(255,255,255,0.02); padding: 40px 36px;
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.5s, transform 0.5s;
        }
        .stat-item.show { opacity: 1; transform: translateY(0); }
        .stat-num {
          font-family: 'Fraunces', serif; font-size: 52px; font-weight: 900;
          color: #2DCF8F; line-height: 1; letter-spacing: -2px; margin-bottom: 4px;
        }
        .stat-unit { font-size: 18px; font-weight: 300; color: rgba(255,255,255,0.4); }
        .stat-label { font-size: 14px; color: rgba(255,255,255,0.4); margin-top: 8px; font-weight: 400; }

        /* ── SERVICIOS ── */
        /*.servicios { padding: 100px 48px; }
        .section-eyebrow {
          font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          color: #2DCF8F; margin-bottom: 16px;
        }
        .section-title {
          font-family: 'Fraunces', serif; font-size: clamp(32px,4vw,52px);
          font-weight: 700; color: #fff; line-height: 1.15; letter-spacing: -1px;
          margin-bottom: 64px; max-width: 520px;
        }
        .section-title em { font-style: italic; color: rgba(255,255,255,0.4); }
        .servicios-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; background: rgba(255,255,255,0.06); border-radius: 24px; overflow: hidden; }
        .servicio-card {
          background: #111E18; padding: 44px 40px; position: relative; overflow: hidden;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.5s, transform 0.5s, background 0.3s;
        }
        .servicio-card.show { opacity: 1; transform: translateY(0); }
        .servicio-card:hover { background: #162218; }
        .servicio-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(45,207,143,0.4), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .servicio-card:hover::before { opacity: 1; }
        .servicio-icon { font-size: 32px; margin-bottom: 20px; display: block; }
        .servicio-tag {
          font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
          color: #2DCF8F; background: rgba(45,207,143,0.1); padding: 4px 10px;
          border-radius: 10px; display: inline-block; margin-bottom: 16px;
        }
        .servicio-titulo { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 12px; }
        .servicio-desc { font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.45); font-weight: 300; }

        /* ── PROCESO ── */
        /*.proceso { padding: 100px 48px; background: rgba(45,207,143,0.03); border-top: 1px solid rgba(255,255,255,0.05); }
        .proceso-inner { display: grid; grid-template-columns: 1fr 2fr; gap: 80px; align-items: start; }
        .proceso-steps { display: flex; flex-direction: column; gap: 0; }
        .paso {
          display: flex; gap: 24px; padding: 28px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          opacity: 0; transform: translateX(-20px);
          transition: opacity 0.5s, transform 0.5s;
        }
        .paso.show { opacity: 1; transform: translateX(0); }
        .paso:last-child { border-bottom: none; }
        .paso-num {
          font-family: 'Fraunces', serif; font-size: 11px; font-weight: 700;
          color: #2DCF8F; min-width: 28px; padding-top: 3px;
        }
        .paso-titulo { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 6px; }
        .paso-desc { font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.6; font-weight: 300; }

/*
        /* FOOTER */
       /* .footer {
          padding: 48px; border-top: 1px solid rgba(255,255,255,0.07);
          display: flex; justify-content: space-between; align-items: center;
        }
        .footer-copy { font-size: 13px; color: rgba(255,255,255,0.25); }
        .footer-links { display: flex; gap: 28px; list-style: none; }
        .footer-links a { font-size: 13px; color: rgba(255,255,255,0.3); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: #2DCF8F; }

        @media (max-width: 768px) {
          .nav { padding: 0 20px; }
          .nav-links, .nav-cta { display: none; }
          .hero { padding: 100px 20px 60px; }
          .stats { padding: 60px 20px; }
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .servicios, .proceso, .cta-section { padding: 70px 20px; }
          .servicios-grid { grid-template-columns: 1fr; }
          .proceso-inner { grid-template-columns: 1fr; gap: 40px; }
          .footer { flex-direction: column; gap: 20px; padding: 32px 20px; text-align: center; }
        }
      `}</style>

     
     
     
     
     
     
     
     
     
     
     
     
     
     

      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg" />
        <div className="hero-grain" />
        <div className="hero-circle" />
        <div className="hero-content">
          <div className={`hero-tag${heroVisible?" show":""}`}>
            <span className="hero-tag-dot" />
            Mendoza · Reciclaje de e-waste
          </div>
          <h1 className={`hero-title${heroVisible?" show":""}`}>
            Tecnología que<br/>
            <em>vuelve a vivir.</em>
          </h1>
          <p className={`hero-desc${heroVisible?" show":""}`}>
            Reciclarg gestiona residuos electrónicos en Mendoza con logística inteligente, distribuciones de probabilidad y economía circular.
          </p>
          <div className={`hero-actions${heroVisible?" show":""}`}>
            <a href="#servicios" className="btn-primary">Ver servicios</a>
            <a href="#proceso" className="btn-ghost">
              Cómo funciona <span className="btn-ghost-arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats" ref={statsRef}>
        <div className="stats-grid">
          {STATS.map((s,i)=>(
            <div key={i} className={`stat-item${statsVisible?" show":""}`} style={{ transitionDelay:`${i*0.1}s` }}>
              <div className="stat-num">
                <AnimNum target={s.num} /><span className="stat-unit"> {s.unit}</span>
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="servicios" id="servicios" ref={servRef}>
        <div className="section-eyebrow">Lo que hacemos</div>
        <h2 className="section-title">Soluciones para el <em>ciclo completo</em></h2>
        <div className="servicios-grid">
          {SERVICIOS.map((s,i)=>(
            <div key={i} className={`servicio-card${servVisible?" show":""}`} style={{ transitionDelay:`${i*0.12}s` }}>
              <span className="servicio-icon">{s.icon}</span>
              <span className="servicio-tag">{s.tag}</span>
              <div className="servicio-titulo">{s.titulo}</div>
              <div className="servicio-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESO */}
      <section className="proceso" id="proceso" ref={pasosRef}>
        <div className="proceso-inner">
          <div>
            <div className="section-eyebrow">Cómo operamos</div>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Del retiro al <em>reporte</em>
            </h2>
          </div>
          <div className="proceso-steps">
            {PASOS.map((p,i)=>(
              <div key={i} className={`paso${pasosVisible?" show":""}`} style={{ transitionDelay:`${i*0.1}s` }}>
                <div className="paso-num">{p.n}</div>
                <div>
                  <div className="paso-titulo">{p.titulo}</div>
                  <div className="paso-desc">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
)   
    </>);}

    

    