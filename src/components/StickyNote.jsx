import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { X, Check, Archive } from 'lucide-react';
import { playCrinkle, playPop, playScribble } from '../utils/audio';

const NOTE_COLORS = [
  { bg: '#fef3c7', border: '#f59e0b', shadow: 'rgba(245,158,11,0.28)' },
  { bg: '#fce7f3', border: '#ec4899', shadow: 'rgba(236,72,153,0.28)' },
  { bg: '#d1fae5', border: '#34d399', shadow: 'rgba(52,211,153,0.28)' },
  { bg: '#dbeafe', border: '#60a5fa', shadow: 'rgba(96,165,250,0.28)' },
  { bg: '#ede9fe', border: '#a78bfa', shadow: 'rgba(167,139,250,0.28)' },
  { bg: '#fee2e2', border: '#f87171', shadow: 'rgba(248,113,113,0.28)' },
  { bg: '#fef9c3', border: '#facc15', shadow: 'rgba(250,204,21,0.28)' },
  { bg: '#e0f2fe', border: '#38bdf8', shadow: 'rgba(56,189,248,0.28)' },
];

export default function StickyNote({ note, whiteboardRef, onDelete, onToggleDone, onPositionChange, onInteract, onArchive, onEditRequest }) {
  const color = NOTE_COLORS[note.colorIndex % NOTE_COLORS.length];
  const [isDragging, setIsDragging] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const lastTapRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Teal sea-glass styling for AI notes
  const isAi = note.isAi;
  const noteStyle = isAi ? {
    bg: 'rgba(204, 251, 241, 0.85)', // translucent teal
    border: '#14b8a6',
    shadow: 'rgba(20, 184, 166, 0.4)'
  } : color;

  // Double-tap detection
  const handleBodyClick = (e) => {
    if (isDragging || hasDraggedRef.current) return;
    const now = Date.now();
    if (now - lastTapRef.current < 350) {
      e.stopPropagation();
      if (onEditRequest) onEditRequest(note);
    }
    lastTapRef.current = now;
  };

  const BTN_SIZE = 20; // visual size; click area via padding

  return (
    <motion.div
      drag={!isArchiving}
      dragMomentum={false}
      dragConstraints={whiteboardRef}
      dragElastic={0.03}
      initial={{ x: note.x, y: note.y, scale: 0.6, opacity: 0, rotate: note.rotation }}
      animate={isArchiving ? { scale: 0, opacity: 0 } : { x: note.x, y: note.y, scale: 1, opacity: 1, rotate: note.rotation }}
      exit={{ scale: 0.3, opacity: 0, transition: { duration: 0.18 } }}
      whileDrag={{ scale: 1.07 }}
      whileHover={{ scale: isDragging ? 1.07 : 1.02 }}
      onPointerDown={() => {
        hasDraggedRef.current = false;
        if (onInteract) onInteract(note.id);
      }}
      onDragStart={() => {
        setIsDragging(true);
        hasDraggedRef.current = true;
        dragOffset.current = { x: 0, y: 0 };
        playCrinkle();
      }}
      onDragEnd={(e, info) => {
        setIsDragging(false);
        
        // Check for archive drop
        const chestZone = document.getElementById('archive-chest-zone');
        if (chestZone && note.done) {
          const rect = chestZone.getBoundingClientRect();
          // Use pointer coordinates to check if dropped inside chest
          if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          ) {
            setIsArchiving(true);
            setTimeout(() => {
              if (onArchive) onArchive(note.id);
            }, 300); // Wait for shrink animation
            return;
          }
        }

        onPositionChange(note.id, {
          x: note.x + info.offset.x,
          y: note.y + info.offset.y,
        });
      }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 162,
        minHeight: 168,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 9999 : (note.zIndex || 10),
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none', // Prevents scrolling while dragging
      }}
    >
      {/* Tape strip */}
      <div
        style={{
          position: 'absolute',
          top: -12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 40,
          height: 16,
          background: `${noteStyle.border}30`,
          border: `1px solid ${noteStyle.border}35`,
          backdropFilter: 'blur(2px)',
          borderRadius: 3,
          zIndex: 2,
        }}
      />

      {/* Paper body */}
      <div
        className="paper-texture"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 168,
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          padding: '18px 13px 12px',
          background: noteStyle.bg,
          border: `1.5px solid ${noteStyle.border}55`,
          boxShadow: isAi 
            ? `0 0 15px ${noteStyle.shadow}, inset 0 0 10px rgba(255,255,255,0.5)`
            : `3px 6px 18px ${noteStyle.shadow}, inset 0 1px 0 rgba(255,255,255,0.88), 0 1px 4px rgba(0,0,0,0.08)`,
          backdropFilter: isAi ? 'blur(4px)' : 'none',
        }}
      >
        {/* Ruled lines */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute', left: 12, right: 12,
              top: 54 + i * 26, height: 1,
              background: `${noteStyle.border}1e`,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Title Header */}
        {(note.title || isAi) && (
          <div
            onClick={handleBodyClick}
            onTouchEnd={handleBodyClick}
            title={isAi ? "A message from afar" : "Double-tap to edit"}
            style={{
              fontFamily: "'Patrick Hand', cursive",
              fontSize: 19,
              fontWeight: 'bold',
              color: isAi ? '#0f766e' : '#3d2b1f',
              borderBottom: `2px dashed ${noteStyle.border}40`,
              paddingBottom: 4,
              marginBottom: 4,
              lineHeight: 1.2,
              wordBreak: 'break-word',
            }}
          >
            {note.title || (isAi && "✨ Stranger")}
          </div>
        )}

        {/* Text content */}
        <div
          onClick={handleBodyClick}
          onTouchEnd={handleBodyClick}
          title={isAi ? "A message from afar" : "Double-tap to edit"}
          dangerouslySetInnerHTML={{
            __html: (new RegExp('<[a-z][\\s\\S]*>', 'i').test(note.text || '')) 
              ? (note.text || '') 
              : (note.text || '') 
                  .replace(/</g, '&lt;').replace(/>/g, '&gt;')
                  .replace(/\n/g, '<br/>')
                  .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                  .replace(/\*(.*?)\*/g, '<i>$1</i>')
                  .replace(/__(.*?)__/g, '<u>$1</u>')
          }}
          style={{
            fontFamily: "'Patrick Hand', cursive",
            fontSize: 17,
            lineHeight: 1.55,
            color: isAi ? '#115e59' : '#3d2b1f',
            margin: 0,
            flex: 1,
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            textDecoration: note.done ? 'line-through' : 'none',
            opacity: note.done ? 0.48 : 1,
            transition: 'opacity 0.28s ease',
            paddingBottom: 10,
            position: 'relative',
            zIndex: 1,
          }}
        />

        {/* Footer row */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'relative', zIndex: 1,
          }}
        >
          <span style={{ fontSize: 9, color: `${noteStyle.border}88`, fontFamily: 'Nunito, sans-serif' }}>
            {note.date}
          </span>

          <div style={{ display: 'flex', gap: 4 }}>
            {/* Nút Archive chỉ hiện khi note đã Done */}
            {note.done && (
              <motion.button
                whileHover={{ scale: 1.18, background: '#fef3c7' }}
                whileTap={{ scale: 0.88 }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setIsArchiving(true);
                  setTimeout(() => { if (onArchive) onArchive(note.id); }, 300);
                }}
                title="Move to Archive"
                style={{
                  width: BTN_SIZE, height: BTN_SIZE, borderRadius: '50%', border: `1.5px solid #d97706`,
                  background: 'rgba(255,255,255,0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'background 0.18s', padding: 0,
                }}
              >
                <Archive size={10} color="#d97706" strokeWidth={3} />
              </motion.button>
            )}

            {/* Check */}
            <motion.button
              whileHover={{ scale: 1.18 }}
              whileTap={{ scale: 0.88 }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onToggleDone(note.id); playScribble(); }}
              title={note.done ? 'Unmark' : 'Mark done'}
              style={{
                width: BTN_SIZE, height: BTN_SIZE, borderRadius: '50%',
                border: `1.5px solid ${noteStyle.border}`,
                background: note.done ? noteStyle.border : 'rgba(255,255,255,0.78)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.18s',
                padding: 0,
              }}
            >
              <Check size={10} color={note.done ? 'white' : noteStyle.border} strokeWidth={3} />
            </motion.button>

            {/* Delete */}
            <motion.button
              whileHover={{ scale: 1.18, background: '#fee2e2' }}
              whileTap={{ scale: 0.88 }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onDelete(note.id); playPop(); }}
              title="Delete note"
              style={{
                width: BTN_SIZE, height: BTN_SIZE, borderRadius: '50%', border: '1.5px solid #f87171',
                background: 'rgba(255,255,255,0.78)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.18s',
                padding: 0,
              }}
            >
              <X size={10} color="#f87171" strokeWidth={3} />
            </motion.button>
          </div>
        </div>

        {/* Done stamp */}
        {note.done && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: -12 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontFamily: "'Patrick Hand', cursive", fontWeight: 700, fontSize: 23,
                color: `${noteStyle.border}bb`, transform: 'rotate(-12deg)',
                border: `2px solid ${noteStyle.border}55`, padding: '2px 7px',
                borderRadius: 4, letterSpacing: 1,
              }}
            >
              ✓ Done!
            </span>
          </motion.div>
        )}

        {/* Folded corner */}
        <div
          style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 0, height: 0, borderStyle: 'solid',
            borderWidth: '0 0 16px 16px',
            borderColor: `transparent transparent ${noteStyle.border}55 transparent`,
          }}
        />
      </div>
    </motion.div>
  );
}