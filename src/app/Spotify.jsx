import React, { useState, useRef, useEffect } from "react";
import { useAppStore, audioInstance } from "../store/Appstore";
import { songs } from "../constants/songs";
import { 
  FiSearch, 
  FiHome, 
  FiRadio, 
  FiClock, 
  FiMic, 
  FiMusic, 
  FiTv, 
  FiUser, 
  FiVolume2, 
  FiPlay, 
  FiPause, 
  FiSkipBack, 
  FiSkipForward, 
  FiRepeat, 
  FiShuffle, 
  FiSliders, 
  FiMenu,
  FiChevronRight
} from "react-icons/fi";
import { 
  BsGrid, 
  BsMusicNoteList,
  BsPinAngle,
  BsFileMusic
} from "react-icons/bs";

// Brand Logo for bottom player
const AppleLogoMini = () => (
  <img src="/icons/logo.svg" alt="Logo" className="w-3.5 h-3.5 object-contain opacity-60" />
);

// Traffic lights inside the Music sidebar
const TrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);

  return (
    <div className="flex items-center gap-2 group mr-4">
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

export default function MusicApp({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const storeIsPlaying = useAppStore((s) => s.isAudioPlaying);
  const storeCurrentTrack = useAppStore((s) => s.currentTrack);
  const nextTrack = useAppStore((s) => s.nextTrack);
  const prevTrack = useAppStore((s) => s.prevTrack);
  const toggleAudio = useAppStore((s) => s.toggleAudio);
  const setCurrentTrack = useAppStore((s) => s.setCurrentTrack);
  const playAudio = useAppStore((s) => s.playAudio);

  const [searchQuery, setSearchQuery] = useState("");
  const [volume, setVolume] = useState(() => (audioInstance ? audioInstance.volume : 1));

  const currentSongIndex = Math.max(0, songs.findIndex(s => s.title === storeCurrentTrack?.title));
  const currentSong = songs[currentSongIndex] || songs[0];

  const togglePlay = () => {
    toggleAudio();
  };

  const playSong = (index) => {
    const target = songs[index];
    if (!target) return;
    if (currentSong?.title === target.title) {
      toggleAudio();
      return;
    }
    setCurrentTrack(target);
    playAudio();
  };

  const profilePhoto = "/icons/sh.jpg";
  const profileName = "Svart Hull";

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className="relative flex h-full w-full overflow-hidden select-none" 
      style={{ 
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        background: isDarkMode ? "#1e1e1e" : "#ffffff"
      }}
    >

      {/* Sidebar */}
      <aside 
        className="hidden sm:flex w-52 lg:w-56 h-full flex-col flex-shrink-0 border-r select-none window-drag-handle justify-between"
        style={{ 
          background: isDarkMode ? "rgba(37, 37, 37, 0.9)" : "rgba(250, 250, 248, 0.9)", 
          borderColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)" 
        }}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Top traffic lights section */}
          <div className="h-[52px] flex items-center px-4 mt-2">
            <TrafficLights windowId={windowId} />
          </div>

          {/* Navigation links */}
          <nav className="px-2 py-1 space-y-4">
            <div className="space-y-0.5">
              <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                <FiSearch size={15} className="text-rose-500" />
                <span>Search</span>
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                <FiHome size={15} className="text-rose-500" />
                <span>Home</span>
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                <BsGrid size={14} className="text-rose-500" />
                <span>New</span>
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                <FiRadio size={15} className="text-rose-500" />
                <span>Radio</span>
              </button>
            </div>

            {/* Library Section */}
            <div>
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 select-none">Library</span>
              <div className="mt-1 space-y-0.5">
                <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                  <FiChevronRight size={10} className="text-gray-400 -ml-1 mr-0.5" />
                  <BsPinAngle size={13} className="text-rose-500 mr-1.5" />
                  <span>Pins</span>
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                  <FiClock size={14} className="text-rose-500" />
                  <span>Recently Added</span>
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                  <FiMic size={14} className="text-rose-500" />
                  <span>Artists</span>
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                  <BsFileMusic size={14} className="text-rose-500" />
                  <span>Albums</span>
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 transition-all">
                  <FiMusic size={14} className="text-rose-500" />
                  <span>Songs</span>
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                  <FiTv size={14} className="text-rose-500" />
                  <span>Music Videos</span>
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                  <FiUser size={14} className="text-rose-500" />
                  <span>Made for You</span>
                </button>
              </div>
            </div>

            {/* Playlists Section */}
            <div>
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 select-none">Playlists</span>
            </div>
          </nav>
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="p-3 border-t border-black/[0.05] dark:border-white/5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full overflow-hidden border border-black/10 dark:border-white/10 flex-shrink-0">
            <img src={profilePhoto} alt="User profile" className="w-full h-full object-cover" />
          </div>
          <span className="text-[12px] font-medium text-gray-800 dark:text-gray-200 truncate">{profileName}</span>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Toolbar Header */}
        <header 
          className="h-[52px] flex items-center justify-between px-3 sm:px-6 select-none border-b border-black/[0.08] dark:border-white/10 window-drag-handle"
          style={{ background: isDarkMode ? "#1e1e1e" : "#ffffff" }}
        >
          <div className="flex items-center gap-2">
            <div className="sm:hidden mr-1">
              <TrafficLights windowId={windowId} />
            </div>
            <span className="text-[13px] font-bold text-gray-900 dark:text-white select-none">Songs</span>
          </div>
          
          {/* Search bar & Settings toggle */}
          <div className="flex items-center gap-2.5">
            <button className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors">
              <FiSliders size={14} />
            </button>
            <div className="relative flex items-center bg-black/[0.04] dark:bg-white/[0.06] rounded-full px-2.5 py-1 w-28 sm:w-44 border border-black/[0.05] dark:border-white/[0.05]">
              <FiSearch size={12} className="text-gray-400 mr-1.5" />
              <input 
                type="text" 
                placeholder="Find in Songs" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[11px] outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
              />
            </div>
          </div>
        </header>

        {/* Albums Grid */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 pb-28 notes-no-scrollbar" style={{ scrollbarWidth: "none" }}>
          {filteredSongs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 dark:text-gray-500">
              <FiMusic size={40} className="mb-3 text-gray-300 dark:text-gray-700" />
              <p className="text-[13px] font-medium">No songs found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-x-4 sm:gap-y-6">
              {filteredSongs.map((song, i) => {
                // Find actual index in original songs array to play correctly
                const originalIndex = songs.findIndex(s => s.title === song.title);

                return (
                  <div 
                    key={song.title} 
                    onClick={() => playSong(originalIndex)} 
                    className="flex flex-col cursor-pointer group"
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden border border-black/5 dark:border-white/5 relative mb-2 shadow-sm bg-gray-100 dark:bg-gray-800">
                      <img 
                        src={song.img} 
                        alt={song.title} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:brightness-95 transition-all"
                        draggable={false}
                      />
                      
                      {/* Play overlay hover indicator */}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/95 text-gray-900 shadow-md flex items-center justify-center hover:scale-105 transition-transform">
                          {(currentSongIndex === originalIndex && storeIsPlaying) ? <FiPause size={14} className="fill-current" /> : <FiPlay size={14} className="fill-current ml-0.5" />}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-[12px] font-semibold text-gray-900 dark:text-white truncate leading-snug">
                        {song.title}
                      </span>
                      {song.isExplicit && (
                        <span className="text-[8px] font-bold bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-0.5 rounded flex-shrink-0">E</span>
                      )}
                      {song.isStarred && (
                        <span className="text-[10px] text-red-500 flex-shrink-0">★</span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5 leading-none">
                      {song.artist}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Apple Music Style Floating Media Control Player */}
        <div 
          className={`absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-16px)] sm:w-[620px] max-w-[620px] h-[52px] rounded-full border shadow-2xl flex items-center justify-between px-3 sm:px-5 z-40 transition-all ${
            isDarkMode ? "backdrop-blur-md" : "backdrop-blur-3xl"
          }`}
          style={{
            background: isDarkMode ? "rgba(20, 20, 20, 0.45)" : "rgba(255, 255, 255, 0.65)",
            borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.5)",
            boxShadow: isDarkMode 
              ? "0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)" 
              : "0 10px 30px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)"
          }}
        >
          {/* Controls on Left */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button className="hidden sm:block p-1 text-gray-500 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-400 transition-colors">
              <FiShuffle size={14} />
            </button>
            <button 
              onClick={prevTrack}
              className="p-1 text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 transition-colors"
            >
              <FiSkipBack size={15} className="fill-current" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-7 h-7 rounded-full bg-gray-900/10 hover:bg-gray-900/20 dark:bg-white/10 dark:hover:bg-white/20 flex items-center justify-center text-gray-800 dark:text-white transition-all"
            >
              {storeIsPlaying ? <FiPause size={12} className="fill-current" /> : <FiPlay size={12} className="fill-current ml-0.5" />}
            </button>
            <button 
              onClick={nextTrack}
              className="p-1 text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 transition-colors"
            >
              <FiSkipForward size={15} className="fill-current" />
            </button>
            <button className="hidden sm:block p-1 text-gray-500 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-400 transition-colors">
              <FiRepeat size={14} />
            </button>
          </div>

          {/* Album Title/Art in Center (with Apple Logo) */}
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.03] dark:border-white/[0.03] rounded-full max-w-[150px] sm:max-w-[240px] truncate">
            <img src={currentSong.img} className="w-6 h-6 rounded-md object-cover shadow-sm shrink-0" alt="art" />
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-gray-800 dark:text-white truncate leading-tight">{currentSong.title}</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 truncate leading-none mt-0.5">{currentSong.artist}</span>
            </div>
            <div className="hidden sm:block ml-2 pl-2 border-l border-black/10 dark:border-white/10 shrink-0">
              <AppleLogoMini />
            </div>
          </div>

          {/* Right Accessories (Volume, Lyrics, etc.) */}
          <div className="hidden md:flex items-center gap-2">
            <button className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors" title="Lyrics">
              <BsMusicNoteList size={13} />
            </button>
            <button className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors" title="Up Next">
              <FiMenu size={14} />
            </button>
            <button className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors flex items-center justify-center" title="Volume">
              <FiVolume2 size={14} />
            </button>
            <div 
              className="w-14 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative cursor-pointer" 
              title="Adjust Volume"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                if (audioInstance) audioInstance.volume = pos;
                setVolume(pos);
              }}
            >
              <div className="absolute top-0 left-0 h-full bg-rose-500 rounded-full transition-all" style={{ width: `${volume * 100}%` }}></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
