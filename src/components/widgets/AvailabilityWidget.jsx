import React from "react";
import { GlassSurface } from "../ui/glass-surface";
import { useAppStore } from "../../store/Appstore";
import { FiCheckCircle, FiClock, FiSend, FiMapPin } from "react-icons/fi";
import { Sparkles } from "lucide-react";
import Mail from "../../app/Mail";

export default function AvailabilityWidget() {
  const openApp = useAppStore((state) => state.openApp);

  const handleOpenContact = () => {
    openApp("Contact Me", <Mail />);
  };

  return (
    <div className="w-[calc(100vw-32px)] max-w-[320px] sm:w-[320px] h-[162px] flex flex-col justify-between text-white p-3.5 select-none shrink-0 pointer-events-auto relative overflow-hidden transition-all duration-300 rounded-[22px] border border-white/20 backdrop-blur-2xl bg-black/40 shadow-[0_12px_36px_rgba(0,0,0,0.38),inset_0_1px_1px_rgba(255,255,255,0.22)]">
      <GlassSurface tint={0} radius={22} blur={10} chroma={0.25} className="absolute inset-0 -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-[6px] bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-xs">
            <FiCheckCircle className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-white/95 text-[12px] tracking-tight">Work Availability</span>
        </div>

        {/* Apple Style Status Indicator Pill */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10B981]"></span>
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold tracking-tight">Available</span>
        </div>
      </div>

      {/* Info Details */}
      <div className="space-y-1.5 z-10 my-0.5">
        <div className="flex items-center justify-between text-[11.5px] text-white/85">
          <div className="flex items-center gap-1.5">
            <FiMapPin size={12} className="text-amber-400" />
            <span>Italy (CET / UTC+1)</span>
          </div>
          <span className="text-[10.5px] text-white/50 font-medium">Remote Worldwide</span>
        </div>

        <div className="flex items-center justify-between text-[11.5px] text-white/85">
          <div className="flex items-center gap-1.5">
            <FiClock size={12} className="text-sky-400" />
            <span>Response Time</span>
          </div>
          <span className="text-emerald-400 font-semibold text-[11px]">&lt; 24 Hours</span>
        </div>
      </div>

      {/* Apple Style Action Footer */}
      <div className="flex items-center justify-between pt-1.5 border-t border-white/10 z-10">
        <div className="flex items-center gap-1 text-[10.5px] text-white/55 font-medium">
          <Sparkles size={11} className="text-amber-400" />
          <span>Full-Stack & 3D Web</span>
        </div>

        <button
          onClick={handleOpenContact}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0071E3] hover:bg-[#1A8FFF] hover:scale-105 hover:shadow-[0_4px_16px_rgba(0,113,227,0.6)] active:scale-95 text-white text-[11px] font-semibold shadow-[0_2px_8px_rgba(0,113,227,0.35)] transition-all duration-150 border-0"
        >
          <FiSend size={10} />
          <span>Contact</span>
        </button>
      </div>
    </div>
  );
}
