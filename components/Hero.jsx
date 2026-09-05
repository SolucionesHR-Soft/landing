export default function Hero() {
  return (
    <section id="inicio" className="mx-auto max-w-6xl px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <p className="tag-label mb-4">software · inteligencia artificial · hardware</p>
        <h1 className="font-serif text-4xl sm:text-5xl leading-tight">
          Construimos el <em className="italic">puente</em> entre una idea y el sistema que la sostiene.
        </h1>
        <p className="mt-6 text-lg text-paper/80 max-w-md">
          Diseñamos y desarrollamos aplicaciones, agentes de IA y dispositivos a medida —
          de la placa electrónica al servidor, en un mismo equipo.
        </p>
        <div className="mt-8 flex gap-4">
          <a href="#contacto"
             className="px-5 py-3 bg-brass text-ink font-medium hover:bg-brass/90 transition-colors">
            Hablar de tu proyecto
          </a>
          <a href="#soluciones"
             className="px-5 py-3 border border-line hover:border-cyan transition-colors">
            Ver soluciones
          </a>
        </div>
      </div>

      {/* Diagrama esquemático: Software / IA / Hardware convergen en HRD.
          Un único gesto de entrada (las líneas se dibujan una vez), respeta reduced-motion. */}
      <svg viewBox="0 0 400 300" className="w-full h-auto" role="img" aria-label="Diagrama: software, inteligencia artificial y hardware convergiendo en un núcleo HRD">
        <g fill="none" stroke="#4FA8C9" strokeWidth="1.5">
          <path className="trace-draw" style={{ animationDelay: '0.1s' }} d="M40,60 H140 Q160,60 160,80 V130" />
          <path className="trace-draw" style={{ animationDelay: '0.3s' }} d="M40,150 H200 V145" />
          <path className="trace-draw" style={{ animationDelay: '0.5s' }} d="M40,240 H140 Q160,240 160,220 V170" />
        </g>
        <g fontFamily="IBM Plex Mono" fontSize="11" fill="#ECE8DE">
          <circle cx="30" cy="60" r="4" fill="#C08A2E" />
          <text x="14" y="45">software</text>

          <circle cx="30" cy="150" r="4" fill="#C08A2E" />
          <text x="10" y="135">IA</text>

          <circle cx="30" cy="240" r="4" fill="#C08A2E" />
          <text x="14" y="260">hardware</text>
        </g>
        <rect x="160" y="130" width="80" height="40" fill="#14161C" stroke="#C08A2E" strokeWidth="1.5" />
        <text x="200" y="154" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="12" fill="#C08A2E">HRD</text>
      </svg>
    </section>
  );
}
