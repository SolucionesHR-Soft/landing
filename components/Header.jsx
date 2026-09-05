export default function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-ink/85 border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <a href="#inicio" className="font-serif text-xl tracking-tight">
          HRD <span className="text-brass italic">Soluciones</span>
        </a>
        <nav className="hidden sm:flex items-center gap-8 tag-label">
          <a href="#soluciones" className="hover:text-cyan transition-colors">soluciones</a>
          <a href="#en-desarrollo" className="hover:text-cyan transition-colors">en desarrollo</a>
          <a href="#repositorios" className="hover:text-cyan transition-colors">código abierto</a>
          <a href="#contacto" className="hover:text-cyan transition-colors">contacto</a>
        </nav>
      </div>
    </header>
  );
}
