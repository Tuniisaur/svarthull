import { Resend } from "resend";

export default async function handler(req, res) {
  // Consenti solo richieste POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`,
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[send-email] Missing RESEND_API_KEY environment variable.");
    return res.status(500).json({
      success: false,
      error: "Server configuration error: RESEND_API_KEY non configurata.",
    });
  }

  try {
    const { name, email, subject, message, _gotcha, _ts } = req.body || {};

    // Controllo antispam 1: Honeypot field (se compilato da un bot, rifiuta silenziosamente)
    if (_gotcha && String(_gotcha).trim().length > 0) {
      console.warn("[send-email] Spam bot intercettato tramite honeypot.");
      return res.status(200).json({
        success: true,
        message: "Email inviata con successo!",
      });
    }

    // Controllo antispam 2: Invio troppo rapido (timestamp bot check: < 2.5s)
    if (_ts && typeof _ts === "number") {
      const timeElapsed = Date.now() - _ts;
      if (timeElapsed < 2500) {
        console.warn("[send-email] Invio sospetto troppo rapido:", timeElapsed, "ms");
        return res.status(200).json({
          success: true,
          message: "Email inviata con successo!",
        });
      }
    }

    // Validazione campi obbligatori
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Campi obbligatori mancanti: nome, email e messaggio sono richiesti.",
      });
    }

    // Validazione base formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: "Indirizzo email non valido.",
      });
    }

    const resend = new Resend(apiKey);

    // Destinatario predefinito del portfolio o da variabile d'ambiente
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || "svarthulldev@proton.me";
    // Mittente Resend (di default onboarding@resend.dev per domini non verificati, o dominio verificato personalizzato)
    const senderEmail = process.env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

    const mailSubject = subject?.trim()
      ? `[Portfolio Contact] ${subject.trim()}`
      : `[Portfolio Contact] Nuovo messaggio da ${name.trim()}`;

    // Testo puro
    const plainText = `Hai ricevuto un nuovo messaggio dal form di contatto di svarthull.dev:

Nome: ${name.trim()}
Email: ${email.trim()}
Oggetto: ${subject?.trim() || "Nessun oggetto"}

Messaggio:
${message.trim()}

---
Inviato tramite Vercel Serverless Function & Resend.`;

    // HTML pulito, professionale e privo di badge o pubblicità
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${mailSubject}</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f8; color: #1f2937;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
    <div style="background-color: #111827; padding: 20px 24px; color: #ffffff;">
      <h2 style="margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -0.01em;">Nuovo Messaggio dal Portfolio</h2>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #9ca3af;">svarthull.dev</p>
    </div>
    
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; width: 90px; vertical-align: top;"><strong>Mittente:</strong></td>
          <td style="padding: 8px 0; color: #111827; font-weight: 500;">${escapeHtml(name.trim())}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; vertical-align: top;"><strong>Email:</strong></td>
          <td style="padding: 8px 0; color: #111827;"><a href="mailto:${escapeHtml(email.trim())}" style="color: #2563eb; text-decoration: none;">${escapeHtml(email.trim())}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; vertical-align: top;"><strong>Oggetto:</strong></td>
          <td style="padding: 8px 0; color: #111827;">${escapeHtml(subject?.trim() || "Nessun oggetto")}</td>
        </tr>
      </table>

      <div style="margin-top: 16px; padding: 18px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #f3f4f6;">
        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Messaggio:</p>
        <div style="font-size: 14px; line-height: 1.6; color: #1f2937; white-space: pre-wrap;">${escapeHtml(message.trim())}</div>
      </div>

      <div style="margin-top: 24px; text-align: left;">
        <a href="mailto:${escapeHtml(email.trim())}?subject=${encodeURIComponent("Re: " + (subject?.trim() || "Il tuo messaggio"))}" style="display: inline-block; background-color: #007aff; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">Rispondi direttamente</a>
      </div>
    </div>

    <div style="padding: 16px 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center;">
      Inviato tramite il form di contatto di <strong>svarthull.dev</strong>
    </div>
  </div>
</body>
</html>
`;

    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: [recipientEmail],
      replyTo: email.trim(),
      subject: mailSubject,
      text: plainText,
      html: htmlContent,
    });

    if (error) {
      console.error("[send-email] Resend error:", error);
      return res.status(400).json({
        success: false,
        error: error.message || "Errore durante l'invio dell'email con Resend.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email inviata con successo!",
      id: data?.id,
    });
  } catch (err) {
    console.error("[send-email] Server error:", err);
    return res.status(500).json({
      success: false,
      error: "Errore interno del server durante l'invio.",
    });
  }
}

function escapeHtml(string) {
  if (!string) return "";
  return String(string)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
