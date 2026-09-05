import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ProductosSection() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from('productos_desarrollo')
      .select('id, nombre, descripcion, imagen_url, orden')
      .eq('publicado', true)
      .order('orden', { ascending: true })
      .then(({ data, error }) => {
        if (!active) return;
        if (!error) setProductos(data || []);
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <section id="en-desarrollo" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="tag-label mb-2">taller</p>
        <h2 className="font-serif text-3xl mb-10">En desarrollo ahora</h2>

        {loading && <p className="text-paper/60">Cargando…</p>}
        {!loading && productos.length === 0 && (
          <p className="text-paper/60">No hay productos en desarrollo visibles por ahora.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((p) => (
            <article key={p.id} className="blueprint-panel p-5">
              {p.imagen_url && (
                <img src={p.imagen_url} alt={p.nombre} className="w-full h-40 object-cover mb-4 opacity-90" loading="lazy" />
              )}
              <h3 className="font-serif text-xl mb-2">{p.nombre}</h3>
              <p className="text-paper/75 text-sm leading-relaxed">{p.descripcion}</p>
              <span className="tag-label inline-block mt-4">en construcción</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
