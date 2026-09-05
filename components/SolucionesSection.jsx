import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SolucionesSection() {
  const [soluciones, setSoluciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from('soluciones')
      .select('id, nombre, descripcion, imagen_url, url, orden')
      .eq('publicado', true)
      .order('orden', { ascending: true })
      .then(({ data, error }) => {
        if (!active) return;
        if (!error) setSoluciones(data || []);
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <section id="soluciones" className="bg-paper text-ink py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="tag-label !text-ink/50 mb-2">catálogo</p>
        <h2 className="font-serif text-3xl mb-10">Soluciones que ya están en uso</h2>

        {loading && <p className="text-ink/60">Cargando catálogo…</p>}
        {!loading && soluciones.length === 0 && (
          <p className="text-ink/60">Todavía no hay soluciones publicadas. Vuelve pronto.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {soluciones.map((s) => (
            <article key={s.id} className="blueprint-panel p-5 bg-paper" style={{ '--panel-border': 'rgba(20,22,28,0.14)' }}>
              {s.imagen_url && (
                <img src={s.imagen_url} alt={s.nombre} className="w-full h-40 object-cover mb-4" loading="lazy" />
              )}
              <h3 className="font-serif text-xl mb-2">{s.nombre}</h3>
              <p className="text-ink/75 text-sm leading-relaxed">{s.descripcion}</p>
              {s.url && (
                <a href={s.url} target="_blank" rel="noopener noreferrer"
                   className="tag-label !text-ink inline-block mt-4 underline decoration-brass underline-offset-4">
                  Ver proyecto
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
