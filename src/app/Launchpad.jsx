import React, { useState } from "react";
import { useAppStore } from "../store/Appstore";
import { LayoutGrid, ChevronDown, Plus } from "lucide-react";
import Spotify from "./Spotify";
import About from "./About";
import Finder from "./Finder";
import Trash from "./Trash";
import Mail from "./Mail";

// Traffic lights component
const TrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);

  return (
    <div className="flex items-center gap-2 group mr-4 shrink-0">
      <div
        className="w-3 h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] transition-all duration-150 shadow-sm"
        onClick={() => close(windowId)}
        title="Close"
      >
        <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all duration-150 shadow-sm"
        onClick={() => minimize(windowId)}
        title="Minimize"
      >
        <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#28c840] opacity-35 rounded-full cursor-not-allowed flex items-center justify-center shadow-sm"
        title="Maximize disabled"
      />
    </div>
  );
};

export default function Launchpad({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const openApp = useAppStore((s) => s.openApp);
  const windows = useAppStore((s) => s.windows);
  const restoreApp = useAppStore((s) => s.restoreApp);
  const focusApp = useAppStore((s) => s.focusApp);

  const [expandedSections, setExpandedSections] = useState({
    suggestions: false,
    productivity: false,
    creativity: false,
    info: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLaunch = (app) => {
    if (app.url) {
      window.open(app.url, "_blank");
    } else {
      const existingWindow = windows.find((w) => w.appId === app.appId);
      if (existingWindow) {
        if (existingWindow.minimized) {
          restoreApp(existingWindow.id);
        } else {
          focusApp(existingWindow.id);
        }
      } else {
        openApp(app.appId, app.comp);
      }
    }
  };

  const allApps = [
    {
      appId: "Finder",
      label: "Projects",
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png",
      comp: <Finder />,
    },
    {
      appId: "Contact Me",
      label: "Contact Me",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Mail_macOS_Golden_Gate_3BIjmD3GZM-ae5977fd03.png",
      comp: <Mail />,
    },
    {
      appId: "Music",
      label: "Music",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Music_macOS_Golden_Gate_LJox0IObSI-d626e3640a.png",
      comp: <Spotify />,
    },
    {
      appId: "About",
      label: "About",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Settings_macOS_Golden_Gate_iR77bVvZBc-502ef0dc70.png",
      comp: <About />,
    },
    {
      appId: "Instagram",
      label: "Instagram",
      icon: "/icons/instagram.svg",
      url: "https://www.instagram.com/svarthull.dev/",
    },
    {
      appId: "Trash",
      label: "Trash",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Bin_Empty_Tahoe_x2cZW1cg7Y_lowResPng-cc516d2e3c.png",
      comp: <Trash />,
    }
  ];

  const getAppsByList = (names) => {
    return allApps.filter((app) => names.includes(app.appId));
  };

  const categories = [
    {
      id: "suggestions",
      title: "Suggestions",
      actionLabel: "Show More",
      actionLabelActive: "Show Less",
      apps: getAppsByList(["Music", "Finder", "About"]),
    },
    {
      id: "productivity",
      title: "Productivity",
      actionLabel: "Show All",
      actionLabelActive: "Collapse",
      apps: getAppsByList(["Contact Me", "Finder", "About"]),
    },
    {
      id: "creativity",
      title: "Creativity",
      actionLabel: "Show All",
      actionLabelActive: "Collapse",
      apps: getAppsByList(["Music"]),
    },
    {
      id: "info",
      title: "Information & Reading",
      actionLabel: "Show All",
      actionLabelActive: "Collapse",
      apps: getAppsByList(["About", "Instagram", "Finder", "Trash"]),
    },
  ];

  return (
    <div 
      className="flex flex-col h-full w-full select-none text-[13px]"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
      }}
    >
      {/* Top Header */}
      <header className="window-drag-handle flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <TrafficLights windowId={windowId} />
          <div className="flex items-center gap-2">
            <img 
              src="https://s3-new.macosicons.com/macosicons/parse/App_Store__MacOS_Tahoe__ZTpqalXxE3_lowResPng-b755fc1237.png"
              alt="App Store icon" 
              className="w-5 h-5 object-contain"
            />
            <span className={`font-semibold text-[14px] sm:text-[15px] ${isDarkMode ? "text-white/90" : "text-gray-900/90"}`}>Apps</span>
          </div>
        </div>
        
        <button className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition ${
          isDarkMode 
            ? "border-white/10 bg-white/5 hover:bg-white/10 text-white/80" 
            : "border-black/10 bg-black/5 hover:bg-black/10 text-gray-800"
        }`}>
          <LayoutGrid size={14} />
          <ChevronDown size={12} />
        </button>
      </header>

      {/* Main categories scrollable list */}
      <div 
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 space-y-4 sm:space-y-6 notes-no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((cat) => {
          const isExpanded = expandedSections[cat.id];
          const displayApps = isExpanded ? cat.apps : cat.apps.slice(0, 5);
          
          return (
            <div key={cat.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`font-semibold text-[13px] sm:text-[14px] ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                  {cat.title}
                </span>
                {cat.apps.length > 5 && (
                  <button 
                    onClick={() => toggleSection(cat.id)}
                    className="text-blue-500 hover:text-blue-600 text-[12px] font-medium transition"
                  >
                    {isExpanded ? cat.actionLabelActive : cat.actionLabel}
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-2 gap-y-4 sm:gap-y-5 justify-items-center">
                {displayApps.map((app) => (
                  <div 
                    key={app.appId} 
                    onClick={() => handleLaunch(app)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer group text-center"
                  >
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
                      <img 
                        src={app.icon} 
                        alt={app.label} 
                        className="w-full h-full object-cover rounded-xl"
                        draggable={false}
                      />
                    </div>
                    <span className={`text-[11px] font-medium truncate max-w-full leading-tight transition ${
                      isDarkMode ? "text-white/80 group-hover:text-white" : "text-gray-800 group-hover:text-black"
                    }`}>
                      {app.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
