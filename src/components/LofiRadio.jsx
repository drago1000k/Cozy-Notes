import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TRACKS } from '../utils/lofiTracks';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

export default function LofiRadio() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChannelId, setCurrentChannelId] = useState(TRACKS[0].id);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef(null);
  const radioRef = useRef(null);

  // Thêm logic nhận diện Mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggleRadio = () => setIsOpen(prev => !prev);
  const currentChannel = TRACKS.find(t => t.id === currentChannelId) || TRACKS[0];
  const currentTrack = currentChannel.files[currentTrackIndex];

  // Close overlay on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (radioRef.current && !radioRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Adjust volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Automatically play the next track when currentTrack changes
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.debug('Autoplay prevented on track change', e);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack, isPlaying]); // Trigger only when the track changes

  // Handle play/pause toggle securely
  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      // setIsPlaying(false) will be naturally handled by the onPause native event
    } else {
      audioRef.current.play().catch(e => console.debug('Play prevented', e));
      // setIsPlaying(true) will be naturally handled by the onPlay native event
    }
  };

  // Skip forward, loops back to index 0 naturally
  const handleNext = () => {
    if (currentChannel.files.length > 0) {
      setCurrentTrackIndex((prev) => (prev + 1) % currentChannel.files.length);
    }
  };

  // Skip backward
  const handlePrev = () => {
    if (currentChannel.files.length > 0) {
      setCurrentTrackIndex((prev) => (prev - 1 + currentChannel.files.length) % currentChannel.files.length);
    }
  };

  // Called natively when track naturally ends
  const handleTrackEnded = () => {
    handleNext();
    setIsPlaying(true); // Force state to remain playing for the next song
  };

  const handleChannelSelect = (channelId) => {
    setCurrentChannelId(channelId);
    setCurrentTrackIndex(0);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Tách giao diện Popup ra một biến riêng để dễ đưa vào Portal
  const popupContent = (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      className={`${isMobile ? 'relative' : 'absolute'} rounded-xl shadow-2xl overflow-hidden flex flex-col`}
      style={{
        ...(isMobile ? {} : { bottom: 60, right: -60 }),
        width: 280, height: 380,
        background: 'linear-gradient(160deg, #fef7ed 0%, #fde6c4 100%)',
        border: '2px solid #c4956a',
        zIndex: 50,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex bg-[#e0be9c] p-1 border-b border-[#c4956a]">
        {TRACKS.map(channel => (
          <button
            key={channel.id}
            onClick={() => handleChannelSelect(channel.id)}
            className="flex-1 py-1.5 text-xs font-bold font-['Nunito'] cursor-pointer transition-colors"
            style={{
              background: currentChannelId === channel.id ? '#fde6c4' : 'transparent',
              color: currentChannelId === channel.id ? '#5a311b' : '#8b5e3c',
              borderRadius: 6,
            }}
          >
            {channel.emoji} {channel.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center p-4 border-b border-[#e0be9c] bg-[rgba(255,255,255,0.4)]">
        <div className="w-12 h-12 rounded-full bg-[#f5c97a] mb-2 flex items-center justify-center text-2xl shadow-inner border border-[#d4a574]">
          {currentChannel.emoji}
        </div>
        <h3 className="font-['Patrick_Hand'] text-lg text-[#5a311b] mb-0 leading-tight text-center w-full truncate">
          {currentTrack?.name || 'No Track'}
        </h3>
        <p className="text-xs text-[#a0714f] font-['Nunito'] mb-3">
          {isPlaying ? '♪ Playing...' : 'Paused'}
        </p>

        <div className="flex items-center gap-4">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handlePrev} className="p-2 rounded-full bg-[#e0be9c] text-[#5a311b] cursor-pointer">
            <SkipBack size={16} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleTogglePlay} className="p-3 rounded-full bg-[#e06d41] text-white cursor-pointer shadow-md">
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleNext} className="p-2 rounded-full bg-[#e0be9c] text-[#5a311b] cursor-pointer">
            <SkipForward size={16} />
          </motion.button>
        </div>

        <div className="w-full flex items-center gap-2 mt-3 px-2">
          <span className="text-[10px] text-[#a0714f] font-['Nunito'] w-6 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1.5 bg-[#c4956a] rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: '#e06d41' }}
          />
          <span className="text-[10px] text-[#a0714f] font-['Nunito'] w-6">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {currentChannel.files.map((file, idx) => (
          <div
            key={file.url}
            onClick={() => {
              setCurrentTrackIndex(idx);
              if (!isPlaying) handleTogglePlay();
            }}
            className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors mb-1"
            style={{
              background: currentTrackIndex === idx ? 'rgba(245,158,11,0.2)' : 'transparent',
              border: currentTrackIndex === idx ? '1px solid #f59e0b' : '1px solid transparent',
            }}
          >
            <span className="text-xs text-[#a0714f] w-4">{idx + 1}.</span>
            <span className="text-sm font-['Nunito'] font-semibold text-[#6d4a30] truncate flex-1">
              {file.name}
            </span>
            {currentTrackIndex === idx && isPlaying && (
              <motion.div
                animate={{ scaleY: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-1 h-3 bg-[#e06d41] rounded-full"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 p-3 bg-[#e0be9c] border-t border-[#c4956a]">
        <Volume2 size={16} color="#6d4a30" />
        <input
          type="range" min="0" max="1" step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-1.5 bg-[#c4956a] rounded-lg appearance-none cursor-pointer"
          style={{ accentColor: '#e06d41' }}
        />
      </div>
    </motion.div>
  );

  return (
    <div className="relative" style={{ width: 44, height: 52 }} ref={radioRef}>
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.url}
          onEnded={handleTrackEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={(e) => {
            if (!e.target.ended) {
              setIsPlaying(false);
            }
          }}
          onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.target.duration)}
        />
      )}

      {/* Radio body */}
      <motion.div
        className="relative cursor-pointer"
        onClick={handleToggleRadio}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        title="Lofi Radio"
        style={{ width: 44, height: 52, zIndex: 10 }}
      >
        <motion.div
          className="absolute"
          style={{ width: 2, height: 18, top: -14, left: 20, background: '#4a5568', borderRadius: 1, transformOrigin: 'bottom center' }}
          animate={isPlaying ? { rotate: [0, 3, -3, 0] } : { rotate: 0 }}
          transition={isPlaying ? { repeat: Infinity, duration: 2, ease: 'easeInOut' } : {}}
        />
        <div className="absolute rounded-full" style={{ width: 5, height: 5, top: -17, left: 18.5, background: isPlaying ? '#f59e0b' : '#94a3b8' }} />
        <div className="absolute rounded-lg" style={{
          width: 44, height: 38, bottom: 0, left: 0,
          background: 'linear-gradient(160deg, #8b6347 0%, #6d4a30 100%)',
          border: '2px solid #5a3820',
          boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
        }}>
          <div className="absolute rounded-full" style={{
            width: 20, height: 20, top: 4, left: 4,
            background: 'radial-gradient(circle, #3d2b1f 40%, #5a3820 100%)',
            border: '1.5px solid #a0714f',
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} className="absolute" style={{
                width: 12, height: 1, top: 5 + i * 4, left: 3,
                background: '#a0714f', opacity: 0.5,
              }} />
            ))}
          </div>
          <div className="absolute rounded-full" style={{ width: 8, height: 8, top: 5, right: 6, background: '#f59e0b', border: '1px solid #d97706' }} />
          <div className="absolute rounded-full" style={{ width: 6, height: 6, top: 16, right: 7, background: '#94a3b8', border: '1px solid #64748b' }} />
          <motion.div
            className="absolute rounded-full"
            style={{ width: 4, height: 4, bottom: 5, right: 7 }}
            animate={{ background: isPlaying ? ['#22c55e', '#16a34a', '#22c55e'] : '#64748b' }}
            transition={isPlaying ? { repeat: Infinity, duration: 1.5 } : {}}
          />
        </div>
        <div className="absolute rounded-b" style={{ width: 6, height: 4, bottom: -2, left: 6, background: '#3d2b1f' }} />
        <div className="absolute rounded-b" style={{ width: 6, height: 4, bottom: -2, right: 6, background: '#3d2b1f' }} />
      </motion.div>

      {/* Render Popup via Portal on Mobile, inline on Desktop */}
      <AnimatePresence>
        {isOpen && (
          isMobile ? createPortal(
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
              {popupContent}
            </div>,
            document.body
          ) : popupContent
        )}
      </AnimatePresence>
    </div>
  );
}