import { create } from "zustand";
import { songs } from "../constants/songs";

// Create persistent audio instance
export const audioInstance = typeof window !== 'undefined' ? new Audio() : null;

if (audioInstance && songs.length > 0) {
  audioInstance.src = songs[0].src;
  audioInstance.preload = "auto";
  audioInstance.volume = 1;
}

export const useAppStore = create((set, get) => ({
  windows: [],
  maxZ: 1,
  isLocked: false,
  isAudioPlaying: false,
  isDarkMode: localStorage.getItem('os_dark_mode') === 'true',
  currentTrack: songs[0],
  setCurrentTrack: (track) => {
    if (audioInstance && track?.src) {
      const wasPlaying = get().isAudioPlaying;
      audioInstance.src = track.src;
      if (wasPlaying) {
        audioInstance.play().catch((e) => console.log("Play failed:", e));
      }
    }
    set({ currentTrack: track });
  },
  nextTrack: () => {
    const state = get();
    const idx = songs.findIndex(s => s.title === state.currentTrack?.title);
    const nextIdx = idx === -1 ? 0 : (idx + 1) % songs.length;
    const nextSong = songs[nextIdx];
    if (audioInstance && nextSong?.src) {
      audioInstance.src = nextSong.src;
      if (state.isAudioPlaying) {
        audioInstance.play().catch((e) => console.log("Play failed:", e));
      }
    }
    set({ currentTrack: nextSong });
  },
  prevTrack: () => {
    const state = get();
    const idx = songs.findIndex(s => s.title === state.currentTrack?.title);
    const prevIdx = idx <= 0 ? songs.length - 1 : idx - 1;
    const prevSong = songs[prevIdx];
    if (audioInstance && prevSong?.src) {
      audioInstance.src = prevSong.src;
      if (state.isAudioPlaying) {
        audioInstance.play().catch((e) => console.log("Play failed:", e));
      }
    }
    set({ currentTrack: prevSong });
  },
  toggleDarkMode: () => set((state) => {
    const next = !state.isDarkMode;
    localStorage.setItem('os_dark_mode', String(next));
    return { isDarkMode: next };
  }),

  openApp: (appId, component) =>
    set((state) => {
      let finalAppId = appId;
      let finalComp = component;
      if (typeof appId === "object" && appId !== null && ("comp" in appId || "component" in appId)) {
        finalComp = appId.comp || appId.component;
        finalAppId = appId.appId || appId.id;
      }
      const newZ = state.maxZ + 1;
      return {
        maxZ: newZ,
        windows: [
          ...state.windows,
          {
            id: Date.now(),
            appId: finalAppId,
            component: finalComp,
            minimized: false,
            maximized: false,
            z: newZ,
            // Store original position for restore
            prevSize: null,
          },
        ],
      };
    }),

  closeApp: (id) =>
    set((state) => {
      const targetWin = state.windows.find((w) => w.id === id);
      if (!targetWin || targetWin.isClosing) return state;

      setTimeout(() => {
        set((curr) => ({
          windows: curr.windows.filter((w) => w.id !== id),
        }));
      }, 220);

      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, isClosing: true } : w
        ),
      };
    }),

  focusApp: (id) =>
    set((state) => {
      const newZ = state.maxZ + 1;
      return {
        maxZ: newZ,
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, z: newZ } : w
        ),
      };
    }),

  minimizeApp: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      ),
    })),

  restoreApp: (id) =>
    set((state) => {
      const newZ = state.maxZ + 1;
      return {
        maxZ: newZ,
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, minimized: false, z: newZ } : w
        ),
      };
    }),

  toggleMaximize: () => {},

  setLocked: (locked) =>
    set({ isLocked: locked }),

  // Hide all windows (for lock screen)
  hideAllWindows: () =>
    set((state) => ({
      windows: state.windows.map((w) => ({ ...w, minimized: true })),
    })),

  toggleAudio: () =>
    set((state) => {
      if (!audioInstance) return state;
      const willPlay = !state.isAudioPlaying;
      if (willPlay) {
        if (!audioInstance.src && state.currentTrack?.src) {
          audioInstance.src = state.currentTrack.src;
        }
        audioInstance.play().catch((e) => console.log("Play failed:", e));
      } else {
        audioInstance.pause();
      }
      return { isAudioPlaying: willPlay };
    }),

  playAudio: () =>
    set((state) => {
      if (audioInstance) {
        if (!audioInstance.src && state.currentTrack?.src) {
          audioInstance.src = state.currentTrack.src;
        }
        audioInstance.play().catch((e) => console.log("Play failed:", e));
      }
      return { isAudioPlaying: true };
    }),

  pauseAudio: () =>
    set(() => {
      if (audioInstance) {
        audioInstance.pause();
      }
      return { isAudioPlaying: false };
    }),
}));

if (audioInstance) {
  audioInstance.onended = () => {
    useAppStore.getState().nextTrack();
  };
}
