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
import ArchiveModal from './components/ArchiveModal';
import { toggleRainSound, playSplash, playChime, playMoodSound, playAlarm, playNewNoteSound } from './utils/audio';
import { getAiResponse } from './utils/aiResponse';
import { bulkOrganizeNotes, categorizeSingleNote } from './utils/aiAssistant';
import { useAuth } from './context/AuthContext';
import { useFirestoreSync } from './hooks/useFirestoreSync';
import { LogOut, Sparkles } from 'lucide-react';

function formatDate() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Calculate a random position within the currently visible viewport area based on scale
function getRandomNotePosition(viewportEl, scale = 1) {
  if (!viewportEl) return { x: 50, y: 50 };
  const PAD = 20;
  const NOTE_W = 162;
  const NOTE_H = 168;

  const viewW = viewportEl.clientWidth;
  const viewH = viewportEl.clientHeight;
  const sLeft = viewportEl.scrollLeft;
  const sTop = viewportEl.scrollTop;

  const minX = (sLeft / scale) + PAD;
  const minY = (sTop / scale) + PAD;
  const maxX = ((sLeft + viewW) / scale) - NOTE_W - PAD;
  const maxY = ((sTop + viewH) / scale) - NOTE_H - PAD;

  const safeMaxX = Math.max(minX, maxX);
  const safeMaxY = Math.max(minY, maxY);

  return {
    x: minX + Math.floor(Math.random() * (safeMaxX - minX + 1)),
    y: minY + Math.floor(Math.random() * (safeMaxY - minY + 1)),
  };
}

export default function App() {
  const { currentUser, logout } = useAuth();
  const { notes, setNotes, moodState, setMoodState, loading } = useFirestoreSync();

  const [showModal, setShowModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [mascotState, setMascotState] = useState('idle');
  const [timerState, setTimerState] = useState('idle'); 
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [, setMaxZIndex] = useState(20);
  
  const [boardScale, setBoardScale] = useState(1);

  // ── Feature 2: Auto-Organize toggle state ──────────────────────────────────
  const [isAutoOrganize, setIsAutoOrganize] = useState(false);
  // Tracks whether a bulk-organize AI call is currently in flight
  const [isOrganizing, setIsOrganizing] = useState(false);

  const whiteboardRef = useRef(null);
  const viewportRef = useRef(null);
  const celebrateTimeoutRef = useRef(null);
  const aiTimeoutRef = useRef(null);

  const currentMood = moodState.current;
  const isRaining = currentMood === 'rainy';

  useEffect(() => {
    document.body.className = `theme-${currentMood}`;
    toggleRainSound(currentMood === 'rainy');
  }, [currentMood, moodState]);

  useEffect(() => {
    let interval;
    if (timerState === 'running' && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timerState === 'running' && timeLeft === 0) {
      setTimeout(() => setTimerState('complete'), 0);
      playAlarm();
    }
    return () => clearInterval(interval);
  }, [timerState, timeLeft]);

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

  useEffect(() => {
    if (mascotState === 'celebrating') return;
    if (showModal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMascotState('working');
    } else {
      setMascotState('idle');
    }
  }, [showModal, mascotState]);

  // ── Feature 2: Bulk-organize effect ────────────────────────────────────────
  // Fires whenever the Auto-Organize toggle is switched ON.
  // Calls the AI, then animates all notes to their new cluster positions.
  useEffect(() => {
    if (!isAutoOrganize) return;

    const activeNotes = notes.filter((n) => !n.archived);
    if (activeNotes.length < 2) return; // Nothing meaningful to organize with < 2 notes

    let cancelled = false;
    setTimeout(() => setIsOrganizing(true), 0);

    bulkOrganizeNotes(activeNotes)
      .then((updates) => {
        if (cancelled) return;
        setNotes((prev) =>
          prev.map((n) => {
            const update = updates.find((u) => u.id === n.id);
            if (!update) return n;
            return {
              ...n,
              x: update.newX,
              y: update.newY,
              colorIndex: update.newColorIndex,
            };
          })
        );
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('[Auto-Organize] bulkOrganizeNotes failed:', err);
        }
      })
      .finally(() => {
        if (!cancelled) setIsOrganizing(false);
      });

    return () => {
      cancelled = true;
    };
  // We intentionally only re-run when `isAutoOrganize` flips to true,
  // not on every notes change, to avoid an infinite update loop.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoOrganize]);

  const handleSelectMood = useCallback((moodId) => {
    setMoodState((prev) => {
      if (prev.current === moodId) return prev;
      playMoodSound(moodId);
      const newHistory = [...prev.history, moodId].slice(-10);
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
      setNotes((notesList) => notesList.map((n) => (n.id === id ? { ...n, zIndex: nextZ } : n)));
      return nextZ;
    });
  }, [setNotes]);

  // ── Feature 2: Smart Insertion for New Notes ───────────────────────────────
  // When Auto-Organize is ON, the note is placed at a random position first
  // (immediate feedback), then the AI figures out where it really belongs and
  // flies the note to its correct cluster via a follow-up state update.
  const handleAddNote = useCallback((title, text, colorIndex, isAi = false) => {
    const pos = getRandomNotePosition(viewportRef.current, boardScale);
    const rotation = (Math.random() - 0.5) * 6;
    const newNoteId = `note-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    setMaxZIndex((prevZ) => {
      const nextZ = prevZ + 1;
      setNotes((prev) => {
        if (prev.some(n => n.id === newNoteId)) return prev;
        const newNote = {
          id: newNoteId, title, text, colorIndex,
          x: pos.x, y: pos.y, rotation, zIndex: nextZ,
          done: false, date: formatDate(), isAi,
        };

        // If Auto-Organize is active, immediately schedule an AI categorization
        // call so the note will "fly" to its correct cluster after the AI responds.
        if (isAutoOrganize) {
          const existingActiveNotes = prev.filter((n) => !n.archived);
          categorizeSingleNote(newNote, existingActiveNotes)
            .then(({ newX, newY, newColorIndex }) => {
              setNotes((current) =>
                current.map((n) =>
                  n.id === newNoteId
                    ? { ...n, x: newX, y: newY, colorIndex: newColorIndex }
                    : n
                )
              );
            })
            .catch((err) => {
              console.error('[Auto-Organize] categorizeSingleNote failed:', err);
            });
        }

        return [...prev, newNote];
      });
      return nextZ;
    });
    playNewNoteSound();
  }, [setNotes, boardScale, isAutoOrganize]);

  const handleUpdateNote = useCallback((id, updatedData) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updatedData } : n)));
    playNewNoteSound();
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
        celebrateTimeoutRef.current = setTimeout(() => { setMascotState('idle'); }, 2000);
      }
      return prev.map((n) => (n.id === id ? { ...n, done: !n.done } : n));
    });
  }, [setNotes]);

  const handleArchive = useCallback((id) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, archived: true, archivedAt: formatDate() } : n)));
  }, [setNotes]);

  const handleRestoreNote = useCallback((id) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, archived: false, done: false } : n)));
  }, [setNotes]);

  const handleDeleteArchived = useCallback((id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, [setNotes]);

  const handleEditRequest = useCallback((note) => {
    setEditingNote(note);
    setShowModal(true);
  }, []);

  const handlePositionChange = useCallback((id, pos) => {
    setNotes((prev) => prev.map((n) => {
      if (n.id !== id) return n;
      let newX = Math.max(0, Math.min(pos.x, 2500 - 162));
      let newY = Math.max(0, Math.min(pos.y, 1500 - 168));
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

  const activeNotes = notes.filter((n) => !n.archived);
  const archivedNotes = notes.filter((n) => n.archived);
  const doneCount = activeNotes.filter((n) => n.done).length;

  const [magicalParticles, setMagicalParticles] = useState([]);
  useEffect(() => {
    if (currentMood === 'magical') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMagicalParticles([...Array(20)].map(() => ({
        width: Math.random() * 4 + 2, height: Math.random() * 4 + 2,
        top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
        duration: Math.random() * 3 + 2, delay: Math.random() * 5,
      })));
    }
  }, [currentMood]);

  return (
    <div className={`wallpaper w-full h-full relative overflow-hidden transition-colors duration-1000 theme-${currentMood}`}>
      <RainOverlay active={isRaining} />

      {currentMood === 'magical' && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {magicalParticles.map((p, i) => (
            <motion.div
              key={i} className="absolute bg-white rounded-full"
              style={{ width: p.width, height: p.height, top: p.top, left: p.left, boxShadow: '0 0 10px rgba(255,255,255,0.8)' }}
              animate={{ y: [0, -30, 0], opacity: [0, 0.8, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
            />
          ))}
        </div>
      )}

      <div
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-1000"
        style={{
          background: currentMood === 'rainy' ? 'radial-gradient(ellipse at 50% 10%, rgba(134,156,224,0.05) 0%, transparent 60%)' : currentMood === 'magical' ? 'radial-gradient(ellipse at 50% 50%, rgba(167,139,250,0.1) 0%, transparent 70%)' : 'radial-gradient(ellipse at 20% 15%, rgba(255,220,150,0.12) 0%, transparent 50%)',
          opacity: currentMood === 'cloudy' ? 0 : 1,
        }}
      />

      {!currentUser && !loading && <AuthScreen setMascotState={setMascotState} />}

      {/* ── RESPONSIVE Top Navigation Bar ── */}
      {currentUser && (
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-2 py-2 md:px-6 md:py-3 bg-white/95 backdrop-blur-md border-b border-[#e0be9c] shadow-sm"
        >
          <div className="flex items-center gap-1.5 md:gap-3">
            <span className="text-xl md:text-2xl hidden md:inline">🪴</span>
            <div>
              <h1 className="m-0 leading-none font-['Patrick_Hand'] font-bold text-[17px] md:text-2xl text-[#5a311b] truncate max-w-[90px] md:max-w-none">
                Cozy Notes
              </h1>
              <div className="hidden md:flex gap-1 mt-1">
                {moodState.history.slice(-5).map((m, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${m === 'clear' ? 'bg-amber-500' : m === 'rainy' ? 'bg-blue-500' : m === 'magical' ? 'bg-purple-500' : 'bg-gray-400'} ${i === 4 ? 'opacity-100' : 'opacity-40'}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-3">
            <MoodSelector currentMood={currentMood} onSelectMood={handleSelectMood} />

            {/* ── Feature 2: Auto-Organize Toggle ── */}
            <div className="flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-[#fbe6d4] border border-[#e0be9c]">
              <Sparkles
                size={14}
                color={isAutoOrganize ? '#7c3aed' : '#a3826a'}
                style={{ flexShrink: 0 }}
              />
              <span className="hidden md:inline text-xs font-semibold text-[#5a311b] font-['Nunito'] whitespace-nowrap">
                Auto-Organize
              </span>
              {/* Toggle switch */}
              <button
                id="auto-organize-toggle"
                onClick={() => setIsAutoOrganize((v) => !v)}
                disabled={isOrganizing}
                title={isAutoOrganize ? 'Turn off Auto-Organize' : 'Turn on Auto-Organize (AI clusters notes semantically)'}
                aria-pressed={isAutoOrganize}
                className="relative inline-flex items-center rounded-full transition-colors duration-300 focus:outline-none"
                style={{
                  width: 36,
                  height: 20,
                  background: isAutoOrganize
                    ? 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)'
                    : 'rgba(163,130,106,0.35)',
                  border: `1.5px solid ${isAutoOrganize ? '#7c3aed80' : '#a3826a40'}`,
                  cursor: isOrganizing ? 'wait' : 'pointer',
                  boxShadow: isAutoOrganize ? '0 0 8px rgba(124,58,237,0.4)' : 'none',
                  transition: 'all 0.3s',
                }}
              >
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute rounded-full bg-white shadow"
                  style={{
                    width: 14,
                    height: 14,
                    left: isAutoOrganize ? 18 : 2,
                    top: 2,
                  }}
                />
                {/* Spinner overlay while AI is organizing */}
                {isOrganizing && (
                  <motion.span
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <span
                      className="rounded-full border-2 border-white/60 border-t-white"
                      style={{ width: 10, height: 10, display: 'block' }}
                    />
                  </motion.span>
                )}
              </button>
            </div>

            {/* Note count - hides text on mobile */}
            <div className="flex items-center gap-1 md:gap-2 px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-[#fbe6d4] border border-[#e0be9c]">
              <span className="text-sm">📋</span>
              <span className="text-xs md:text-sm font-semibold text-[#5a311b] font-['Nunito']">
                {activeNotes.length} <span className="hidden md:inline">note{activeNotes.length !== 1 ? 's' : ''}</span>
              </span>
            </div>

            {/* Clear button - hides text on mobile */}
            {activeNotes.length > 0 && (
              <button onClick={handleClearAll} className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-[#fbe6d4] border border-[#e0be9c] hover:bg-red-50 cursor-pointer transition-colors" title="Clear all notes">
                <span className="text-sm">🗑️</span>
                <span className="hidden md:inline text-sm font-bold text-red-500 font-['Nunito']">Clear</span>
              </button>
            )}

            {/* Done count - hides text on mobile */}
            <AnimatePresence>
              {doneCount > 0 && (
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-emerald-100/50 border border-emerald-400/50">
                  <span className="text-sm">✅</span>
                  <span className="text-xs md:text-sm font-semibold text-emerald-500 font-['Nunito']">
                    {doneCount} <span className="hidden md:inline">done</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Exit button - hides text on mobile */}
            <button onClick={logout} className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-[#c97f4e] bg-gradient-to-br from-[#fef3c7] to-[#fce7f3] shadow-sm hover:opacity-80 cursor-pointer transition-all" title="Sign out">
              <LogOut size={14} color="#c97f4e" />
              <span className="hidden md:inline text-sm font-bold text-[#c97f4e] font-['Nunito']">Exit</span>
            </button>
          </div>
        </motion.nav>
      )}

      {/* ── Auto-Organize status banner ── */}
      <AnimatePresence>
        {isOrganizing && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="fixed top-[56px] md:top-[64px] left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
              color: 'white',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'Nunito, sans-serif',
              boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
            }}
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
              ✨
            </motion.span>
            AI is organizing your notes…
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Whiteboard ── */}
      {currentUser && (
        <div className="absolute inset-0" style={{ zIndex: 10 }}>
          <Whiteboard
            boardRef={whiteboardRef}
            viewportRef={viewportRef}
            scale={boardScale}
            setScale={setBoardScale}
            totalNotes={activeNotes.length}
            doneNotes={doneCount}
          >
            <AnimatePresence>
              {activeNotes.map((note) => (
                <StickyNote
                  key={note.id} note={note} whiteboardRef={whiteboardRef}
                  onDelete={handleDelete} onToggleDone={handleToggleDone}
                  onPositionChange={handlePositionChange} onInteract={bringToFront}
                  onArchive={handleArchive} onEditRequest={handleEditRequest}
                />
              ))}
            </AnimatePresence>
          </Whiteboard>
        </div>
      )}

      {/* ── Desk Scene ── */}
      <CozyDesk
        mascotState={mascotState} mood={currentMood}
        timerMode={timerState === 'running'} timeLeft={formatTime(timeLeft)}
        onToggleTimer={toggleTimer} onSendBottle={handleSendBottle}
        archivedCount={archivedNotes.length} onOpenArchive={() => setShowArchiveModal(true)}
      />

      {/* ── New Note FAB ── */}
      {currentUser && (
        <div style={{ position: 'relative', zIndex: 35 }}>
          <NewNoteButton onClick={() => {
            setEditingNote(null);
            setShowModal(true);
            playNewNoteSound();
          }} />
        </div>
      )}

      {/* ── Modals ── */}
      <AnimatePresence>
        {showModal && <NewNoteModal editNote={editingNote} onClose={() => { setShowModal(false); setEditingNote(null); }} onAdd={handleAddNote} onUpdate={handleUpdateNote} />}
      </AnimatePresence>

      <AnimatePresence>
        {(timerState === 'selecting' || timerState === 'complete') && (
          <TimerModal mode={timerState} onClose={() => setTimerState('idle')} onStart={(seconds) => { setTimeLeft(seconds); setTimerState('running'); }} onAcknowledge={() => { setTimerState('idle'); setTimeLeft(25 * 60); }} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showArchiveModal && <ArchiveModal archivedNotes={archivedNotes} onClose={() => setShowArchiveModal(false)} onRestore={handleRestoreNote} onDeleteForever={handleDeleteArchived} />}
      </AnimatePresence>
    </div>
  );
}