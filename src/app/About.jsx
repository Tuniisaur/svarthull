import React from "react";
import { useAppStore } from "../store/Appstore";
import { Mail, Instagram, ExternalLink } from "lucide-react";

export default function About() {
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  const contactEmail = "svarthulldev@proton.me";

  return (
    <div
      className={`h-full w-full flex flex-col overflow-y-auto select-none transition-colors duration-150 ${isDarkMode ? "bg-[#1E1E1E] text-white" : "bg-[#F6F6F8] text-neutral-900"
        }`}
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}
    >
      <div className="max-w-2xl mx-auto w-full p-4 sm:p-7 space-y-5 sm:space-y-6">
        {/* 1. Profile & Bio Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
          <div className="shrink-0 relative">
            <img
              src="/icons/sh.jpg"
              alt="Svart Hull"
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-lg ring-4 ${isDarkMode ? "ring-white/10 border border-white/15" : "ring-white border border-neutral-200"
                }`}
            />
            <span
              className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1E1E1E]"
              title="Available"
            />
          </div>

          <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start">
            {/* Mobile: Available for Projects in alto a Svart Hull */}
            <span className="sm:hidden text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available for Projects
            </span>

            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Svart Hull</h1>
              {/* Desktop: accanto a Svart Hull */}
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Available for Projects
              </span>
            </div>
            <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>
              Web Developer
            </p>
            <p className={`text-xs mt-2 max-w-md ${isDarkMode ? "text-neutral-300" : "text-neutral-600"}`}>
              Sites that hit different.
            </p>
          </div>
        </div>

        {/* 2. Developer Specifications Card */}
        <div
          className={`rounded-xl border p-4 sm:p-5 space-y-2.5 text-xs ${isDarkMode ? "bg-white/[0.04] border-white/10" : "bg-white border-black/10 shadow-xs"
            }`}
        >
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3">
            Developer Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex justify-between sm:justify-start gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
              <span className={`w-24 shrink-0 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>Role</span>
              <span className="font-medium text-right sm:text-left">Full-Stack & Creative</span>
            </div>
            <div className="flex justify-between sm:justify-start gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
              <span className={`w-24 shrink-0 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>Location</span>
              <span className="font-medium text-right sm:text-left">Italy (Worldwide)</span>
            </div>
            <div className="flex justify-between sm:justify-start gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
              <span className={`w-24 shrink-0 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>Experience</span>
              <span className="font-medium text-right sm:text-left">4+ Years</span>
            </div>
            <div className="flex justify-between sm:justify-start gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
              <span className={`w-24 shrink-0 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>Core Stack</span>
              <span className="font-medium text-right sm:text-left">React, Next.js, Node</span>
            </div>
            <div className="flex justify-between sm:justify-start gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
              <span className={`w-24 shrink-0 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>Specialty</span>
              <span className="font-medium text-right sm:text-left">3D & WebGL Shaders</span>
            </div>
            <div className="flex justify-between sm:justify-start gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
              <span className={`w-24 shrink-0 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>Contact</span>
              <a href={`mailto:${contactEmail}`} className="font-medium text-[#007AFF] hover:underline text-right sm:text-left">
                {contactEmail}
              </a>
            </div>
          </div>
        </div>



        {/* 5. Direct Connect Buttons */}
        <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start pt-1">
          <a
            href={`mailto:${contactEmail}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-semibold transition shadow-xs border-0"
          >
            <Mail size={13} className="text-white" />
            <span className="text-white">Email Me</span>
          </a>
          <button
            type="button"
            onClick={() => window.open("https://www.instagram.com/svarthull.dev/", "_blank")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${isDarkMode
                ? "border-white/15 bg-white/5 hover:bg-gradient-to-r hover:from-purple-600/30 hover:via-pink-600/30 hover:to-amber-500/30 hover:border-pink-500/40 hover:shadow-[0_4px_16px_rgba(236,72,153,0.25)] text-white"
                : "border-black/10 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:via-pink-50 hover:to-amber-50 hover:border-pink-400 hover:text-pink-600 text-neutral-800 shadow-2xs hover:shadow-md"
              }`}
          >
            <Instagram size={12} className="transition-transform group-hover:scale-110" />
            <span>Instagram</span>
            <ExternalLink size={11} className="opacity-60" />
          </button>
        </div>

        {/* Footer */}
        <div className="text-center pt-3 border-t border-black/5 dark:border-white/5">
          <p className="text-neutral-400 dark:text-neutral-500 text-[11px]">
            © 2026 Svart Hull. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
