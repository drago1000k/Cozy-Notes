import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RefreshCcw } from 'lucide-react';

export default function Whiteboard({ boardRef, viewportRef, scale, setScale, totalNotes, doneNotes, children }) {
  const progress = totalNotes > 0 ? Math.round((doneNotes / totalNotes) * 100) : 0;

  // Responsive button styling: smaller on mobile, normal on desktop
  const btnStyle = "w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/90 border-2 border-[#c4956a]/40 text-[#6d4a30] flex items-center justify-center cursor-pointer shadow-sm backdrop-blur-sm";

  return (
    <div
      // Mobile: 95% width, smaller top margin. Desktop (md): 78% width, 7% top margin
      className="fixed left-1/2 -translate-x-1/2 w-[95%] md:w-[78%] max-w-[1020px] top-[75px] md:top-[7%] h-[50%] md:h-[56%] rounded-xl z-10 overflow-hidden"
      style={{
        border: typeof window !== 'undefined' && window.innerWidth < 768 ? '8px solid #c4956a' : '14px solid #c4956a',
        boxShadow: `inset 0 0 28px rgba(0,0,0,0.04), 0 8px 32px rgba(74,55,40,0.25), 0 2px 6px rgba(74,55,40,0.1)`,
        background: '#faf7f2',
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(200,185,160,0.13) 30px, rgba(200,185,160,0.13) 31px)`,
      }}
    >
      {/* Corner screws */}
      {[
        { top: -8, left: -8 }, { top: -8, right: -8 },
        { bottom: -8, left: -8 }, { bottom: -8, right: -8 },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-2.5 h-2.5 md:w-3 md:h-3 rounded-full z-20 border border-[#5a3820] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]"
          style={{ background: 'radial-gradient(circle at 35% 35%, #e8c898 0%, #a07040 60%, #6d4a25 100%)', ...pos }}
        />
      ))}

      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 h-10 md:h-11 flex items-center justify-between px-2 md:px-4 bg-[#f5ede0]/90 border-b border-[#c4956a]/30 backdrop-blur-sm z-20">
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="text-base md:text-lg">📋</span>
          <span className="font-['Patrick_Hand'] font-bold text-base md:text-[19px] text-[#6d4a30]">
            My Cozy Board
          </span>
        </div>

        {totalNotes > 0 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 md:gap-2">
            <span className="text-[10px] md:text-xs font-semibold text-[#a0714f] font-['Nunito'] text-right min-w-[50px] md:min-w-[72px]">
              {doneNotes}/{totalNotes} <span className="hidden md:inline">done</span>
            </span>
            <div className="w-12 md:w-20 h-1.5 md:h-2 rounded-full bg-[#c4956a]/20 overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }} transition={{ type: 'spring', stiffness: 200 }}
                className="h-full rounded-full"
                style={{ background: progress === 100 ? 'linear-gradient(90deg, #68d391, #38a169)' : 'linear-gradient(90deg, #f59e0b, #f97316)' }}
              />
            </div>
            <span className={`text-[10px] md:text-[11px] font-bold font-['Nunito'] min-w-[24px] md:min-w-[28px] ${progress === 100 ? 'text-[#38a169]' : 'text-[#a0714f]'}`}>
              {progress}%
            </span>
            {progress === 100 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, -10, 10, 0] }} className="text-sm md:text-lg">
                🎉
              </motion.span>
            )}
          </motion.div>
        )}
      </div>

      {/* Scrollable Viewport for Native Panning */}
      <div
        ref={viewportRef}
        style={{
          position: 'absolute', top: 40, left: 0, right: 0, bottom: 0,
          overflow: 'auto', WebkitOverflowScrolling: 'touch', // Smooth momentum scroll for iOS
        }}
      >
        <motion.div
          ref={boardRef}
          style={{
            position: 'relative', width: 2500, height: 1500, scale: scale, transformOrigin: '0 0',
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
          className="absolute inset-0 top-10 flex flex-col items-center justify-center pointer-events-none z-[1]"
        >
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
            <span className="text-4xl md:text-5xl">📌</span>
          </motion.div>
          <p className="font-['Caveat'] font-bold text-xl md:text-2xl text-[#c4a882] mt-3 mb-1">
            Your board is empty...
          </p>
          <p className="font-['Caveat'] text-base md:text-lg text-[#d4bea0] m-0">
            Create a note and pin it here! ✨
          </p>
        </motion.div>
      )}

      {/* Floating Zoom Controls - Responsive Layout (Horizontal on mobile, Vertical on desktop) */}
      <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 flex flex-row md:flex-col gap-1.5 md:gap-2 z-30">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={() => setScale(s => Math.min(s + 0.15, 2))} className={btnStyle} title="Zoom In">
          <ZoomIn size={16} />
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={() => setScale(s => Math.max(s - 0.15, 0.4))} className={btnStyle} title="Zoom Out">
          <ZoomOut size={16} />
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={() => setScale(1)} className={btnStyle} title="Reset View">
          <RefreshCcw size={16} />
        </motion.button>
      </div>
      
      {/* Marker decoration */}
      <div className="absolute bottom-2 right-3 text-lg md:text-2xl opacity-20 pointer-events-none select-none z-0">
        🖊️
      </div>
    </div>
  );
}