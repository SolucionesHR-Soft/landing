export default function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row justify-between gap-4 tag-label !text-paper/50">
        <span>HRD Soluciones HR — {new Date().getFullYear()}</span>
        <a href="https://github.com/HRDTech" target="_blank" rel="noopener noreferrer" className="hover:text-cyan">github.com/HRDTech</a>
      </div>
    </footer>
  );
}
