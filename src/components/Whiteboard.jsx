import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RefreshCcw } from 'lucide-react';

export default function Whiteboard({ boardRef, viewportRef, scale, setScale, totalNotes, doneNotes, children }) {
  const progress = totalNotes > 0 ? Math.round((doneNotes / totalNotes) * 100) : 0;

  // Reusable zoom button styling
  const btnStyle = {
    width: 36, height: 36, borderRadius: '50%',
    background: 'rgba(255,255,255,0.88)',
    border: '1.5px solid rgba(196,149,106,0.4)',
    color: '#6d4a30', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', backdropFilter: 'blur(4px)'
  };

  return (
    <div
      className="whiteboard-frame"
      style={{
        position: 'fixed', top: '7%', left: '50%', transform: 'translateX(-50%)',
        width: '78%', maxWidth: 1020, height: '56%',
        borderRadius: 10, border: '14px solid #c4956a',
        boxShadow: `inset 0 0 28px rgba(0,0,0,0.04), 0 8px 32px rgba(74,55,40,0.25), 0 2px 6px rgba(74,55,40,0.1)`,
        background: '#faf7f2', overflow: 'hidden', zIndex: 5,
      }}
    >
      {/* Corner screws */}
      {[
        { top: -11, left: -11 }, { top: -11, right: -11 },
        { bottom: -11, left: -11 }, { bottom: -11, right: -11 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', width: 12, height: 12, borderRadius: '50%', zIndex: 20,
            background: 'radial-gradient(circle at 35% 35%, #e8c898 0%, #a07040 60%, #6d4a25 100%)',
            border: '1px solid #5a3820', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)', ...pos,
          }}
        />
      ))}

      {/* Header bar (Static/Fixed) */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 44,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', background: 'rgba(245,237,224,0.88)',
          borderBottom: '1px solid rgba(196,149,106,0.28)', backdropFilter: 'blur(4px)', zIndex: 10,
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
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: '#a0714f', fontFamily: 'Nunito, sans-serif', minWidth: 72, textAlign: 'right' }}>
              {doneNotes}/{totalNotes} done
            </span>
            <div style={{ width: 80, height: 8, borderRadius: 99, background: 'rgba(196,149,106,0.2)', overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${progress}%` }} transition={{ type: 'spring', stiffness: 200 }}
                style={{
                  height: '100%', borderRadius: 99,
                  background: progress === 100 ? 'linear-gradient(90deg, #68d391, #38a169)' : 'linear-gradient(90deg, #f59e0b, #f97316)',
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

      {/* ── Scrollable Viewport for Native Panning ── */}
      <div
        ref={viewportRef}
        style={{
          position: 'absolute', top: 44, left: 0, right: 0, bottom: 0,
          overflow: 'auto', WebkitOverflowScrolling: 'touch', // Smooth momentum scroll for iOS
        }}
      >
        {/* The large zoomable canvas holding all sticky notes */}
        <motion.div
          ref={boardRef}
          style={{
            position: 'relative',
            width: 2500, height: 1500, // Massive canvas size
            scale: scale,
            transformOrigin: '0 0',
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(200,185,160,0.13) 30px, rgba(200,185,160,0.13) 31px)`,
          }}
        >
          {children}
        </motion.div>
      </div>

      {/* Empty state overlay */}
      {totalNotes === 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
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

      {/* Floating Zoom Controls Container */}
      <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 20 }}>
        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} 
          onClick={() => setScale(s => Math.min(s + 0.15, 2))} 
          style={btnStyle} title="Zoom In"
        >
          <ZoomIn size={18} />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} 
          onClick={() => setScale(s => Math.max(s - 0.15, 0.4))} 
          style={btnStyle} title="Zoom Out"
        >
          <ZoomOut size={18} />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} 
          onClick={() => setScale(1)} 
          style={btnStyle} title="Reset View"
        >
          <RefreshCcw size={18} />
        </motion.button>
      </div>
      
      {/* Marker decoration */}
      <div style={{ position: 'absolute', bottom: 8, right: 12, fontSize: 22, opacity: 0.18, pointerEvents: 'none', userSelect: 'none', zIndex: 0 }}>
        🖊️
      </div>
    </div>
  );
}