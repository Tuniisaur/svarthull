import React from "react";
import { useAppStore } from "../store/Appstore";

// Traffic lights inside the PDFViewer header
const TrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);

  return (
    <div className="flex items-center gap-2 group mr-4">
      <div
        className="w-3 h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] transition-all duration-150 shadow-sm"
        onClick={() => windowId && close(windowId)}
        title="Close"
      >
        <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all duration-150 shadow-sm"
        onClick={() => windowId && minimize(windowId)}
        title="Minimize"
      >
        <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#28c840] opacity-35 rounded-full cursor-not-allowed flex items-center justify-center shadow-sm"
        title="Maximize disabled"
      />
    </div>
  );
};

export default function PDFViewer({ file, windowId, isDragging, isResizing }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  if (!file) return null;

  return (
    <div className={`flex flex-col h-full w-full select-none transition-colors duration-150 ${
      isDarkMode ? "bg-[#1E1E1E] text-white" : "bg-white text-gray-800"
    }`}>
      <div className={`window-drag-handle flex items-center justify-between border-b px-4 py-2.5 select-none cursor-grab active:cursor-grabbing ${
        isDarkMode ? "bg-[#2D2D2D] border-white/10" : "bg-[#F6F6F6] border-gray-200"
      }`}>
        {/* Traffic Lights */}
        <div className="flex items-center gap-1.5 group/pdf-traffic w-16">
          <TrafficLights windowId={windowId} />
        </div>

        <h2 className="text-xs font-semibold text-center flex-1">{file.name}</h2>
        <div className="w-16"></div>
      </div>
      <iframe 
        src={file.url} 
        title={file.name}
        className={`flex-1 w-full border-none bg-white ${isDragging || isResizing ? "pointer-events-none" : ""}`} 
      />
    </div>
  );
}
