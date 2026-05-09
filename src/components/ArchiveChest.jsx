import { motion } from 'framer-motion';

export default function ArchiveChest({ archivedCount = 0, onOpen, isHovered = false }) {
  return (
    <motion.div
      id="archive-chest-zone"
      className="relative cursor-pointer"
      style={{ width: 48, height: 40 }}
      onClick={onOpen}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      title={`Archive (${archivedCount} tasks)`}
    >
      {/* Chest lid */}
      <motion.div
        className="absolute"
        style={{
          width: 48, height: 14, top: 0, left: 0,
          background: 'linear-gradient(180deg, #a0714f 0%, #8b5e3c 100%)',
          borderRadius: '6px 6px 0 0',
          border: '2px solid #6d4a30',
          borderBottom: 'none',
          transformOrigin: 'bottom center',
        }}
        animate={{ rotateX: isHovered ? -35 : 0 }}
        whileHover={{ rotateX: -25 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Lock plate */}
        <div className="absolute" style={{
          width: 10, height: 8, bottom: -1, left: '50%', transform: 'translateX(-50%)',
          background: '#f59e0b', borderRadius: '2px 2px 0 0',
          border: '1px solid #d97706',
        }} />
      </motion.div>

      {/* Chest body */}
      <div className="absolute" style={{
        width: 48, height: 24, bottom: 0, left: 0,
        background: 'linear-gradient(180deg, #8b5e3c 0%, #6d4a30 100%)',
        borderRadius: '0 0 4px 4px',
        border: '2px solid #5a3820',
        borderTop: '2px solid #a0714f',
        boxShadow: isHovered ? '0 0 15px rgba(245, 158, 11, 0.5)' : 'none',
        transition: 'box-shadow 0.2s',
      }}>
        {/* Metal bands */}
        <div className="absolute" style={{ width: '100%', height: 2, top: 6, background: '#d4a574', opacity: 0.5 }} />
        <div className="absolute" style={{ width: '100%', height: 2, top: 14, background: '#d4a574', opacity: 0.5 }} />
        {/* Lock */}
        <div className="absolute" style={{
          width: 8, height: 10, top: -2, left: '50%', transform: 'translateX(-50%)',
          background: '#f59e0b', borderRadius: '0 0 3px 3px',
          border: '1px solid #d97706',
        }}>
          <div className="absolute" style={{
            width: 4, height: 4, bottom: 2, left: '50%', transform: 'translateX(-50%)',
            borderRadius: '50%', background: '#92400e',
          }} />
        </div>
      </div>

      {/* Badge */}
      {archivedCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute flex items-center justify-center"
          style={{
            top: -6, right: -6, width: 18, height: 18,
            borderRadius: '50%', background: '#ef4444',
            border: '2px solid white',
            fontSize: 9, fontWeight: 800, color: 'white',
            fontFamily: 'Nunito, sans-serif',
            zIndex: 5,
          }}
        >
          {archivedCount > 99 ? '99+' : archivedCount}
        </motion.div>
      )}
    </motion.div>
  );
}
