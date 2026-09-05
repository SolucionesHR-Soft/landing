import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const initial = { nombre: '', email: '', mensaje: '', empresa: '' };

export default function ContactForm() {
  const [form, setForm] = useState(initial);
  const [honeypot, setHoneypot] = useState(''); // campo trampa anti-bots, invisible para humanos
  const [state, setState] = useState('idle'); // idle | sending | ok | error

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (honeypot) return; // un bot rellenó el campo trampa: descartar en silencio

    setState('sending');
    const { error } = await supabase.from('contactos').insert([{
      nombre: form.nombre,
      email: form.email,
      empresa: form.empresa || null,
      mensaje: form.mensaje,
    }]);

    if (error) { setState('error'); return; }
    setState('ok');
    setForm(initial);
  }

  if (state === 'ok') {
    return (
      <div className="blueprint-panel p-6">
        <p className="font-serif text-xl mb-1">Mensaje recibido.</p>
        <p className="text-paper/70 text-sm">Te contactamos en las próximas horas.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="blueprint-panel p-6 grid gap-4">
      <div>
        <label htmlFor="nombre" className="tag-label block mb-1">nombre</label>
        <input id="nombre" required value={form.nombre} onChange={update('nombre')}
          className="w-full bg-transparent border border-line px-3 py-2 focus:border-cyan outline-none" />
      </div>
      <div>
        <label htmlFor="empresa" className="tag-label block mb-1">empresa (opcional)</label>
        <input id="empresa" value={form.empresa} onChange={update('empresa')}
          className="w-full bg-transparent border border-line px-3 py-2 focus:border-cyan outline-none" />
      </div>
      <div>
        <label htmlFor="email" className="tag-label block mb-1">correo</label>
        <input id="email" type="email" required value={form.email} onChange={update('email')}
          className="w-full bg-transparent border border-line px-3 py-2 focus:border-cyan outline-none" />
      </div>
      <div>
        <label htmlFor="mensaje" className="tag-label block mb-1">cuéntanos tu proyecto</label>
        <textarea id="mensaje" required rows={4} value={form.mensaje} onChange={update('mensaje')}
          className="w-full bg-transparent border border-line px-3 py-2 focus:border-cyan outline-none" />
      </div>

      {/* Honeypot: oculto visualmente y del lector de pantalla, solo un bot lo completaría */}
      <input type="text" tabIndex={-1} autoComplete="off" value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-[9999px]" aria-hidden="true" />

      <button type="submit" disabled={state === 'sending'}
        className="justify-self-start px-5 py-3 bg-brass text-ink font-medium hover:bg-brass/90 transition-colors disabled:opacity-60">
        {state === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
      </button>

      {state === 'error' && (
        <p className="text-cyan text-sm">No se pudo enviar. Intenta de nuevo en un momento.</p>
      )}
    </form>
  );
}
