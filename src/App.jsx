import { useEffect, useState } from "react";
import Desktop from "./layouts/DesktopWindow";
import BootLoader from "./components/BootLoader";
import { useAppStore } from "./store/Appstore";

// All images used across Music and About apps — preloaded at startup
const PRELOAD_IMAGES = [
  "/icons/sh.jpg",
  "/icons/logo.svg",
  "/music/thechasecover.jpg",
  "/music/cornfieldchasecover.jpg",
  "/music/timecover.jpg",
];

export default function App() {
  const [booting, setBooting] = useState(true);
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  // Preload images during boot so they're instant when apps open
  useEffect(() => {
    PRELOAD_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  const handleStage = (newStage) => {
    if (newStage === "restart") {
      setBooting(true);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {booting && <BootLoader onComplete={() => setBooting(false)} />}
      <Desktop setStage={handleStage} isLocked={false} />
    </div>
  );
}
