import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Whiteboard from './components/Whiteboard';
import StickyNote from './components/StickyNote';
import NewNoteModal from './components/NewNoteModal';
import NewNoteButton from './components/NewNoteButton';
import CozyDesk from './components/CozyDesk';
import RainOverlay from './components/RainOverlay';
import MoodSelector from './components/MoodSelector';
import TimerModal from './components/TimerModal';
import AuthScreen from './components/AuthScreen';
import { toggleRainSound, playSplash, playChime, playMoodSound, playAlarm } from './utils/audio';
import { getAiResponse } from './utils/aiResponse';
import { useAuth } from './context/AuthContext';
import { useFirestoreSync } from './hooks/useFirestoreSync';
import { LogOut } from 'lucide-react';

function formatDate() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getRandomNotePosition(boardEl) {
  if (!boardEl) return { x: 30, y: 30 };
  const BOARD_BORDER = 14;
  const BOARD_HEADER = 44;
  const NOTE_W = 162;
  const NOTE_H = 168;
  const PAD = 16;
  const innerW = boardEl.offsetWidth - BOARD_BORDER * 2;
  const innerH = boardEl.offsetHeight - BOARD_BORDER * 2;
  const areaW = innerW;
  const areaH = innerH - BOARD_HEADER;
  const maxX = Math.max(PAD, areaW - NOTE_W - PAD);
  const maxY = Math.max(PAD, areaH - NOTE_H - PAD);
  return {
    x: PAD + Math.floor(Math.random() * maxX),
    y: PAD + Math.floor(Math.random() * maxY),
  };
}

export default function App() {
  // --- State ---
  const { currentUser, logout } = useAuth();
  const { notes, setNotes, moodState, setMoodState, loading } = useFirestoreSync();

  const [showModal, setShowModal] = useState(false);
  const [mascotState, setMascotState] = useState('idle');
  const [timerState, setTimerState] = useState('idle'); // 'idle', 'selecting', 'running', 'complete'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [, setMaxZIndex] = useState(20);

  const whiteboardRef = useRef(null);
  const celebrateTimeoutRef = useRef(null);
  const aiTimeoutRef = useRef(null);

  const currentMood = moodState.current;
  const isRaining = currentMood === 'rainy';

  // --- Effects ---

  // Persist mood
  useEffect(() => {
    // Apply body class
    document.body.className = `theme-${currentMood}`;
    
    // Toggle rain sound automatically when mood changes to/from rainy
    toggleRainSound(currentMood === 'rainy');
  }, [currentMood, moodState]);

  // Pomodoro Timer
  useEffect(() => {
    let interval;
    if (timerState === 'running' && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timerState === 'running' && timeLeft === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimerState('complete');
      playAlarm();
    }
    return () => clearInterval(interval);
  }, [timerState, timeLeft]);

  // Keyboard shortcut: N = new note
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === 'n' && !showModal && tag !== 'TEXTAREA' && tag !== 'INPUT') {
        setShowModal(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showModal]);

  // Mascot State overrides
  useEffect(() => {
    if (mascotState === 'celebrating') return;
    if (showModal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMascotState('working');
    } else {
      setMascotState('idle');
    }
  }, [showModal, mascotState]);

  // --- Handlers ---

  const handleSelectMood = useCallback((moodId) => {
    setMoodState((prev) => {
      if (prev.current === moodId) return prev;
      playMoodSound(moodId);
      const newHistory = [...prev.history, moodId].slice(-10); // Keep last 10
      return { current: moodId, history: newHistory };
    });
  }, [setMoodState]);

  const toggleTimer = useCallback(() => {
    if (timerState === 'idle') {
      setTimerState('selecting');
    } else if (timerState === 'running') {
      if (window.confirm("Stop the timer?")) {
        setTimerState('idle');
        setTimeLeft(25 * 60);
      }
    }
  }, [timerState]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const bringToFront = useCallback((id) => {
    setMaxZIndex((prev) => {
      const nextZ = prev + 1;
      setNotes((notesList) =>
        notesList.map((n) => (n.id === id ? { ...n, zIndex: nextZ } : n))
      );
      return nextZ;
    });
  }, [setNotes]);

  const handleAddNote = useCallback((title, text, colorIndex, isAi = false) => {
    const pos = getRandomNotePosition(whiteboardRef.current);
    const rotation = (Math.random() - 0.5) * 6; // -3 to +3 degrees
    const newNoteId = `note-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    
    setMaxZIndex((prevZ) => {
      const nextZ = prevZ + 1;
      setNotes((prev) => {
        if (prev.some(n => n.id === newNoteId)) return prev; // Prevent duplicate execution in StrictMode
        return [
          ...prev,
          {
            id: newNoteId,
            title,
            text,
            colorIndex,
            x: pos.x,
            y: pos.y,
            rotation,
            zIndex: nextZ,
            done: false,
            date: formatDate(),
            isAi
          },
        ];
      });
      return nextZ;
    });
  }, [setNotes]);

  const handleDelete = useCallback((id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, [setNotes]);

  const handleClearAll = useCallback(() => {
    if (window.confirm('Are you sure you want to delete all notes?')) {
      setNotes([]);
    }
  }, [setNotes]);

  const handleToggleDone = useCallback((id) => {
    setNotes((prev) => {
      const note = prev.find((n) => n.id === id);
      if (note && !note.done) {
        setMascotState('celebrating');
        if (celebrateTimeoutRef.current) clearTimeout(celebrateTimeoutRef.current);
        celebrateTimeoutRef.current = setTimeout(() => {
          setMascotState('idle');
        }, 2000);
      }
      return prev.map((n) => (n.id === id ? { ...n, done: !n.done } : n));
    });
  }, [setNotes]);

  const handlePositionChange = useCallback((id, pos) => {
    setNotes((prev) => prev.map((n) => {
      if (n.id !== id) return n;
      
      let newX = pos.x;
      let newY = pos.y;
      
      const boardEl = whiteboardRef.current;
      if (boardEl) {
        const NOTE_W = 162;
        const NOTE_H = 168;
        const BOARD_BORDER = 14;
        const BOARD_HEADER = 44;
        
        const innerW = boardEl.offsetWidth - BOARD_BORDER * 2;
        const innerH = boardEl.offsetHeight - BOARD_BORDER * 2;
        const max_X = Math.max(0, innerW - NOTE_W);
        const max_Y = Math.max(0, innerH - BOARD_HEADER - NOTE_H);
        
        newX = Math.max(0, Math.min(newX, max_X));
        newY = Math.max(0, Math.min(newY, max_Y));
      }
      
      return { ...n, x: newX, y: newY };
    }));
  }, [setNotes]);

  const handleSendBottle = useCallback((message) => {
    playSplash();
    
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    aiTimeoutRef.current = setTimeout(() => {
      playChime();
      const response = getAiResponse(currentMood, message);
      handleAddNote('', response, 0, true);
    }, 10000);
  }, [currentMood, handleAddNote]);

  const doneCount = notes.filter((n) => n.done).length;

  const [magicalParticles, setMagicalParticles] = useState([]);

  useEffect(() => {
    if (currentMood === 'magical') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMagicalParticles([...Array(20)].map(() => ({
        width: Math.random() * 4 + 2,
        height: Math.random() * 4 + 2,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 5,
      })));
    }
  }, [currentMood]);

  return (
    <div className={`wallpaper w-full h-full relative overflow-hidden transition-colors duration-1000 theme-${currentMood}`}>
      
      {/* Weather Rain Overlay */}
      <RainOverlay active={isRaining} />

      {/* Magical Particles Overlay */}
      {currentMood === 'magical' && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {magicalParticles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: p.width,
                height: p.height,
                top: p.top,
                left: p.left,
                boxShadow: '0 0 10px rgba(255,255,255,0.8)',
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Ambient light for themes */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-1000"
        style={{
          background: currentMood === 'rainy'
            ? 'radial-gradient(ellipse at 50% 10%, rgba(134,156,224,0.05) 0%, transparent 60%)'
            : currentMood === 'magical'
            ? 'radial-gradient(ellipse at 50% 50%, rgba(167,139,250,0.1) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 20% 15%, rgba(255,220,150,0.12) 0%, transparent 50%)',
          opacity: currentMood === 'cloudy' ? 0 : 1,
        }}
      />



      {/* ── Auth Screen ── */}
      {!currentUser && !loading && (
        <AuthScreen setMascotState={setMascotState} />
      )}

      {/* ── Top Navigation Bar ── */}
      {currentUser && (
        <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 24px',
          background: 'var(--color-whiteboard)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-whiteboard-border)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          opacity: 0.95,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🪴</span>
          <div>
            <h1 style={{ margin: 0, lineHeight: 1, fontFamily: "'Patrick Hand', cursive", fontWeight: 700, fontSize: 22, color: 'var(--color-text)' }}>
              Cozy Notes
            </h1>
            <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
              {moodState.history.slice(-5).map((m, i) => (
                <div 
                  key={i} 
                  title={m}
                  style={{ 
                    width: 6, height: 6, borderRadius: '50%', 
                    background: m === 'clear' ? '#f59e0b' : m === 'rainy' ? '#3b82f6' : m === 'magical' ? '#a855f7' : '#9ca3af',
                    opacity: i === 4 ? 1 : 0.4
                  }} 
                />
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MoodSelector currentMood={currentMood} onSelectMood={handleSelectMood} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 999, background: 'var(--color-bg)', border: '1px solid var(--color-whiteboard-border)' }}>
            <span style={{ fontSize: 14 }}>📋</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', fontFamily: 'Nunito, sans-serif' }}>
              {notes.length} note{notes.length !== 1 ? 's' : ''}
            </span>
          </div>

          {notes.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors"
              style={{ background: 'var(--color-bg)', borderColor: 'var(--color-whiteboard-border)' }}
              title="Clear all notes"
            >
              <span style={{ fontSize: 13 }}>🗑️</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', fontFamily: 'Nunito, sans-serif' }}>Clear</span>
            </button>
          )}

          <AnimatePresence>
            {doneCount > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 999, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.4)' }}
              >
                <span style={{ fontSize: 14 }}>✅</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#34d399', fontFamily: 'Nunito, sans-serif' }}>
                  {doneCount} done
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer transition-colors hover:opacity-80"
            style={{ 
              background: 'linear-gradient(135deg, var(--color-note-1), var(--color-note-4))', 
              borderColor: 'var(--color-wood)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            title="Sign out"
          >
            <LogOut size={14} color="var(--color-wood)" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-wood)', fontFamily: 'Nunito, sans-serif' }}>Exit</span>
          </button>
        </div>
        </motion.nav>
      )}

      {/* ── Whiteboard ── */}
      {currentUser && (
        <div className="absolute inset-0" style={{ zIndex: 10 }}>
        <Whiteboard
          boardRef={whiteboardRef}
          totalNotes={notes.length}
          doneNotes={doneCount}
        >
          <AnimatePresence>
            {notes.map((note) => (
              <StickyNote
                key={note.id}
                note={note}
                whiteboardRef={whiteboardRef}
                onDelete={handleDelete}
                onToggleDone={handleToggleDone}
                onPositionChange={handlePositionChange}
                onInteract={bringToFront}
              />
            ))}
          </AnimatePresence>
        </Whiteboard>
        </div>
      )}

      {/* ── Desk Scene ── */}
      <CozyDesk
        mascotState={mascotState}
        mood={currentMood}
        timerMode={timerState === 'running'}
        timeLeft={formatTime(timeLeft)}
        onToggleTimer={toggleTimer}
        onSendBottle={handleSendBottle}
      />

      {/* ── New Note FAB ── */}
      {currentUser && (
        <div style={{ position: 'relative', zIndex: 35 }}>
          <NewNoteButton onClick={() => setShowModal(true)} />
        </div>
      )}

      {/* ── New Note Modal ── */}
      <AnimatePresence>
        {showModal && (
          <NewNoteModal
            onClose={() => setShowModal(false)}
            onAdd={handleAddNote}
          />
        )}
      </AnimatePresence>

      {/* ── Timer Modal ── */}
      <AnimatePresence>
        {(timerState === 'selecting' || timerState === 'complete') && (
          <TimerModal
            mode={timerState}
            onClose={() => setTimerState('idle')}
            onStart={(seconds) => {
              setTimeLeft(seconds);
              setTimerState('running');
            }}
            onAcknowledge={() => {
              setTimerState('idle');
              setTimeLeft(25 * 60);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
