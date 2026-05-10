import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function NewNoteButton({ onClick }) {
  // Check if the screen is mobile size on render
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <motion.button
      onClick={onClick}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
      whileHover={{ y: -4, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed z-40 flex flex-col items-center gap-2"
      style={{
        // CRITICAL FIX: Desktop stays exactly at 32px. Only Mobile moves up to 140px.
        bottom: isMobile ? 140 : 32,
        right: isMobile ? 20 : 32,
        cursor: 'pointer',
        border: 'none',
        background: 'transparent',
        padding: 0,
      }}
    >
      {/* Stack of notes effect */}
      <div className="relative note-stack" style={{ width: 72, height: 72 }}>
        {/* Bottom note in stack */}
        <div
          className="absolute rounded inset-0"
          style={{
            background: '#f5c97a',
            transform: 'rotate(8deg) translate(6px, 4px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 1,
          }}
        />
        {/* Middle note */}
        <div
          className="absolute rounded inset-0"
          style={{
            background: '#fde68a',
            transform: 'rotate(-4deg) translate(-2px, 2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 2,
          }}
        />
        {/* Top note with plus icon */}
        <motion.div
          className="absolute rounded inset-0 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            boxShadow: '0 6px 20px rgba(245,158,11,0.4), 0 2px 6px rgba(0,0,0,0.15)',
            border: '2px solid rgba(245,158,11,0.4)',
            zIndex: 3,
          }}
          whileHover={{
            background: ['linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 'linear-gradient(135deg, #fde68a 0%, #fbbf24 100%)'],
          }}
        >
          <div className="flex flex-col items-center gap-0.5">
            <Plus size={22} color="#b45309" strokeWidth={2.5} />
            <span style={{ fontSize: 10, color: '#b45309', fontWeight: 700, letterSpacing: 0.5 }}>NOTE</span>
          </div>
        </motion.div>
      </div>

      {/* Label */}
      <motion.span
        className="font-handwriting font-bold text-sm px-3 py-1 rounded-full"
        style={{
          background: 'rgba(255,255,255,0.8)',
          color: '#b45309',
          border: '1.5px solid rgba(245,158,11,0.35)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 8px rgba(245,158,11,0.2)',
          whiteSpace: 'nowrap',
        }}
        whileHover={{ background: 'rgba(255,255,255,0.95)' }}
      >
        New Note ✨
      </motion.span>
    </motion.button>
  );
}