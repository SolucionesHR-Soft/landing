// Edge Function: notify-telegram
// Se dispara por un Database Webhook en INSERT sobre la tabla `contactos`.
// Deploy: supabase functions deploy notify-telegram
// Secretos requeridos (supabase secrets set):
//   TELEGRAM_BOT_TOKEN  -> token del bot (hablar con @BotFather)
//   TELEGRAM_CHAT_ID    -> id del chat/canal donde llegan los avisos

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record; // fila insertada en `contactos`

    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!botToken || !chatId) {
      return new Response('Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID', { status: 500 });
    }

    const texto =
      `Nuevo contacto desde la landing\n\n` +
      `Nombre: ${record.nombre}\n` +
      `Email: ${record.email}\n` +
      (record.empresa ? `Empresa: ${record.empresa}\n` : '') +
      `Mensaje: ${record.mensaje}`;

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: texto }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new Response(`Error de Telegram: ${errText}`, { status: 502 });
    }

    return new Response('ok', { status: 200 });
  } catch (err) {
    return new Response(`Error interno: ${err.message}`, { status: 500 });
  }
});
