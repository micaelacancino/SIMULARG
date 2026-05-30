import { useState, useEffect, useRef } from "react";
import "../css/nosotros.css";

const VALORES = [
  { icon:"🌱", titulo:"Sostenibilidad", desc:"Cada kg de e-waste que gestionamos es una reducción directa en la contaminación del suelo y napas de Mendoza." },
  { icon:"🔬", titulo:"Rigor científico", desc:"Usamos modelos estocásticos reales: distribuciones uniformes, Poisson y exponencial para simular la operación." },
  { icon:"🤝", titulo:"Economía circular", desc:"El 93% de los equipos que recibimos encuentra una segunda vida, ya sea como material reciclado o equipo reacondicionado." },
  { icon:"📍", titulo:"Enfoque local", desc:"Operamos en Mendoza, conocemos sus zonas, sus rutas y sus condiciones climáticas adversas que afectan la logística." },
];


function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}
 
export default function SobreNosotros() {
  const [scrolled, setScrolled] = useState(false);
  const [heroRef, heroV] = useInView(0.01);
  const [valRef, valV] = useInView();
  const [equipRef, equipV] = useInView();
  const [hitosRef, hitosV] = useInView();
  const [distRef, distV] = useInView();
 
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
 
return (
     <>
     {/* HERO */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg" />
        <div className="hero-grain" />
        <div className="hero-deco">R</div>
        <div className="hero-content">
          <div className={`hero-eyebrow${heroV?" show":""}`}>Sobre nosotros</div>
          <h1 className={`hero-title${heroV?" show":""}`}>
            Un equipo que<br/>
            cree en el<br/>
            <em>e-waste cero.</em>
          </h1>
          <p className={`hero-desc${heroV?" show":""}`}>
            Somos seis estudiantes de Ingeniería en Sistemas de Información (UTN-FRT) desarrollando un sistema de simulación estocástica para optimizar la gestión de residuos electrónicos en Mendoza.
          </p>
        </div>
      </section>
 
      {/* VALORES */}
      <section className="valores" id="valores" ref={valRef}>
        <div className="section-eyebrow">Lo que nos mueve</div>
        <h2 className="section-title">Principios que guían <em>cada decisión</em></h2>
        <div className="valores-grid">
          {VALORES.map((v,i)=>(
            <div key={i} className={`valor-card${valV?" show":""}`} style={{ transitionDelay:`${i*0.1}s` }}>
              <span className="valor-icon">{v.icon}</span>
              <div className="valor-titulo">{v.titulo}</div>
              <div className="valor-desc">{v.desc}</div>
            </div>
          ))}
        </div>
      </section>
   </>
);
}
















  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  











  

  
  
  
  
  
  

  
  
  
  
  
  
  
  
  





































































































