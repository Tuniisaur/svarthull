// src/components/TopBar.jsx
import React, { useEffect, useState } from "react";
import { useAppStore } from "../store/Appstore";
import About from "../app/About";
import Finder from "../app/Finder";
import Mail from "../app/Mail";

// Svart Hull Brand Logo
const BrandLogo = () => (
  <img 
    src="/icons/logo.svg" 
    alt="Svart Hull Logo" 
    className="w-[16px] h-[16px] object-contain select-none pointer-events-none filter drop-shadow-sm" 
  />
);

// macOS Style WiFi Icon
const MacWifiIcon = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
    <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
    <path d="M8 6.5c1.66 0 3.14.69 4.22 1.78a.75.75 0 1 1-1.06 1.06A4.5 4.5 0 0 0 8 8a4.5 4.5 0 0 0-3.16 1.34.75.75 0 1 1-1.06-1.06A5.98 5.98 0 0 1 8 6.5z"/>
    <path d="M8 3c2.76 0 5.26 1.12 7.07 2.93a.75.75 0 1 1-1.06 1.06A8.48 8.48 0 0 0 8 4.5a8.48 8.48 0 0 0-6.01 2.49.75.75 0 1 1-1.06-1.06A9.98 9.98 0 0 1 8 3z"/>
  </svg>
);

// macOS Style Battery Icon
const MacBatteryIcon = () => (
  <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="1" width="16.5" height="10" rx="3" fill="currentColor" />
    <rect x="17.5" y="4" width="2" height="4" rx="1" fill="currentColor" />
  </svg>
);

// macOS Style Control Center Icon
const ControlCenterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
    {/* Top Toggle (Off) */}
    <path fillRule="evenodd" clipRule="evenodd" d="M3.25 2C1.73122 2 0.5 3.23122 0.5 4.75C0.5 6.26878 1.73122 7.5 3.25 7.5H11.75C13.2688 7.5 14.5 6.26878 14.5 4.75C14.5 3.23122 13.2688 2 11.75 2H3.25ZM11.75 3.5H3.25C2.55964 3.5 2 4.05964 2 4.75C2 5.44036 2.55964 6 3.25 6H11.75C12.4404 6 13 5.44036 13 4.75C13 4.05964 12.4404 3.5 11.75 3.5Z" />
    <path d="M4.25 3.5C3.55964 3.5 3 4.05964 3 4.75C3 5.44036 3.55964 6 4.25 6H5.25C5.94036 6 6.5 5.44036 6.5 4.75C6.5 4.05964 5.94036 3.5 5.25 3.5H4.25Z" />
    
    {/* Bottom Toggle (On) */}
    <path fillRule="evenodd" clipRule="evenodd" d="M3.25 8.5C1.73122 8.5 0.5 9.73122 0.5 11.25C0.5 12.7688 1.73122 14 3.25 14H11.75C13.2688 14 14.5 12.7688 14.5 11.25C14.5 9.73122 13.2688 8.5 11.75 8.5H3.25ZM12.75 11.25C12.75 11.9404 12.1904 12.5 11.5 12.5C10.8096 12.5 10.25 11.9404 10.25 11.25C10.25 10.5596 10.8096 10 11.5 10C12.1904 10 12.75 10.5596 12.75 11.25Z" />
  </svg>
);


export default function TopBar({ appTitle = "Svart Hull", setStage }) {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const windows = useAppStore((state) => state.windows);
  const openApp = useAppStore((state) => state.openApp);
  const focusApp = useAppStore((state) => state.focusApp);
  const restoreApp = useAppStore((state) => state.restoreApp);

  const handleOpenApp = (appId, comp) => {
    const existing = windows.find((w) => {
      if (w.isClosing) return false;
      if (appId === "Finder") {
        return w.appId === "Finder" || w.appId === "TextEdit" || w.appId === "PDFViewer";
      }
      if (appId === "Contact Me") {
        return w.appId === "Contact Me" || w.appId === "Mail";
      }
      if (appId === "About") {
        return w.appId === "About" || w.appId === "Settings";
      }
      return w.appId === appId;
    });

    if (existing) {
      if (existing.minimized) {
        restoreApp(existing.id);
      } else {
        focusApp(existing.id);
      }
    } else {
      openApp(appId, comp);
    }
  };

  const [time, setTime] = useState(getTime());

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000);
    return () => clearInterval(id);
  }, []);

  function getTime() {
    const now = new Date();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    try {
      const weekday = now.toLocaleString("en-US", { weekday: "short", timeZone: tz });
      const month = now.toLocaleString("en-US", { month: "short", timeZone: tz });
      const day = now.toLocaleString("en-US", { day: "numeric", timeZone: tz });
      const t = now.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: tz
      });
      return { date: `${weekday}, ${month} ${day}`, time: t };
    } catch (e) {
      // Fallback if invalid timezone
      const weekday = now.toLocaleString("en-US", { weekday: "short" });
      const month = now.toLocaleString("en-US", { month: "short" });
      const day = now.getDate();
      const t = now.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      return { date: `${weekday}, ${month} ${day}`, time: t };
    }
  }

  const hoverStyle =
    "bg-transparent hover:bg-white/10 hover:backdrop-blur-xl rounded px-1.5 py-0.5 transition-all duration-150";

  return (
<div
  className="w-full h-7 flex items-center justify-between px-1.5 sm:px-2 select-none fixed top-0 left-0 z-[999998] text-white backdrop-blur-[2px]"
  style={{
    background: "linear-gradient(to bottom, rgba(0,0,0,0.18), rgba(0,0,0,0))"
  }}
>
      {/* LEFT */}
      <div className="flex items-center gap-0 text-[13px] sm:text-[14px] font-semibold text-white">
        {/* Brand Logo */}
        <div className="flex items-center justify-center px-1.5 sm:px-2 h-7 select-none">
          <BrandLogo />
        </div>

        {/* App Name - Svart Hull */}
        <span className="font-semibold text-[13px] sm:text-[14px] px-1 sm:px-1.5 py-0.5 cursor-default select-none">
          Svart Hull
        </span>

        {/* Menu Items */}
        <div className="hidden sm:flex items-center gap-2 text-[14px] font-semibold text-white/90 ml-1">
          <button
            type="button"
            onClick={() => handleOpenApp("Finder", <Finder />)}
            className={`cursor-pointer ${hoverStyle}`}
          >
            Projects
          </button>

          <button
            type="button"
            onClick={() => handleOpenApp("About", <About />)}
            className={`cursor-pointer ${hoverStyle}`}
          >
            About Me
          </button>

          <button
            type="button"
            onClick={() => handleOpenApp("Contact Me", <Mail />)}
            className={`cursor-pointer ${hoverStyle}`}
          >
            Contact
          </button>
        </div>
      </div>

      {/* CENTER — empty like macOS */}
      <div className="flex-1"></div>

      {/* RIGHT */}
      <div className="flex items-center gap-0.5 sm:gap-1 text-[12px] sm:text-[13px] font-medium text-white pr-1 sm:pr-2">
        <div className="cursor-pointer hover:bg-white/10 rounded-full p-1 transition-colors scale-90 sm:scale-100">
          <MacBatteryIcon />
        </div>

        <div className="cursor-pointer hover:bg-white/10 rounded-full p-1 transition-colors scale-90 sm:scale-100">
          <MacWifiIcon />
        </div>

        {/* Control Center Icon */}
        <div className="cursor-pointer hover:bg-white/10 px-1.5 sm:px-2 py-0.5 rounded-[6px] transition-colors flex items-center justify-center scale-90 sm:scale-100">
          <ControlCenterIcon />
        </div>


        {/* TIME */}
        <div className={`cursor-default ${hoverStyle} font-semibold text-[12.5px] sm:text-[14px]`}>
          <span className="hidden sm:inline">{time?.date}  </span>
          <span>{time?.time}</span>
        </div>
      </div>
    </div>
  );
}
