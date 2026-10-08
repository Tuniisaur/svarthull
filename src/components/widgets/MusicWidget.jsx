import React from "react";
import { motion } from "framer-motion";
import { GlassSurface } from "../ui/glass-surface";
import { useAppStore } from "../../store/Appstore";
import { FiPlay, FiPause, FiSkipBack, FiSkipForward } from "react-icons/fi";

const EQUALIZER_BARS = [
  { keyframes: [0.35, 0.9, 0.45, 0.95, 0.4, 0.75, 0.35], resting: 0.35, duration: 0.72 },
  { keyframes: [0.5, 1.0, 0.35, 0.85, 0.55, 0.95, 0.5], resting: 0.6, duration: 0.58 },
  { keyframes: [0.3, 0.8, 0.55, 0.9, 0.35, 0.82, 0.3], resting: 0.4, duration: 0.68 },
  { keyframes: [0.4, 0.92, 0.3, 0.72, 0.5, 0.88, 0.4], resting: 0.5, duration: 0.54 },
];

// Apple Music Logo Icon (Double musical note)
const AppleMusicNoteIcon = ({ className = "w-3 h-3" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.99 3.01c-.13-.01-.26 0-.39.04L7.6 5.67C7.24 5.75 7 6.07 7 6.44v10.1c-.63-.33-1.37-.54-2.17-.54C2.71 16 1 17.57 1 19.5S2.71 23 4.83 23c2.09 0 3.79-1.53 3.84-3.44l.03-9.5 9.9-2.12v6.6c-.63-.33-1.37-.54-2.17-.54-2.12 0-3.83 1.57-3.83 3.5s1.71 3.5 3.83 3.5 3.83-1.57 3.83-3.5V3.7c0-.39-.28-.7-.66-.69z" />
  </svg>
);

// Apple Logo
const AppleLogoIcon = ({ className = "w-2.5 h-2.5" }) => (
  <svg viewBox="0 0 170 170" fill="currentColor" className={className}>
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.05-7.62-7.85-11.77-14.4-6.41-10.12-11.36-21.78-14.85-34.97-3.48-13.2-5.23-25.59-5.23-37.18 0-14.59 3.58-26.65 10.74-36.19 7.16-9.54 16.29-14.43 27.38-14.67 4.9 0 10.3 1.25 16.2 3.76 5.89 2.5 9.4 3.76 10.51 3.76 1.7 0 5.48-1.37 11.34-4.11 5.86-2.74 11.08-3.99 15.66-3.76 11.98.65 21.6 4.79 28.87 12.43-10.46 6.32-15.58 15.03-15.36 26.13.22 8.71 3.69 16.12 10.42 22.22 6.73 6.1 14.81 9.69 24.23 10.78-2.17 6.75-4.78 13.5-7.83 20.25zM119.22 31.84c0-7.39 2.61-14.39 7.83-20.99 5.22-6.6 11.75-10.63 19.59-12.09.22 1.09.33 2.18.33 3.27 0 7.39-2.73 14.61-8.17 21.65-5.45 7.04-12.08 11.05-19.91 12.03-.11-1.3-.17-2.6-.17-3.87z" />
  </svg>
);

export default function MusicWidget() {
  const isAudioPlaying = useAppStore((state) => state.isAudioPlaying);
  const toggleAudio = useAppStore((state) => state.toggleAudio);
  const nextTrack = useAppStore((state) => state.nextTrack);
  const prevTrack = useAppStore((state) => state.prevTrack);
  const currentTrack = useAppStore((state) => state.currentTrack);

  const trackCover = currentTrack?.img || currentTrack?.cover || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=80";

  return (
    <div className="w-[calc(100vw-32px)] max-w-[320px] sm:w-[320px] h-[162px] flex flex-col justify-between text-white p-3.5 select-none shrink-0 pointer-events-auto relative overflow-hidden transition-all duration-300 rounded-[22px] border border-white/20 backdrop-blur-2xl bg-black/40 shadow-[0_12px_36px_rgba(0,0,0,0.38),inset_0_1px_1px_rgba(255,255,255,0.22)]">
      <GlassSurface tint={0} radius={22} blur={10} chroma={0.25} className="absolute inset-0 -z-10" />

      {/* Apple Music Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-[6px] bg-gradient-to-tr from-[#FA2D48] via-[#FB3C5B] to-[#FF4E74] flex items-center justify-center shadow-xs">
            <AppleMusicNoteIcon className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-white/95 text-[12px] tracking-tight">Apple Music</span>
        </div>

        {/* Apple Music Animated Equalizer Spectrum */}
        <div 
          className="flex items-end gap-[3px] h-[15px] px-1.5 py-[1px] rounded-[6px] bg-white/[0.04] border border-white/10 shadow-xs"
          title={isAudioPlaying ? "Playing" : "Paused"}
        >
          {EQUALIZER_BARS.map((bar, i) => (
            <motion.span
              key={i}
              className="w-[2.5px] h-full rounded-full bg-gradient-to-t from-[#FA2D48] via-[#FB3C5B] to-[#FF6E89] origin-bottom shadow-[0_0_8px_rgba(250,45,72,0.4)]"
              animate={
                isAudioPlaying
                  ? {
                      scaleY: bar.keyframes,
                      opacity: 1,
                    }
                  : {
                      scaleY: bar.resting,
                      opacity: 0.45,
                    }
              }
              transition={
                isAudioPlaying
                  ? {
                      repeat: Infinity,
                      repeatType: "mirror",
                      duration: bar.duration,
                      ease: "easeInOut",
                    }
                  : {
                      duration: 0.35,
                      ease: "easeOut",
                    }
              }
            />
          ))}
        </div>
      </div>

      {/* Track Info & Artwork */}
      <div className="flex items-center gap-3 z-10 my-0.5">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-[0_6px_14px_rgba(0,0,0,0.35)] border border-white/15 group">
          <img
            src={trackCover}
            alt={currentTrack?.title || "Track"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150&auto=format&fit=crop&q=80";
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[13px] text-white truncate leading-snug">
            {currentTrack?.title || "No Track Selected"}
          </h3>
          <p className="text-[11.5px] text-white/65 truncate mt-0.5">
            {currentTrack?.artist || "Apple Music"}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded-[4px] bg-white/15 text-white/90 uppercase tracking-wider font-mono">
              Lossless
            </span>
            <span className="text-[8.5px] font-medium px-1.5 py-0.5 rounded-[4px] bg-[#FA2D48]/20 text-[#FF5A73] uppercase tracking-wider font-mono">
              Dolby Atmos
            </span>
          </div>
        </div>
      </div>

      {/* Playback Controls & Apple Branding */}
      <div className="flex items-center justify-between z-10 pt-1.5 border-t border-white/10">
        <div className="flex items-center gap-1 text-[10.5px] text-white/50 font-medium">
          <AppleLogoIcon className="w-2.5 h-2.5 opacity-60" />
          <span>Now Playing</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevTrack}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-white/85 hover:text-white transition cursor-pointer border-0"
            title="Previous"
          >
            <FiSkipBack size={12} />
          </button>
          <button
            onClick={toggleAudio}
            className="w-8 h-8 rounded-full bg-[#FA2D48] hover:bg-[#E02636] active:scale-95 flex items-center justify-center text-white shadow-[0_2px_10px_rgba(250,45,72,0.45)] transition cursor-pointer border-0"
            title={isAudioPlaying ? "Pause" : "Play"}
          >
            {isAudioPlaying ? <FiPause size={13} className="fill-white" /> : <FiPlay size={13} className="fill-white ml-0.5" />}
          </button>
          <button
            onClick={nextTrack}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-white/85 hover:text-white transition cursor-pointer border-0"
            title="Next"
          >
            <FiSkipForward size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
