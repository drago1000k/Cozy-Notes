import { motion } from 'framer-motion';
import { X, RotateCcw, Trash2 } from 'lucide-react';

export default function ArchiveModal({ archivedNotes = [], onClose, onRestore, onDeleteForever }) {
  // Group by archivedAt date
  const grouped = archivedNotes.reduce((acc, note) => {
    const dateKey = note.archivedAt || 'Unknown';
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(note);
    return acc;
  }, {});

  const sortedKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <motion.div
      className="modal-backdrop fixed inset-0 z-[60] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative rounded-2xl shadow-2xl overflow-hidden"
        style={{
          width: '90%', maxWidth: 520, maxHeight: '75vh',
          background: 'linear-gradient(160deg, #fef7ed 0%, #fde6c4 100%)',
          border: '3px solid #c4956a',
        }}
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4" style={{ borderBottom: '2px solid #e0be9c' }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 22 }}>📦</span>
            <h2 style={{ margin: 0, fontFamily: "'Patrick Hand', cursive", fontSize: 22, color: '#6d4a30' }}>
              Archive Chest
            </h2>
            <span style={{
              fontSize: 12, fontWeight: 700, color: '#a0714f',
              background: 'rgba(196,149,106,0.2)', padding: '2px 8px', borderRadius: 99,
              fontFamily: 'Nunito, sans-serif',
            }}>
              {archivedNotes.length} task{archivedNotes.length !== 1 ? 's' : ''}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="cursor-pointer"
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(196,149,106,0.2)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={16} color="#6d4a30" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(75vh - 70px)' }}>
          {archivedNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12" style={{ color: '#c4a882' }}>
              <span style={{ fontSize: 48, marginBottom: 8 }}>📭</span>
              <p style={{ fontFamily: "'Patrick Hand', cursive", fontSize: 20, margin: 0 }}>
                The chest is empty...
              </p>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: 16, margin: '4px 0 0', opacity: 0.7 }}>
                Drag completed tasks to the chest to archive them.
              </p>
            </div>
          ) : (
            sortedKeys.map((dateKey) => (
              <div key={dateKey} className="mb-4">
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#a0714f',
                  fontFamily: 'Nunito, sans-serif',
                  textTransform: 'uppercase', letterSpacing: 1,
                  marginBottom: 6,
                }}>
                  📅 {dateKey}
                </div>
                {grouped[dateKey].map((note) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-start gap-3 mb-2 p-3 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.7)',
                      border: '1px solid rgba(196,149,106,0.3)',
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      {note.title && (
                        <div style={{
                          fontFamily: "'Patrick Hand', cursive", fontSize: 15, fontWeight: 700,
                          color: '#5a311b', lineHeight: 1.2, marginBottom: 2,
                        }}>
                          {note.title}
                        </div>
                      )}
                      <div style={{
                        fontFamily: "'Patrick Hand', cursive", fontSize: 14, color: '#6d4a30',
                        lineHeight: 1.4, wordBreak: 'break-word',
                        textDecoration: 'line-through', opacity: 0.7,
                      }}>
                        {(note.text || '').replace(/<[^>]*>/g, '').slice(0, 100)}
                        {(note.text || '').length > 100 ? '...' : ''}
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onRestore(note.id)}
                        className="cursor-pointer flex items-center justify-center"
                        title="Restore to board"
                        style={{
                          width: 30, height: 30, borderRadius: '50%',
                          background: 'rgba(52,211,153,0.15)', border: '1.5px solid #34d399',
                        }}
                      >
                        <RotateCcw size={13} color="#34d399" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.15, background: '#fee2e2' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDeleteForever(note.id)}
                        className="cursor-pointer flex items-center justify-center"
                        title="Delete forever"
                        style={{
                          width: 30, height: 30, borderRadius: '50%',
                          background: 'rgba(248,113,113,0.1)', border: '1.5px solid #f87171',
                        }}
                      >
                        <Trash2 size={13} color="#f87171" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
