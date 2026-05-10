import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { playGlassClink } from '../utils/audio';

export default function BottleCompanion({ onSend }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
      setIsOpen(false);
    }
  };

  const popupContent = (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      className={isMobile ? "relative" : "absolute bottom-full mb-3"}
      style={{
        width: 200,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(8px)',
        padding: 12,
        borderRadius: 12,
        border: '1px solid rgba(20,184,166,0.3)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 50,
      }}
      onClick={(e) => e.stopPropagation()} // Ngăn click xuyên xuống lớp nền mờ
    >
      <textarea
        autoFocus
        placeholder="Send a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        style={{
          width: '100%',
          height: 60,
          resize: 'none',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontFamily: "'Nunito', sans-serif",
          fontSize: 13,
          color: '#115e59',
        }}
      />
      <div className="flex justify-end mt-2">
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          style={{
            background: message.trim() ? '#14b8a6' : '#99f6e4',
            color: 'white',
            border: 'none',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 'bold',
            cursor: message.trim() ? 'pointer' : 'default',
            transition: 'background 0.2s',
          }}
        >
          Send
        </button>
      </div>
      {/* Mũi tên chỉ hiển thị trên Desktop */}
      {!isMobile && (
        <div
          style={{
            position: 'absolute',
            bottom: -6,
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: 12,
            height: 12,
            background: 'rgba(255,255,255,0.85)',
            borderRight: '1px solid rgba(20,184,166,0.3)',
            borderBottom: '1px solid rgba(20,184,166,0.3)',
          }}
        />
      )}
    </motion.div>
  );

  return (
    <div className="relative flex flex-col items-center">
      {/* Bottle Icon */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          if (!isOpen) playGlassClink();
          setIsOpen(!isOpen);
        }}
        title="Send a message in a bottle..."
        style={{
          width: 24,
          height: 40,
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        {/* Cork */}
        <div style={{ position: 'absolute', top: 0, left: 8, width: 8, height: 6, background: '#c4956a', borderRadius: '2px 2px 0 0' }} />
        {/* Neck */}
        <div style={{ position: 'absolute', top: 6, left: 9, width: 6, height: 8, background: 'rgba(204,251,241,0.6)', borderLeft: '1px solid rgba(255,255,255,0.8)', borderRight: '1px solid rgba(255,255,255,0.4)' }} />
        {/* Body */}
        <div style={{ position: 'absolute', top: 14, left: 2, width: 20, height: 26, background: 'rgba(204,251,241,0.5)', borderRadius: '10px 10px 4px 4px', border: '1px solid rgba(255,255,255,0.6)', borderBottom: '2px solid rgba(255,255,255,0.8)' }} />
        {/* Paper roll inside */}
        <div style={{ position: 'absolute', top: 18, left: 8, width: 8, height: 16, background: '#fff9c4', borderRadius: 2, transform: 'rotate(5deg)' }} />
      </motion.div>

      {/* CHỖ FIX LỖI: Wrap AnimatePresence bên trong tạo Portal */}
      {isMobile ? (
        typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'fixed', inset: 0, zIndex: 9999,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)'
                }}
                onClick={() => setIsOpen(false)} // Click ra ngoài nền đen để đóng
              >
                {popupContent}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )
      ) : (
        <AnimatePresence>
          {isOpen && popupContent}
        </AnimatePresence>
      )}
    </div>
  );
}