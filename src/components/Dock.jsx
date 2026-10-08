import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "../store/Appstore.js";
import Spotify from "../app/Spotify";
import About from "../app/About";
import Finder from "../app/Finder";
import Trash from "../app/Trash";
import Launchpad from "../app/Launchpad";
import Mail from "../app/Mail";

import { GlassSurface } from "./ui/glass-surface";

export default function Dock() {
  const openApp = useAppStore((s) => s.openApp);
  const windows = useAppStore((s) => s.windows);
  const restoreApp = useAppStore((s) => s.restoreApp);
  const focusApp = useAppStore((s) => s.focusApp);
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const [hoveredApp, setHoveredApp] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [bouncingAppId, setBouncingAppId] = useState(null);

  const leaveTimeoutRef = useRef(null);

  const [hasTrashedItems, setHasTrashedItems] = useState(() => {
    try {
      const saved = localStorage.getItem("os_trash");
      return saved ? JSON.parse(saved).length > 0 : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleTrashUpdated = (e) => {
      setHasTrashedItems(e.detail.hasFiles);
    };
    
    // Also listen to Finder deleting file directly (as back up / instant refresh)
    const handleFileTrashed = () => {
      setHasTrashedItems(true);
    };

    window.addEventListener("os_trash_updated", handleTrashUpdated);
    window.addEventListener("os_file_trash", handleFileTrashed);
    return () => {
      window.removeEventListener("os_trash_updated", handleTrashUpdated);
      window.removeEventListener("os_file_trash", handleFileTrashed);
    };
  }, []);

  const handleMouseLeave = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredApp(null);
      setHoveredIndex(null);
    }, 250);
  };

  const handleMouseEnterIcon = (app, index) => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    setHoveredApp(app);
    setHoveredIndex(index);
  };

  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  const apps = [
    {
      id: "Finder",
      label: "Projects",
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png",
      comp: <Finder />,
    },
    {
      id: "Launchpad",
      label: "Launchpad",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Launchpad__MacOS_Tahoe__ncy8MiCAOA_lowResPng-ffd58d03cd.png",
      comp: <Launchpad />,
    },
    {
      id: "Contact Me",
      label: "Contact Me",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Mail_macOS_Golden_Gate_3BIjmD3GZM-ae5977fd03.png",
      comp: <Mail />,
    },
    {
      id: "Music",
      label: "Music",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Music_macOS_Golden_Gate_LJox0IObSI-d626e3640a.png",
      comp: <Spotify />,
    },
    {
      id: "About",
      label: "About",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Settings_macOS_Golden_Gate_iR77bVvZBc-502ef0dc70.png",
      comp: <About />,
    },
    { divider: true },
    {
      id: "Instagram",
      label: "Instagram",
      icon: "/icons/instagram.svg",
      url: "https://www.instagram.com/svarthull.dev/",
    },
    { divider: true },
    {
      id: "Trash",
      label: "Trash",
      icon: hasTrashedItems
        ? "https://s3.macosicons.com/macosicons/icons/yrypldfXBR/lowResPngFile_c3be764d323d03b2ce9921be92216fca_yrypldfXBR.png"
        : "https://s3-new.macosicons.com/macosicons/parse/Bin_Empty_Tahoe_x2cZW1cg7Y_lowResPng-cc516d2e3c.png",
      comp: <Trash />,
    },
  ];

  // Check if an app is currently open
  const isAppOpen = (appId) => {
    if (appId === "Finder") {
      return windows.some((w) => (w.appId === "Finder" || w.appId === "TextEdit" || w.appId === "PDFViewer") && !w.isClosing);
    }
    return windows.some((w) => w.appId === appId && !w.isClosing);
  };
  
  // Check if an app is minimized
  const isAppMinimized = (appId) => windows.some((w) => w.appId === appId && w.minimized);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate icon size based on distance from hovered icon (macOS magnification effect)
  const getIconScale = (index) => {
    if (isMobile) return 1;
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.15;
    if (distance === 1) return 1.08;
    if (distance === 2) return 1.03;
    return 1;
  };

  const handleAppClick = (app) => {
    setBouncingAppId(app.id);

    setTimeout(() => {
      if (app.url) {
        window.open(app.url, "_blank");
      } else if (app.action) {
        app.action();
      } else {
        // Check if app is already open
        const existingWindow = windows.find((w) => w.appId === app.id && !w.isClosing);
        if (existingWindow) {
          if (existingWindow.minimized) {
            // Restore minimized app
            restoreApp(existingWindow.id);
          } else {
            // Focus existing app
            focusApp(existingWindow.id);
          }
        } else {
          // Open new app
          openApp(app.id, app.comp);
        }
      }
      setBouncingAppId(null);
    }, 200);
  };

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 flex items-end px-2 sm:px-1 py-1 rounded-2xl h-[53px] sm:h-[56px] overflow-visible transition-all duration-300 z-[99999] max-w-[calc(100vw-16px)]"
      style={{
        bottom: "max(10px, calc(env(safe-area-inset-bottom, 0px) + 8px))",
      }}
      onMouseLeave={handleMouseLeave}
    >
      <GlassSurface
        tint={isDarkMode ? 0.05 : 0.02}
        radius={18}
        blur={20}
        chroma={0.1}
        specular={false}
        className="absolute inset-0 -z-10"
      />
      {apps.map((app, index) => {
        if (app.divider)
          return (
            <div
              key={index}
              className="w-px bg-white/20 rounded-full mx-0.5 self-stretch my-1"
            />
          );

        const scale = getIconScale(index);
        const baseSize = isMobile ? 42 : 48; // Responsive icon size in pixels
        const iconSize = baseSize * scale;
        return (
          <div
            key={app.id}
            onMouseEnter={() => handleMouseEnterIcon(app, index)}
            onClick={() => handleAppClick(app)}
            className={`
              relative
              flex flex-col items-center justify-end
              cursor-pointer
              ${bouncingAppId === app.id ? "animate-bounceOnce" : ""}
            `}
            style={{
              transformOrigin: "bottom center",
              marginBottom: hoveredIndex !== null ? `${(scale - 1) * 20}px` : "0px",
              transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >
            {/* Tooltip - positioned above each icon */}
            {hoveredApp?.id === app.id && (
              <div
                className="
                  absolute -top-9
                  px-3 py-1 rounded-md
                  bg-gray-900/95 text-white shadow-xl
                  text-xs font-medium backdrop-blur-xl
                  animate-fadeSlide pointer-events-none
                  whitespace-nowrap z-50
                  border border-white/10
                "
              >
                {app.label}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900/95 rotate-45 border-r border-b border-white/10" />
              </div>
            )}
            
            <div
              className="
                rounded-xl
                flex items-center justify-center
                overflow-hidden
              "
              style={{
                width: `${iconSize}px`,
                height: `${iconSize}px`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              <img
                src={app.icon}
                alt={app.label}
                className="w-full h-full object-cover rounded-xl"
                draggable={false}
              />
            </div>
            
            {/* Dot indicator for open apps */}
            {isAppOpen(app.id) && (
              <div 
                className="absolute -bottom-0.5 w-1 h-1 bg-white/90 rounded-full"
                style={{
                  boxShadow: "0 0 4px rgba(255,255,255,0.6)"
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
