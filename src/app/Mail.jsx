import React, { useState, useRef } from "react";
import { useAppStore } from "../store/Appstore";
import {
  Send,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  AtSign,
  User,
  Sparkles
} from "lucide-react";

// Traffic lights component inside Apple Mail Titlebar
const TrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);

  return (
    <div className="flex items-center gap-2 group mr-3 shrink-0">
      <button
        type="button"
        className="w-3 h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] transition-all duration-150 shadow-sm border-0 p-0"
        onClick={() => close(windowId)}
        title="Close"
      >
        <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <button
        type="button"
        className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all duration-150 shadow-sm border-0 p-0"
        onClick={() => minimize(windowId)}
        title="Minimize"
      >
        <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <div
        className="w-3 h-3 bg-[#28c840] opacity-35 rounded-full cursor-not-allowed flex items-center justify-center shadow-sm"
        title="Maximize disabled"
      />
    </div>
  );
};

export default function ContactMe({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cc: "",
    subject: "",
    message: ""
  });

  const [showCc, setShowCc] = useState(false);
  const [status, setStatus] = useState("idle"); // "idle" | "sending" | "sent"
  const [copiedEmail, setCopiedEmail] = useState(false);

  const textareaRef = useRef(null);
  const targetEmail = "svarthulldev@proton.me";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(targetEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    setStatus("sending");

    setTimeout(() => {
      setStatus("sent");
      const mailtoSubject = encodeURIComponent(
        formData.subject.trim() || `Inquiry from ${formData.name.trim()}`
      );
      const mailtoBody = encodeURIComponent(
        `From: ${formData.name} <${formData.email}>\n\nMessage:\n${formData.message}`
      );
      window.open(`mailto:${targetEmail}?subject=${mailtoSubject}&body=${mailtoBody}`, "_blank");
    }, 700);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      cc: "",
      subject: "",
      message: ""
    });
    setStatus("idle");
  };

  // Keyboard shortcut: Cmd/Ctrl + Enter to send
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.message.trim();

  return (
    <div
      className={`apple-mail-window flex flex-col h-full w-full select-none text-[13px] rounded-xl overflow-hidden font-sans transition-colors duration-150 ${
        isDarkMode ? "bg-[#1E1E1E] text-[#E5E5E7]" : "bg-white text-[#1D1D1F]"
      }`}
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}
      onKeyDown={handleKeyDown}
    >
      {/* 1. Apple Mail Unified Titlebar & Toolbar */}
      <header
        className={`window-drag-handle h-11 sm:h-12 flex items-center justify-between px-2.5 sm:px-4 shrink-0 border-b transition-colors duration-150 select-none ${
          isDarkMode
            ? "border-white/10 bg-[#252526]/90 backdrop-blur-2xl text-white"
            : "border-black/[0.08] bg-[#F2F2F7]/90 backdrop-blur-2xl text-gray-800"
        }`}
      >
        {/* Left: Traffic Lights & Title */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <TrafficLights windowId={windowId} />
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="font-semibold text-xs sm:text-[13px] tracking-tight">New Message</span>
            <span
              className={`hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full font-medium ${
                isDarkMode ? "bg-white/10 text-white/60" : "bg-black/5 text-gray-500"
              }`}
            >
              Apple Mail
            </span>
          </div>
        </div>

        {/* Right: macOS Mail Action Toolbar */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Copy Target Address */}
          <button
            type="button"
            onClick={handleCopyEmail}
            className={`p-1.5 rounded-md transition cursor-pointer border border-transparent ${
              isDarkMode
                ? "hover:bg-white/10 text-gray-400 hover:text-white"
                : "hover:bg-black/5 text-gray-500 hover:text-gray-900"
            }`}
            title={`Copy ${targetEmail}`}
          >
            {copiedEmail ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>

          {/* Discard Draft */}
          <button
            type="button"
            onClick={handleReset}
            className={`p-1.5 rounded-md transition cursor-pointer border border-transparent ${
              isDarkMode
                ? "hover:bg-white/10 text-gray-400 hover:text-red-400"
                : "hover:bg-black/5 text-gray-500 hover:text-red-600"
            }`}
            title="Discard Draft"
          >
            <Trash2 size={14} />
          </button>

          {/* Primary Send Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || status === "sending"}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 ml-0.5 sm:ml-1 rounded-md bg-[#007AFF] hover:bg-[#0062CC] active:scale-98 disabled:opacity-40 disabled:hover:bg-[#007AFF] text-white text-xs font-semibold shadow-xs transition cursor-pointer border-0"
            title="Send Message (⌘ + Enter)"
          >
            <Send size={12} className={status === "sending" ? "animate-pulse" : ""} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </header>

      {/* Sending Progress Bar Indicator */}
      {status === "sending" && (
        <div className="h-0.5 w-full bg-[#007AFF]/20 overflow-hidden shrink-0">
          <div className="h-full bg-[#007AFF] w-1/2 animate-[spin_1.2s_linear_infinite]" />
        </div>
      )}

      {/* 2. Main Apple Mail Body */}
      {status === "sent" ? (
        /* Sent Confirmation Screen */
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center space-y-4 my-auto select-none animate-fade-in overflow-y-auto">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shadow-inner">
            <CheckCircle2 size={32} />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">Message Delivered</h2>
            <p className={`text-xs max-w-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Your message was prepared and delivered to <span className="font-semibold text-[#007AFF]">{targetEmail}</span>.
            </p>
          </div>

          {/* Sent Summary Card */}
          <div
            className={`w-full max-w-md p-3.5 sm:p-4 rounded-xl border text-left text-xs space-y-2 ${
              isDarkMode ? "bg-white/[0.04] border-white/10" : "bg-[#F9F9FB] border-black/10"
            }`}
          >
            <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
              <span className="text-gray-400">Subject:</span>
              <span className="font-semibold truncate max-w-[200px] sm:max-w-[240px]">{formData.subject || "No Subject"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">From:</span>
              <span className="truncate max-w-[200px] sm:max-w-[240px]">{formData.name} &lt;{formData.email}&gt;</span>
            </div>
          </div>

          <div className="pt-2 sm:pt-3 flex flex-wrap gap-2 sm:gap-2.5 justify-center">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-medium transition cursor-pointer border-0 shadow-sm"
            >
              <RotateCcw size={13} />
              <span>Compose New</span>
            </button>
            <button
              type="button"
              onClick={() => window.open(`mailto:${targetEmail}`, "_blank")}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                isDarkMode
                  ? "border-white/15 bg-white/5 hover:bg-white/10 text-white"
                  : "border-black/10 bg-white hover:bg-gray-50 text-gray-800 shadow-2xs"
              }`}
            >
              <ExternalLink size={13} />
              <span>Native Mail</span>
            </button>
          </div>
        </div>
      ) : (
        /* Apple Mail Compose View */
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Header Rows (To, Cc, From, Subject) */}
          <div className={`border-b shrink-0 text-xs ${isDarkMode ? "border-white/10" : "border-black/[0.08]"}`}>
            {/* Row 1: To */}
            <div className="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 border-b border-black/[0.04] dark:border-white/[0.04]">
              <span className="w-12 sm:w-14 text-right pr-2 sm:pr-3 text-gray-400 dark:text-gray-500 font-medium select-none shrink-0">
                To:
              </span>
              <div className="flex-1 flex items-center gap-2 flex-wrap min-w-0">
                {/* Recipient Token */}
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    isDarkMode
                      ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                      : "bg-[#007AFF]/10 text-[#007AFF] border-[#007AFF]/25"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Svart Hull</span>
                  <span className="opacity-70 hidden sm:inline">&lt;{targetEmail}&gt;</span>
                </div>
              </div>

              {!showCc && (
                <button
                  type="button"
                  onClick={() => setShowCc(true)}
                  className="text-[11px] text-[#007AFF] hover:underline cursor-pointer select-none shrink-0 ml-2"
                >
                  Cc/Bcc
                </button>
              )}
            </div>

            {/* Row 2: Cc (Collapsible) */}
            {showCc && (
              <div className="flex items-center px-3 sm:px-4 py-2 border-b border-black/[0.04] dark:border-white/[0.04]">
                <span className="w-12 sm:w-14 text-right pr-2 sm:pr-3 text-gray-400 dark:text-gray-500 font-medium select-none shrink-0">
                  Cc:
                </span>
                <input
                  type="email"
                  value={formData.cc}
                  onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
                  placeholder="Optional Cc address..."
                  className="flex-1 bg-transparent border-none outline-none text-xs p-0 text-inherit placeholder:text-gray-400"
                />
              </div>
            )}

            {/* Row 3: From (Sender Name & Email) */}
            <div className="flex items-center px-3 sm:px-4 py-2 border-b border-black/[0.04] dark:border-white/[0.04]">
              <span className="w-12 sm:w-14 text-right pr-2 sm:pr-3 text-gray-400 dark:text-gray-500 font-medium select-none shrink-0">
                From:
              </span>
              <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2 min-w-0">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <User size={13} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name (e.g. John Doe)"
                    className="w-full bg-transparent border-none outline-none text-xs p-0 text-inherit placeholder:text-gray-400"
                  />
                </div>
                <div className="hidden sm:inline text-gray-300 dark:text-gray-600">|</div>
                <div className="flex items-center gap-1.5 flex-1 min-w-0 border-t sm:border-t-0 pt-1 sm:pt-0 border-black/[0.04] dark:border-white/[0.04]">
                  <AtSign size={13} className="text-gray-400 shrink-0" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Your Email (e.g. john@example.com)"
                    className="w-full bg-transparent border-none outline-none text-xs p-0 text-inherit placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Row 4: Subject */}
            <div className="flex items-center px-3 sm:px-4 py-2 sm:py-2.5">
              <span className="w-12 sm:w-14 text-right pr-2 sm:pr-3 text-gray-400 dark:text-gray-500 font-medium select-none shrink-0">
                Subject:
              </span>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Subject..."
                className="flex-1 bg-transparent border-none outline-none text-xs p-0 text-inherit font-medium placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* 3. Apple Mail Writing Canvas (Message Body) */}
          <div className="flex-1 p-3.5 sm:p-6 overflow-y-auto flex flex-col min-h-0">
            <textarea
              ref={textareaRef}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="flex-1 w-full bg-transparent border-none outline-none resize-none leading-relaxed text-[13px] sm:text-[14px] font-sans"
              style={{ minHeight: "140px" }}
            />

            {/* Apple Mail Signature preview */}
            <div className="pt-4 border-t border-dashed border-black/10 dark:border-white/10 mt-4 text-xs text-gray-400/80 select-none">
              <p>--</p>
              <p>Sent from macOS Web Simulator</p>
            </div>
          </div>

          {/* 4. Apple Mail Footer Bar */}
          <footer
            className={`h-9 px-4 flex items-center justify-between border-t shrink-0 text-[11px] select-none ${
              isDarkMode ? "border-white/10 bg-[#252526]/50 text-gray-400" : "border-black/[0.08] bg-[#F9F9FB] text-gray-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Direct delivery to {targetEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Sparkles size={11} className="text-amber-400" />
              <span className="hidden sm:inline">Press ⌘ + Enter to send</span>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
