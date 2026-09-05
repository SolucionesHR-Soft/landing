import { useEffect, useState } from 'react';

const GITHUB_ORG = process.env.NEXT_PUBLIC_GITHUB_ORG || 'HRDTech';

// Recorta el README a un fragmento legible en tarjeta (sin sintaxis markdown cruda).
function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[#>*_`-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function ReposSection() {
  const [repos, setRepos] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ok | error

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch(`https://api.github.com/orgs/${GITHUB_ORG}/repos?type=public&sort=updated&per_page=6`);
        if (!res.ok) throw new Error('github api error');
        const list = await res.json();

        const withReadme = await Promise.all(
          list.map(async (repo) => {
            let readmeExcerpt = '';
            try {
              const r = await fetch(`https://api.github.com/repos/${repo.full_name}/readme`, {
                headers: { Accept: 'application/vnd.github.raw' },
              });
              if (r.ok) {
                const text = await r.text();
                readmeExcerpt = stripMarkdown(text).slice(0, 220);
              }
            } catch (_) { /* README opcional: si falla, se omite */ }
            return {
              id: repo.id,
              nombre: repo.name,
              descripcion: repo.description,
              url: repo.html_url,
              readmeExcerpt,
            };
          })
        );

        if (active) { setRepos(withReadme); setStatus('ok'); }
      } catch (_) {
        if (active) setStatus('error');
      }
    }

    load();
    return () => { active = false; };
  }, []);

  return (
    <section id="repositorios" className="bg-paper text-ink py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="tag-label !text-ink/50 mb-2">código abierto</p>
        <h2 className="font-serif text-3xl mb-10">Repositorios públicos</h2>

        {status === 'loading' && <p className="text-ink/60">Consultando GitHub…</p>}
        {status === 'error' && (
          <p className="text-ink/60">
            No se pudo cargar el listado justo ahora. Puedes verlo directo en{' '}
            <a className="underline decoration-brass" href={`https://github.com/${GITHUB_ORG}`} target="_blank" rel="noopener noreferrer">
              github.com/{GITHUB_ORG}
            </a>.
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-8">
          {repos.map((r) => (
            <article key={r.id} className="border-t border-lineOnPaper pt-5">
              <h3 className="font-serif text-lg mb-1">{r.nombre}</h3>
              {r.descripcion && <p className="text-ink/70 text-sm mb-2">{r.descripcion}</p>}
              {r.readmeExcerpt && (
                <p className="tag-label !text-ink/60 leading-relaxed">{r.readmeExcerpt}…</p>
              )}
              <a href={r.url} target="_blank" rel="noopener noreferrer"
                 className="tag-label !text-ink inline-block mt-3 underline decoration-brass underline-offset-4">
                Ver repositorio
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
