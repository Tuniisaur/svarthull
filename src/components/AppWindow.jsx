import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { useAppStore } from "../store/Appstore.js";
import { motion } from "framer-motion";

export default function AppWindow({ window: win }) {
  const close = useAppStore((s) => s.closeApp);
  const focus = useAppStore((s) => s.focusApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const rndRef = useRef(null);

  const isLaunchpad = win.appId === "Launchpad";
  const isFinder = win.appId === "Finder";
  const isMail = win.appId === "Mail" || win.appId === "Contact Me";
  const isAbout = win.appId === "About" || win.appId === "Settings";

  // Calculate initial size and position
  const getWindowDimensions = () => {
    const sw = typeof window !== "undefined" ? window.innerWidth : 1200;
    const sh = typeof window !== "undefined" ? window.innerHeight : 800;
    const mobile = sw < 640;

    if (mobile) {
      const width = Math.max(280, sw - 12);
      const height = Math.max(240, sh - 125);
      const x = Math.max(0, Math.round((sw - width) / 2));
      const y = 38;
      return { width, height, x, y, isMobile: true };
    }

    const width = isAbout
      ? Math.min(Math.round(sw * 0.58), 640)
      : isMail
        ? Math.min(Math.round(sw * 0.55), 680)
        : isFinder
          ? Math.min(Math.round(sw * 0.65), 880)
          : isLaunchpad
            ? Math.min(Math.round(sw * 0.55), 740)
            : Math.min(Math.round(sw * 0.70), 960);

    const height = isAbout
      ? Math.min(Math.round(sh * 0.70), 560)
      : isMail
        ? Math.min(Math.round(sh * 0.72), 620)
        : isFinder
          ? Math.min(Math.round(sh * 0.72), 620)
          : isLaunchpad
            ? Math.min(Math.round(sh * 0.65), 540)
            : Math.min(Math.round(sh * 0.76), 680);

    const x = Math.max(0, Math.round((sw - width) / 2));
    const y = Math.max(32, Math.round((sh - height) / 2));

    return { width, height, x, y, isMobile: false };
  };

  const initialDims = getWindowDimensions();

  // Track current size and position
  const [windowState, setWindowState] = useState({
    x: initialDims.x,
    y: initialDims.y,
    width: initialDims.width,
    height: initialDims.height,
  });

  const [isMobile, setIsMobile] = useState(initialDims.isMobile);

  // Dynamically respond to window resize and orientation changes
  useEffect(() => {
    const handleScreenChange = () => {
      const dims = getWindowDimensions();
      setIsMobile(dims.isMobile);
      if (dims.isMobile) {
        setWindowState({
          x: dims.x,
          y: dims.y,
          width: dims.width,
          height: dims.height,
        });
      }
    };

    window.addEventListener("resize", handleScreenChange);
    window.addEventListener("orientationchange", handleScreenChange);
    return () => {
      window.removeEventListener("resize", handleScreenChange);
      window.removeEventListener("orientationchange", handleScreenChange);
    };
  }, [win.appId]);

  const handleClose = () => {
    close(win.id);
  };

  const handleMinimize = () => {
    minimize(win.id);
  };

  // Hide if minimized (keep mounted so audio/video keeps playing)
  const minimizedStyle = win.minimized ? {
    opacity: 0,
    pointerEvents: 'none',
    visibility: 'hidden',
  } : {};

  // Resize handle styles for better visibility
  const resizeHandleStyles = {
    bottom: { cursor: 'ns-resize' },
    right: { cursor: 'ew-resize' },
    top: { cursor: 'ns-resize' },
    left: { cursor: 'ew-resize' },
    topRight: { cursor: 'nesw-resize' },
    bottomRight: { cursor: 'nwse-resize' },
    bottomLeft: { cursor: 'nesw-resize' },
    topLeft: { cursor: 'nwse-resize' },
  };

  return (
    <div style={minimizedStyle}>
      <Rnd
        ref={rndRef}
        position={{ x: windowState.x, y: windowState.y }}
        size={{ width: windowState.width, height: windowState.height }}
        bounds="window"
        minWidth={isMobile ? 260 : 320}
        minHeight={isMobile ? 180 : 220}
        dragHandleClassName="window-drag-handle"
        style={{ 
          zIndex: win.z,
        }}
        resizeHandleStyles={resizeHandleStyles}
        enableResizing={!isMobile ? {
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        } : false}
        onDragStart={() => {
          setIsDragging(true);
          focus(win.id);
        }}
        onDragStop={(e, d) => {
          setIsDragging(false);
          setWindowState(prev => ({ ...prev, x: d.x, y: d.y }));
        }}
        onResizeStart={() => {
          setIsResizing(true);
          focus(win.id);
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setIsResizing(false);
          setWindowState({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            x: position.x,
            y: position.y,
          });
        }}
        disableDragging={isMobile || win.maximized}
      >
        <motion.div
          key={win.id}
          initial={{ opacity: 0, scale: 0.88, y: 16 }}
          animate={
            win.isClosing
              ? {
                  opacity: 0,
                  scale: 0.88,
                  y: 16,
                  transition: { duration: 0.2, ease: [0.32, 0, 0.67, 0] },
                }
              : {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  boxShadow: isDragging 
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
                    : '0 10px 40px -10px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] },
                }
          }
          className={`flex flex-col overflow-hidden ${win.isClosing ? "pointer-events-none " : ""}${
            win.maximized ? "rounded-none" : "rounded-xl"
          } ${
            win.appId === "Launchpad"
              ? isDarkMode
                ? "backdrop-blur-3xl bg-[#1e1e1e]/45 border border-white/10 text-white shadow-2xl"
                : "backdrop-blur-3xl bg-white/65 border border-black/10 text-gray-900 shadow-2xl"
              : isAbout
                ? "bg-[#f5f5f7] border border-black/15 text-gray-900 shadow-2xl"
              : win.appId === "Music" || win.appId === "Finder" || win.appId === "TextEdit" || win.appId === "PDFViewer" || win.appId === "Trash" || win.appId === "Mail" || win.appId === "Contact Me"
                ? isDarkMode
                  ? "bg-[#1e1e1e] text-white border border-white/10"
                  : "bg-white text-gray-900 border border-black/10 shadow-2xl"
                : "backdrop-blur-xl bg-black/40 border border-white/15 text-white shadow-xl"
          } ${isDragging ? "cursor-grabbing" : ""} ${isResizing ? "select-none" : ""}`}
          style={{
            width: '100%',
            height: '100%',
            transformOrigin: 'center center',
            willChange: isDragging || isResizing ? 'transform' : 'transform, opacity',
          }}
        >
              {/* Title Bar - Skip for apps that integrate their own */}
              {win.appId !== "Music" && win.appId !== "Finder" && win.appId !== "TextEdit" && win.appId !== "PDFViewer" && win.appId !== "Trash" && win.appId !== "Launchpad" && win.appId !== "Mail" && win.appId !== "Contact Me" && (
                <div 
                  className={`window-drag-handle relative h-11 flex items-center cursor-grab active:cursor-grabbing select-none rounded-t-xl ${
                    isAbout
                      ? "bg-[#e5e5e7] border-b border-black/10 text-neutral-800"
                      : "bg-linear-to-b from-white/10 to-transparent"
                  }`}
                >
                  {/* Traffic Light Buttons */}
                  <div className="absolute left-4 flex items-center gap-2 group z-10">
                    {/* Close Button */}
                    <div
                      className="w-3 h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] transition-all duration-150 shadow-sm"
                      onClick={(e) => { e.stopPropagation(); handleClose(); }}
                      title="Close"
                    >
                      <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
                        <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    {/* Minimize Button */}
                    <div
                      className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all duration-150 shadow-sm"
                      onClick={(e) => { e.stopPropagation(); handleMinimize(); }}
                      title="Minimize"
                    >
                      <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
                        <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    {/* Maximize Button - Disabled */}
                    <div
                      className="w-3 h-3 bg-[#28c840] opacity-35 rounded-full cursor-not-allowed flex items-center justify-center shadow-sm"
                      title="Maximize disabled"
                    />
                  </div>
 
                  {/* Center Title */}
                  <div className={`absolute left-1/2 -translate-x-1/2 font-semibold text-sm tracking-wide pointer-events-none ${
                    isAbout ? "text-neutral-800" : "text-white/80"
                  }`}>
                    {win.appId === "Finder" ? "Projects" : win.appId}
                  </div>
                </div>
              )}
 
              {/* App Content */}
              <div className={`flex-1 overflow-hidden flex flex-col ${win.appId === "Music" || win.appId === "Finder" || win.appId === "TextEdit" || win.appId === "PDFViewer" || win.appId === "Trash" || win.appId === "Launchpad" || isAbout ? "" : "text-white bg-black/20"}`}>
                {React.cloneElement(win.component, { windowId: win.id, maximized: win.maximized, isDragging, isResizing })}
              </div>
            </motion.div>
      </Rnd>
    </div>
  );
}
