import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

/**
 * ContactForm standalone component
 * Handles form validation, status management (idle, sending, success, error)
 * and POST request to Vercel Serverless Function /api/send-email (via Resend)
 */
export default function ContactForm({ isDarkMode = true, onSuccess, className = "" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("idle"); // "idle" | "sending" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      setErrorMessage("Tutti i campi obbligatori (Nome, Email, Messaggio) devono essere compilati.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        if (onSuccess) onSuccess(data);
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Impossibile inviare il messaggio. Riprova più tardi.");
      }
    } catch (err) {
      console.error("[ContactForm] Fetch error:", err);
      setStatus("error");
      setErrorMessage("Errore di connessione di rete. Verifica la tua connessione e riprova.");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setErrorMessage("");
  };

  if (status === "success") {
    return (
      <div
        className={`p-6 sm:p-8 rounded-2xl border text-center space-y-4 animate-fade-in ${
          isDarkMode
            ? "bg-white/[0.04] border-white/10 text-white"
            : "bg-white border-black/10 text-neutral-900 shadow-md"
        } ${className}`}
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
          <CheckCircle2 size={32} />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold">Messaggio inviato con successo!</h3>
          <p className={`text-xs max-w-sm mx-auto ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`}>
            Grazie per avermi scritto. Ti risponderò il prima possibile alla tua casella di posta.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 rounded-lg bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-semibold transition cursor-pointer"
        >
          Invia un altro messaggio
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 text-xs ${className}`}
      noValidate
    >
      {status === "error" && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/15 border border-red-500/25 text-red-500 text-xs animate-shake">
          <AlertCircle size={15} className="shrink-0" />
          <span className="flex-1">{errorMessage}</span>
        </div>
      )}

      <div>
        <label className={`block mb-1.5 font-medium ${isDarkMode ? "text-neutral-300" : "text-neutral-700"}`}>
          Nome <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Il tuo nome"
          disabled={status === "sending"}
          className={`w-full px-3 py-2 rounded-lg border outline-none transition ${
            isDarkMode
              ? "bg-white/5 border-white/10 text-white focus:border-[#007AFF] focus:bg-white/10"
              : "bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-[#007AFF] focus:bg-white"
          }`}
        />
      </div>

      <div>
        <label className={`block mb-1.5 font-medium ${isDarkMode ? "text-neutral-300" : "text-neutral-700"}`}>
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="tua@email.com"
          disabled={status === "sending"}
          className={`w-full px-3 py-2 rounded-lg border outline-none transition ${
            isDarkMode
              ? "bg-white/5 border-white/10 text-white focus:border-[#007AFF] focus:bg-white/10"
              : "bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-[#007AFF] focus:bg-white"
          }`}
        />
      </div>

      <div>
        <label className={`block mb-1.5 font-medium ${isDarkMode ? "text-neutral-300" : "text-neutral-700"}`}>
          Oggetto <span className="opacity-50 text-[10px]">(opzionale)</span>
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Oggetto della richiesta"
          disabled={status === "sending"}
          className={`w-full px-3 py-2 rounded-lg border outline-none transition ${
            isDarkMode
              ? "bg-white/5 border-white/10 text-white focus:border-[#007AFF] focus:bg-white/10"
              : "bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-[#007AFF] focus:bg-white"
          }`}
        />
      </div>

      <div>
        <label className={`block mb-1.5 font-medium ${isDarkMode ? "text-neutral-300" : "text-neutral-700"}`}>
          Messaggio <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          required
          placeholder="Scrivi qui il tuo messaggio..."
          disabled={status === "sending"}
          className={`w-full px-3 py-2 rounded-lg border outline-none transition resize-none ${
            isDarkMode
              ? "bg-white/5 border-white/10 text-white focus:border-[#007AFF] focus:bg-white/10"
              : "bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-[#007AFF] focus:bg-white"
          }`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#007AFF] hover:bg-[#0062CC] active:scale-98 disabled:opacity-50 text-white font-semibold transition cursor-pointer shadow-sm"
      >
        {status === "sending" ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>Invio in corso...</span>
          </>
        ) : (
          <>
            <Send size={14} />
            <span>Invia Messaggio</span>
          </>
        )}
      </button>
    </form>
  );
}
