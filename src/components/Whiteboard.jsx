import { motion } from 'framer-motion';

/**
 * Whiteboard component.
 * boardRef: ref forwarded to the note-content area (used for dragConstraints).
 * The outer frame div is not ref'd — this simplifies note positioning.
 */
export default function Whiteboard({ boardRef, totalNotes, doneNotes, children }) {
  const progress = totalNotes > 0 ? Math.round((doneNotes / totalNotes) * 100) : 0;

  return (
    /* Outer frame — visual only, not ref'd for drag constraints */
    <div
      className="whiteboard-frame"
      style={{
        position: 'fixed',
        top: '7%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '78%',
        maxWidth: 1020,
        height: '56%',
        borderRadius: 10,
        border: '14px solid #c4956a',
        boxShadow: `
          inset 0 0 28px rgba(0,0,0,0.04),
          0 8px 32px rgba(74,55,40,0.25),
          0 2px 6px rgba(74,55,40,0.1)
        `,
        background: '#faf7f2',
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(200,185,160,0.13) 30px, rgba(200,185,160,0.13) 31px)
        `,
        overflow: 'hidden',
        zIndex: 5,
      }}
    >
      {/* Corner screws */}
      {[
        { top: -11, left: -11 },
        { top: -11, right: -11 },
        { bottom: -11, left: -11 },
        { bottom: -11, right: -11 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', width: 12, height: 12, borderRadius: '50%', zIndex: 20,
            background: 'radial-gradient(circle at 35% 35%, #e8c898 0%, #a07040 60%, #6d4a25 100%)',
            border: '1px solid #5a3820',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
            ...pos,
          }}
        />
      ))}

      {/* Header bar */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 44,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px',
          background: 'rgba(245,237,224,0.88)',
          borderBottom: '1px solid rgba(196,149,106,0.28)',
          backdropFilter: 'blur(4px)',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>📋</span>
          <span style={{ fontFamily: "'Patrick Hand', cursive", fontWeight: 700, fontSize: 19, color: '#6d4a30' }}>
            My Cozy Board
          </span>
        </div>

        {totalNotes > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: '#a0714f', fontFamily: 'Nunito, sans-serif', minWidth: 72, textAlign: 'right' }}>
              {doneNotes}/{totalNotes} done
            </span>
            <div style={{ width: 80, height: 8, borderRadius: 99, background: 'rgba(196,149,106,0.2)', overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 200 }}
                style={{
                  height: '100%', borderRadius: 99,
                  background: progress === 100
                    ? 'linear-gradient(90deg, #68d391, #38a169)'
                    : 'linear-gradient(90deg, #f59e0b, #f97316)',
                }}
              />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: progress === 100 ? '#38a169' : '#a0714f', fontFamily: 'Nunito, sans-serif', minWidth: 28 }}>
              {progress}%
            </span>
            {progress === 100 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, -10, 10, 0] }} style={{ fontSize: 18 }}>
                🎉
              </motion.span>
            )}
          </motion.div>
        )}
      </div>

      {/* ── Note content area — drag constraints target ── */}
      <div
        ref={boardRef}
        style={{
          position: 'absolute',
          top: 44,       // below header
          left: 0,
          right: 0,
          bottom: 0,
          // Mobile panning: make inner board large
          minWidth: typeof window !== 'undefined' && window.innerWidth < 768 ? 1000 : 'auto',
          minHeight: typeof window !== 'undefined' && window.innerWidth < 768 ? 800 : 'auto',
          overflow: 'hidden',
        }}
      >
        {/* Sticky notes go here */}
        {children}
      </div>

      {/* Empty state */}
      {totalNotes === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            position: 'absolute', top: 44, left: 0, right: 0, bottom: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none', zIndex: 1,
          }}
        >
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
            <span style={{ fontSize: 50 }}>📌</span>
          </motion.div>
          <p style={{ fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: 22, color: '#c4a882', margin: '12px 0 4px' }}>
            Your board is empty...
          </p>
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: 17, color: '#d4bea0', margin: 0 }}>
            Create a note and pin it here! ✨
          </p>
        </motion.div>
      )}

      {/* Marker decoration */}
      <div style={{ position: 'absolute', bottom: 8, right: 12, fontSize: 22, opacity: 0.18, pointerEvents: 'none', userSelect: 'none', zIndex: 0 }}>
        🖊️
      </div>
    </div>
  );
}
