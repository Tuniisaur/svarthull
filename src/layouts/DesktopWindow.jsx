import React, { useEffect, useRef, useState } from "react";
import Dock from "../components/Dock";
import AppWindow from "../components/AppWindow";
import { useAppStore } from "../store/Appstore";
import TopBar from "../components/TopBar";
import { AnimatePresence, motion } from "framer-motion";
import { FiFolder, FiFile } from "react-icons/fi";
import { X } from "lucide-react";
import Finder from "../app/Finder";
import TextEdit from "../app/TextEdit";
import PDFViewer from "../app/PDFViewer";
import AvailabilityWidget from "../components/widgets/AvailabilityWidget";
import MusicWidget from "../components/widgets/MusicWidget";
import ShaderGroupSwitcher from "../components/ShaderGroupSwitcher";
import { DEFAULT_PROJECT_FOLDERS, DEFAULT_SVART_HULL_FILES, DEFAULT_VKHLAMOV_FILES } from "../constants/folders";

class WindowErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Window Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export default function Desktop({ setStage, isLocked = false }) {
  const windows = useAppStore((s) => s.windows);
  const openApp = useAppStore((s) => s.openApp);
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const [wallpaper, setWallpaper] = useState(() => {
    const saved = localStorage.getItem("desktop_wallpaper");
    if (!saved || saved === "/Wallpaper/GoldenGate_6k.png") {
      return "shader";
    }
    return saved;
  });
  const [desktopFolders, setDesktopFolders] = useState(() => {
    try {
      const saved = localStorage.getItem("os_desktop_folders");
      const parsed = saved ? JSON.parse(saved) : [];
      const existingNames = new Set(parsed.map(f => f.name?.toLowerCase()));
      const toAdd = DEFAULT_PROJECT_FOLDERS.filter(df => !existingNames.has(df.name.toLowerCase()));
      if (toAdd.length > 0) {
        const merged = [...toAdd, ...parsed];
        localStorage.setItem("os_desktop_folders", JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch {
      return DEFAULT_PROJECT_FOLDERS;
    }
  });
  const [desktopFiles, setDesktopFiles] = useState(() => {
    return JSON.parse(localStorage.getItem("os_desktop_files") || "[]");
  });
  const [showIcons, setShowIcons] = useState(() => {
    return localStorage.getItem("desktop_show_icons") !== "false";
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [draggingItem, setDraggingItem] = useState(null);

  const [clipboard, setClipboard] = useState(() => {
    return JSON.parse(localStorage.getItem("os_clipboard") || "null");
  });
  const [isCutMode, setIsCutMode] = useState(() => {
    return localStorage.getItem("os_is_cut_mode") === "true";
  });
  const [toast, setToast] = useState(null);
  const [showMobileDockNotice, setShowMobileDockNotice] = useState(false);

  // Define allDesktopItems before useEffect
  const allDesktopItems = [
    ...desktopFolders.filter(f => !f.parentFolderId).map(f => ({ ...f, type: "folder" })),
    ...desktopFiles.filter((f) => !f.parentFolderId).map(f => ({ ...f, type: "file" })),
  ];

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Show macOS-style notification explaining bottom bar icons when entering home on mobile
  useEffect(() => {
    const isMobileScreen = typeof window !== "undefined" && window.innerWidth < 640;
    if (isMobileScreen && !isLocked) {
      const timer = setTimeout(() => {
        setShowMobileDockNotice(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isLocked]);

  useEffect(() => {
    if (showMobileDockNotice) {
      const timer = setTimeout(() => {
        setShowMobileDockNotice(false);
      }, 7500);
      return () => clearTimeout(timer);
    }
  }, [showMobileDockNotice]);

  useEffect(() => {
    // Listen for wallpaper changes from Gallery
    const handleWallpaperChange = (e) => {
      const newWallpaper = e?.detail || localStorage.getItem("desktop_wallpaper");
      if (newWallpaper) setWallpaper(newWallpaper);
    };

    // Listen for folder creation
    const handleFolderCreated = (e) => {
      setDesktopFolders((prev) => [...prev, e.detail]);
      setEditingItem(e.detail.id);
      setEditName(e.detail.name);
    };

    // Listen for file creation
    const handleFileCreated = (e) => {
      setDesktopFiles(prev => [...prev, e.detail]);
    };

    // Listen for file/folder restoration
    const handleFileRestored = (e) => {
      const { file, path } = e.detail;
      if (path === "/desktop") {
        if (file.type === "folder") {
          setDesktopFolders(prev => [file, ...prev.filter(f => f.id !== file.id)]);
        } else {
          setDesktopFiles(prev => [file, ...prev.filter(f => f.id !== file.id)]);
        }
      }
    };

    // Listen for icons toggle
    const handleIconsChanged = () => {
      setShowIcons(localStorage.getItem("desktop_show_icons") !== "false");
    };


    const handleDesktopSync = () => {
      const folders = JSON.parse(localStorage.getItem("os_desktop_folders") || "[]");
      const files = JSON.parse(localStorage.getItem("os_desktop_files") || "[]");
      setDesktopFolders(prev => {
        if (JSON.stringify(prev) === JSON.stringify(folders)) return prev;
        return folders;
      });
      setDesktopFiles(prev => {
        if (JSON.stringify(prev) === JSON.stringify(files)) return prev;
        return files;
      });
    };

    const handleClipboardSync = () => {
      setClipboard(JSON.parse(localStorage.getItem("os_clipboard") || "null"));
      setIsCutMode(localStorage.getItem("os_is_cut_mode") === "true");
    };

    window.addEventListener('wallpaperChanged', handleWallpaperChange);
    window.addEventListener('os_folder_created', handleFolderCreated);
    window.addEventListener('os_file_created', handleFileCreated);
    window.addEventListener('desktopIconsChanged', handleIconsChanged);
    window.addEventListener('os_file_restored', handleFileRestored);
    window.addEventListener('os_desktop_sync', handleDesktopSync);
    window.addEventListener('os_clipboard_sync', handleClipboardSync);
    
    // Also listen for storage events (for cross-tab support)
    window.addEventListener('storage', (e) => {
      if (e.key === 'desktop_wallpaper' && e.newValue) {
        setWallpaper(e.newValue);
      }
    });
    
    return () => {
      window.removeEventListener('wallpaperChanged', handleWallpaperChange);
      window.removeEventListener('os_folder_created', handleFolderCreated);
      window.removeEventListener('os_file_created', handleFileCreated);
      window.removeEventListener('desktopIconsChanged', handleIconsChanged);
      window.removeEventListener('os_file_restored', handleFileRestored);
      window.removeEventListener('os_desktop_sync', handleDesktopSync);
      window.removeEventListener('os_clipboard_sync', handleClipboardSync);
    };
  }, [selectedItem, allDesktopItems]);

  const handleCopy = (item) => {
    if (!item) return;
    const clipboardItem = { ...item, type: item.type || (desktopFolders.some(f => f.id === item.id) ? "folder" : "file") };
    const clipboardVal = [clipboardItem];
    localStorage.setItem("os_clipboard", JSON.stringify(clipboardVal));
    localStorage.setItem("os_is_cut_mode", "false");
    window.dispatchEvent(new CustomEvent("os_clipboard_sync"));
  };

  const handleCut = (item) => {
    if (!item) return;
    const clipboardItem = { ...item, type: item.type || (desktopFolders.some(f => f.id === item.id) ? "folder" : "file") };
    const clipboardVal = [clipboardItem];
    localStorage.setItem("os_clipboard", JSON.stringify(clipboardVal));
    localStorage.setItem("os_is_cut_mode", "true");
    window.dispatchEvent(new CustomEvent("os_clipboard_sync"));
  };

  const handlePaste = () => {
    const currentClipboard = JSON.parse(localStorage.getItem("os_clipboard") || "null");
    const currentIsCutMode = localStorage.getItem("os_is_cut_mode") === "true";
    if (!currentClipboard || !currentClipboard.length) return;

    const clipboardList = Array.isArray(currentClipboard) ? currentClipboard : [currentClipboard];

    if (currentIsCutMode) {
      clipboardList.forEach((clipboardItem) => {
        const fileWithNewParent = {
          ...clipboardItem,
          date: new Date().toISOString(),
          parentFolderId: undefined,
          x: 50 + Math.random() * 100,
          y: 50 + Math.random() * 100
        };

        const removeFromFileList = (list) => list.filter(f => f.id !== clipboardItem.id);

        const icloud = removeFromFileList(JSON.parse(localStorage.getItem("os_icloud_files") || "[]"));
        const dl = removeFromFileList(JSON.parse(localStorage.getItem("os_downloads") || "[]"));
        const docs = removeFromFileList(JSON.parse(localStorage.getItem("os_documents_files") || "[]"));
        const destFolders = removeFromFileList(JSON.parse(localStorage.getItem("os_desktop_folders") || "[]"));
        const destFiles = removeFromFileList(JSON.parse(localStorage.getItem("os_desktop_files") || "[]"));

        localStorage.setItem("os_icloud_files", JSON.stringify(icloud));
        localStorage.setItem("os_downloads", JSON.stringify(dl));
        localStorage.setItem("os_documents_files", JSON.stringify(docs));

        if (clipboardItem.type === "folder") {
          const updatedFolders = [...destFolders, fileWithNewParent];
          setDesktopFolders(updatedFolders);
          localStorage.setItem("os_desktop_folders", JSON.stringify(updatedFolders));
        } else {
          const updatedFiles = [...destFiles, fileWithNewParent];
          setDesktopFiles(updatedFiles);
          localStorage.setItem("os_desktop_files", JSON.stringify(updatedFiles));
        }
      });

      localStorage.setItem("os_clipboard", "null");
      localStorage.setItem("os_is_cut_mode", "false");
      
      window.dispatchEvent(new CustomEvent("os_clipboard_sync"));
      window.dispatchEvent(new CustomEvent("os_files_sync"));
      window.dispatchEvent(new CustomEvent("os_desktop_sync"));
      
      setToast({ message: "Items moved successfully", type: "success" });
    } else {
      clipboardList.forEach((clipboardItem, index) => {
        const pastedFile = {
          ...clipboardItem,
          id: `${clipboardItem.id}_copy_${Date.now()}_${index}`,
          name: clipboardItem.name.includes(".") 
            ? clipboardItem.name.replace(/(\.[^.]+)$/, " copy$1") 
            : `${clipboardItem.name} copy`,
          date: new Date().toISOString(),
          parentFolderId: undefined,
          x: 50 + Math.random() * 100,
          y: 50 + Math.random() * 100
        };

        if (clipboardItem.type === "folder") {
          const destFolders = JSON.parse(localStorage.getItem("os_desktop_folders") || "[]");
          const updatedFolders = [...destFolders, pastedFile];
          setDesktopFolders(updatedFolders);
          localStorage.setItem("os_desktop_folders", JSON.stringify(updatedFolders));
        } else {
          const destFiles = JSON.parse(localStorage.getItem("os_desktop_files") || "[]");
          const updatedFiles = [...destFiles, pastedFile];
          setDesktopFiles(updatedFiles);
          localStorage.setItem("os_desktop_files", JSON.stringify(updatedFiles));
        }
      });
      
      window.dispatchEvent(new CustomEvent("os_desktop_sync"));
      setToast({ message: "Items copied successfully", type: "success" });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
        return;
      }

      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      if (isCmdOrCtrl) {
        if (key === "c") {
          if (selectedItem) {
            const item = allDesktopItems.find(i => i.id === selectedItem);
            if (item) {
              e.preventDefault();
              handleCopy(item);
            }
          }
        } else if (key === "x") {
          if (selectedItem) {
            const item = allDesktopItems.find(i => i.id === selectedItem);
            if (item) {
              e.preventDefault();
              handleCut(item);
            }
          }
        } else if (key === "v") {
          e.preventDefault();
          handlePaste();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, clipboard, isCutMode, allDesktopItems]);


  const [previewImage, setPreviewImage] = useState(null);

  const handleItemDoubleClick = (item) => {
    if (item.type === "folder") {
      openApp("Finder", <Finder initialPath={`/icloud/${item.id}`} />);
    } else if (item.type === "webloc") {
      window.open(item.url, "_blank");
    } else if (item.type === "image" || item.type === "video") {
      setPreviewImage(item);
    } else if (item.type === "document" || item.name?.toLowerCase().endsWith(".txt")) {
      openApp("TextEdit", <TextEdit file={item} />);
    } else if (item.type === "pdf" || item.name?.toLowerCase().endsWith(".pdf")) {
      openApp("PDFViewer", <PDFViewer file={item} />);
    }
  };

  const handleItemRename = (item) => {
    setEditingItem(item.id);
    setEditName(item.name);
  };

  const handleRenameSubmit = (item) => {
    if (editName.trim()) {
      if (item.type === "folder") {
        const updated = desktopFolders.map(f => 
          f.id === item.id ? { ...f, name: editName.trim() } : f
        );
        setDesktopFolders(updated);
        localStorage.setItem("os_desktop_folders", JSON.stringify(updated));

        // Sync rename with Projects (iCloud files)
        const icloudList = JSON.parse(localStorage.getItem("os_icloud_files") || "[]");
        if (icloudList.some(f => f.id === item.id)) {
          const updatedIcloud = icloudList.map(f => 
            f.id === item.id ? { ...f, name: editName.trim() } : f
          );
          localStorage.setItem("os_icloud_files", JSON.stringify(updatedIcloud));
          window.dispatchEvent(new CustomEvent("os_files_sync"));
        }

        window.dispatchEvent(new CustomEvent("os_desktop_sync"));
      } else {
        const updated = desktopFiles.map(f => 
          f.id === item.id ? { ...f, name: editName.trim() } : f
        );
        setDesktopFiles(updated);
        localStorage.setItem("os_desktop_files", JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("os_desktop_sync"));
      }
    }
    setEditingItem(null);
    setEditName("");
  };

  const handleDeleteItem = (item) => {
    const trashedItem = {
      ...item,
      originalPath: "/desktop",
      trashedAt: new Date().toISOString()
    };
    
    // Save directly to localStorage
    const currentTrash = JSON.parse(localStorage.getItem("os_trash") || "[]");
    const updatedTrash = [trashedItem, ...currentTrash.filter(f => f.id !== item.id)];
    localStorage.setItem("os_trash", JSON.stringify(updatedTrash));
    
    // Dispatch events to notify listeners (like open Trash windows or the Dock)
    window.dispatchEvent(new CustomEvent("os_file_trash", { detail: trashedItem }));
    window.dispatchEvent(new CustomEvent("os_trash_updated", { detail: { hasFiles: true } }));

    if (item.type === "folder") {
      const updated = desktopFolders.filter(f => f.id !== item.id);
      setDesktopFolders(updated);
      localStorage.setItem("os_desktop_folders", JSON.stringify(updated));

      // Sync deletion with Projects
      const icloudList = JSON.parse(localStorage.getItem("os_icloud_files") || "[]");
      if (icloudList.some(f => f.id === item.id)) {
        const updatedIcloud = icloudList.filter(f => f.id !== item.id);
        localStorage.setItem("os_icloud_files", JSON.stringify(updatedIcloud));
        window.dispatchEvent(new CustomEvent("os_files_sync"));
      }

      window.dispatchEvent(new CustomEvent("os_desktop_sync"));
    } else {
      const updated = desktopFiles.filter(f => f.id !== item.id);
      setDesktopFiles(updated);
      localStorage.setItem("os_desktop_files", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("os_desktop_sync"));
    }
  };


  const handleDesktopFileDrop = (e) => {
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    files.forEach((file, index) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
      const isTxt = file.type === "text/plain" || file.name.endsWith(".txt");

      if (!isImage && !isVideo && !isPdf && !isTxt) {
        alert("Only images, PDFs, videos, and text files can be uploaded.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        
        const newFile = {
          id: `drop_sys_${Date.now()}_${index}`,
          name: file.name,
          type: isImage ? "image" : isVideo ? "video" : isPdf ? "pdf" : "document",
          size: file.size,
          date: new Date().toISOString(),
          url: dataUrl,
          x: e.clientX ? e.clientX - 40 : 100 + index * 100,
          y: e.clientY ? e.clientY - 40 : 100 + index * 100
        };

        setDesktopFiles(prev => {
          const updated = [newFile, ...prev];
          localStorage.setItem("os_desktop_files", JSON.stringify(updated));
          return updated;
        });
        
        window.dispatchEvent(new CustomEvent("os_file_created", { detail: newFile }));
        window.dispatchEvent(new CustomEvent("os_desktop_sync"));
      };
      reader.readAsDataURL(file);
    });
  };

  const getDesktopItemIcon = (item) => {
    if (item.type === "folder") {
      return (
        <img
          src="https://s3.macosicons.com/macosicons/icons/GecwaBmkFQ/lowResPngFile_c3ef21fe8fabfd9d23fcc3ab3134dcf9_GecwaBmkFQ.png"
          alt="folder"
          className="w-14 h-14 drop-shadow-lg object-contain"
          onError={(e) => {
            e.target.src = 'https://s3-new.macosicons.com/macosicons/parse/MacOS_Default_Folder_icon_GecwaBmkFQ_lowResPng-6d37abc4ac.png';
          }}
        />
      );
    }
    
    const isPdf = item.type === "pdf" || item.name?.toLowerCase().endsWith(".pdf");
    if (isPdf) {
      return (
        <img
          src="https://s3.macosicons.com/macosicons/icons/ayIhAsqzsY/lowResPngFile_55b757e27580fefb9bd856a23abf6d0f_low_res_Pdf_Document.png"
          alt="pdf"
          className="w-14 h-14 drop-shadow-lg object-contain"
        />
      );
    }

    const isTxt = item.type === "document" || item.name?.toLowerCase().endsWith(".txt");
    if (isTxt) {
      return (
        <img
          src="https://s3.macosicons.com/macosicons/icons/aExwB3ULuk/lowResPngFile_a819aac512e7261fee3310f1bbdaada7_aExwB3ULuk.png"
          alt="txt"
          className="w-14 h-14 drop-shadow-lg object-contain"
        />
      );
    }

    if (item.type === "webloc") {
      return (
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shrink-0 mb-1">
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
      );
    }

    if (item.type === "image" && item.url) {
      return (
        <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/20 shadow-lg shrink-0 mb-1">
          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
        </div>
      );
    }

    return <FiFile className="w-14 h-14 text-white/80 drop-shadow-lg" />;
  };

  return (
    <div
      className="fixed inset-0 w-full h-full h-[100dvh] max-w-full max-h-full overflow-hidden bg-cover bg-center desktop-area bg-[#020202]"
      style={
        wallpaper && wallpaper !== "shader"
          ? { backgroundImage: `url(${wallpaper})` }
          : undefined
      }
      onContextMenu={(e) => e.preventDefault()}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDesktopFileDrop(e);
      }}
      onClick={() => {
        setSelectedItem(null);
      }}
    >
      {/* Background Shader */}
      {(!wallpaper || wallpaper === "shader") && (
        <ShaderGroupSwitcher
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            minWidth: 0,
            minHeight: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Background "svart hull" Branding */}
      <div className="absolute top-9 sm:top-12 md:top-14 left-1/2 -translate-x-1/2 z-0 pointer-events-none select-none text-center flex flex-col items-center w-full px-3 sm:w-auto sm:px-0">
        <h1
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white/90 tracking-[0.16em] font-normal drop-shadow-[0_4px_30px_rgba(0,0,0,0.85)] leading-none font-migha"
          style={{ fontFamily: "'Migha Display', 'Migha', sans-serif" }}
        >
          svart hull
        </h1>
        <span
          className="text-[10px] sm:text-xs md:text-sm text-white/60 tracking-[0.35em] font-normal mt-1.5 sm:mt-2 drop-shadow-md font-migha"
          style={{ fontFamily: "'Migha Display', 'Migha', sans-serif" }}
        >
          dev
        </span>

        {/* Mobile Desktop Icons - In riga sotto alla scritta dev con giusto margine */}
        {!isLocked && showIcons && (
          <div className="sm:hidden mt-6 flex flex-row items-start justify-center gap-5 flex-wrap pointer-events-auto">
            {allDesktopItems.map((item, index) => {
              const isCut = isCutMode && clipboard && clipboard.some(c => c.id === item.id);
              return (
                <motion.div
                  key={`mobile-${item.id}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: isCut ? 0.45 : 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    flex flex-col items-center justify-center w-20 p-2 rounded-xl cursor-pointer
                    active:bg-white/10 active:scale-95 transition-all
                    ${selectedItem === item.id ? "bg-blue-500/30" : ""}
                    ${isCut ? "opacity-45" : ""}
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemDoubleClick(item);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedItem(item.id);
                  }}
                >
                  <div className="flex items-center justify-center">
                    {getDesktopItemIcon(item)}
                  </div>
                  
                  {editingItem === item.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => handleRenameSubmit(item)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameSubmit(item);
                        if (e.key === "Escape") {
                          setEditingItem(null);
                          setEditName("");
                        }
                      }}
                      className="w-full text-center text-xs text-white bg-blue-500/50 rounded px-1 py-0.5 outline-none mt-1"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-[11px] text-white/90 font-medium text-center mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] line-clamp-2 break-all leading-tight">
                      {item.name}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Only show TopBar, Windows, and Dock when NOT locked */}
      {!isLocked && (
        <>
          <div className="absolute left-0 right-0 top-0 z-40">
            <TopBar
              appTitle={(() => {
                const active = windows.filter(w => !w.isClosing);
                return active.length ? (active[active.length - 1].appId === "Finder" ? "Projects" : active[active.length - 1].appId) : "";
              })()}
              setStage={setStage}
            />
          </div>

          {/* Desktop Widgets - Fixed on background (hidden on mobile) */}
          <div className="hidden sm:flex absolute sm:top-12 sm:right-6 flex-col gap-3 sm:gap-4 z-0 pointer-events-auto select-none sm:items-stretch">
            <AvailabilityWidget />
            <MusicWidget />
          </div>

          {/* Desktop Icons (Desktop/Tablet) */}
          {showIcons && (
            <div className="hidden sm:block absolute inset-0 pointer-events-none">
              {allDesktopItems.map((item, index) => {
                const defaultX = 16 + index * 100;
                const defaultY = 32 + index * 100;
                const itemX = item.x !== undefined ? item.x : defaultX;
                const itemY = item.y !== undefined ? item.y : defaultY;
                const isCut = isCutMode && clipboard && clipboard.some(c => c.id === item.id);
                return (
                <motion.div
                  key={item.id}
                  drag
                  dragMomentum={false}
                  dragElastic={0}
                  dragTransition={{ power: 0, modifyTargetVelocity: () => 0 }}
                  initial={{ opacity: 0, scale: 0.8, x: itemX, y: itemY }}
                  animate={{ opacity: isCut ? 0.45 : 1, scale: 1, x: itemX, y: itemY }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    absolute top-0 left-0 pointer-events-auto flex flex-col items-center justify-center w-20 p-2 rounded-lg cursor-grab active:cursor-grabbing
                    ${selectedItem === item.id ? "bg-blue-500/40" : "hover:bg-white/10"}
                    ${isCut ? "opacity-45" : ""}
                    transition-colors
                  `}
                  onDragEnd={(e, info) => {
                    const newX = itemX + info.offset.x;
                    const newY = itemY + info.offset.y;
                    
                    if (item.type === 'folder') {
                      const updated = desktopFolders.map(f => 
                        f.id === item.id ? { ...f, x: newX, y: newY } : f
                      );
                      setDesktopFolders(updated);
                      localStorage.setItem('os_desktop_folders', JSON.stringify(updated));
                      window.dispatchEvent(new CustomEvent("os_desktop_sync"));
                    } else {
                      const updated = desktopFiles.map(f => 
                        f.id === item.id ? { ...f, x: newX, y: newY } : f
                      );
                      setDesktopFiles(updated);
                      localStorage.setItem('os_desktop_files', JSON.stringify(updated));
                      window.dispatchEvent(new CustomEvent("os_desktop_sync"));
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item.id);
                  }}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedItem(item.id);
                  }}
                >
                  {getDesktopItemIcon(item)}
                  
                  {editingItem === item.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => handleRenameSubmit(item)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameSubmit(item);
                        if (e.key === "Escape") {
                          setEditingItem(null);
                          setEditName("");
                        }
                      }}
                      className="w-full text-center text-xs text-white bg-blue-500/50 rounded px-1 py-0.5 outline-none"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-xs text-white text-center mt-1 drop-shadow-md line-clamp-2 break-all">
                      {item.name}
                    </span>
                  )}
                </motion.div>
                );
              })}
            </div>
          )}

          <Dock />
        </>
      )}


      {/* Windows always render (even when locked) so audio/video keeps playing */}
      <div style={{ 
        opacity: isLocked ? 0 : 1, 
        pointerEvents: isLocked ? 'none' : 'auto',
        transition: 'opacity 0.3s ease'
      }}>
        {windows.map((w) => (
          <WindowErrorBoundary key={w.id}>
            <AppWindow window={w} />
          </WindowErrorBoundary>
        ))}
      </div>

      {!isLocked && (
        <>

        </>
      )}

      {/* macOS Mobile Notification Banner (English) */}
      <AnimatePresence>
        {showMobileDockNotice && (
          <motion.div
            initial={{ opacity: 0, y: -45, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.94, filter: "blur(6px)" }}
            transition={{ type: "spring", damping: 24, stiffness: 320, mass: 0.8 }}
            className={`fixed left-2.5 right-2.5 max-w-[360px] mx-auto z-[999999] p-3.5 rounded-[22px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border backdrop-blur-3xl select-none sm:hidden transition-colors ${
              isDarkMode
                ? "bg-[#252528]/85 border-white/[0.18] text-white"
                : "bg-[#fbfbfd]/90 border-black/[0.1] text-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
            }`}
            style={{
              top: "calc(env(safe-area-inset-top, 0px) + 38px)",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', sans-serif",
            }}
          >
            <div className="flex items-start gap-3">
              {/* macOS Squircle App Icon */}
              <div className="w-10 h-10 rounded-[11px] overflow-hidden shrink-0 flex items-center justify-center bg-black/15 dark:bg-white/10 shadow-md border border-white/10 p-2">
                <img
                  src="/icons/logo.svg"
                  alt="Svart Hull"
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>

              {/* Notification Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2 leading-none">
                  <span className={`text-[13px] font-semibold tracking-tight whitespace-nowrap ${isDarkMode ? "text-white" : "text-neutral-900"}`}>
                    Bottom Bar
                  </span>
                  <div className="flex items-center gap-1.5 ml-auto shrink-0">
                    <span className={`text-[11px] whitespace-nowrap ${isDarkMode ? "text-white/40" : "text-neutral-500"}`}>
                      now
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowMobileDockNotice(false)}
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] active:scale-90 transition ${
                        isDarkMode
                          ? "bg-white/10 hover:bg-white/20 text-white/70"
                          : "bg-black/5 hover:bg-black/10 text-neutral-600"
                      }`}
                      aria-label="Dismiss notification"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className={`text-[12px] mt-1.5 leading-snug font-normal ${isDarkMode ? "text-white/80" : "text-neutral-600"}`}>
                  Tap the bottom bar icons to open Projects, Launchpad, Contact, Music, About, or Instagram.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium macOS Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[999999] flex items-center gap-3 px-4 py-2.5 rounded-xl shadow-2xl border backdrop-blur-md select-none ${
              isDarkMode 
                ? "bg-[#2D2D2D]/95 border-white/10 text-white" 
                : "bg-white/95 border-gray-200 text-gray-800"
            }`}
          >
            {toast.type === "success" && (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            )}
            {toast.type === "error" && (
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0 font-bold text-xs">
                !
              </div>
            )}
            {toast.type === "info" && (
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 font-bold text-xs">
                i
              </div>
            )}
            <span className="text-xs font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image/Video Lightbox */}
      <AnimatePresence>
        {previewImage && (previewImage.type === "image" || previewImage.type === "video") && (
          <motion.div
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X size={20} />
            </button>
            
            {previewImage.type === "video" ? (
              <video 
                src={previewImage.url} 
                controls 
                autoPlay
                className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-2xl object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img 
                src={previewImage.url} 
                alt={previewImage.name} 
                className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-2xl object-contain select-none"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
