import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PenLine, Palette, Bold, Italic, Underline } from 'lucide-react';

const NOTE_COLORS = [
  { bg: '#fef3c7', border: '#f59e0b', label: 'Amber' },
  { bg: '#fce7f3', border: '#ec4899', label: 'Pink' },
  { bg: '#d1fae5', border: '#34d399', label: 'Mint' },
  { bg: '#dbeafe', border: '#60a5fa', label: 'Sky' },
  { bg: '#ede9fe', border: '#a78bfa', label: 'Lavender' },
  { bg: '#fee2e2', border: '#f87171', label: 'Rose' },
  { bg: '#fef9c3', border: '#facc15', label: 'Yellow' },
  { bg: '#e0f2fe', border: '#38bdf8', label: 'Cyan' },
];

export default function NewNoteModal({ onClose, onAdd, onUpdate, editNote }) {
  const [title, setTitle] = useState(editNote ? editNote.title || '' : '');
  const [text, setText] = useState(editNote ? editNote.text || '' : '');
  const [colorIndex, setColorIndex] = useState(editNote && editNote.colorIndex !== undefined ? editNote.colorIndex : 0);
  const [formats, setFormats] = useState({ bold: false, italic: false, underline: false });
  const [isMouseDownOnBackdrop, setIsMouseDownOnBackdrop] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    // Always prefill contentEditable with existing content in edit mode
    if (editorRef.current && editNote) {
      editorRef.current.innerHTML = editNote.text || '';
      setText(editNote.text || '');
    }
    editorRef.current?.focus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFormats = () => {
    setFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline')
    });
  };

  const handleFormat = (e, command) => {
    e.preventDefault();
    document.execCommand(command, false, null);
    if (editorRef.current) {
      setText(editorRef.current.innerHTML);
    }
    updateFormats();
  };

  const handleInput = (e) => {
    setText(e.currentTarget.innerHTML);
  };

  const handleSubmit = () => {
    const finalText = editorRef.current?.innerHTML || '';
    const hasContent = finalText.replace(/<[^>]*>/g, '').trim() !== '' || title.trim() !== '';
    if (hasContent) {
      if (editNote && onUpdate) {
        onUpdate(editNote.id, { title: title.trim(), text: finalText, colorIndex });
      } else if (onAdd) {
        onAdd(title.trim() || 'Untitled', finalText, colorIndex);
      }
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const color = NOTE_COLORS[colorIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) setIsMouseDownOnBackdrop(true);
        }}
        onMouseUp={(e) => {
          if (e.target === e.currentTarget && isMouseDownOnBackdrop) {
            onClose();
          }
          setIsMouseDownOnBackdrop(false);
        }}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 40, rotate: -5 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 40, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="relative"
          style={{ width: 340 }}
        >
          {/* Tape strip */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-sm z-10"
            style={{
              top: -14,
              width: 60,
              height: 18,
              background: 'rgba(255,255,255,0.65)',
              border: `1.5px solid ${color.border}55`,
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Note body */}
          <div
            className="relative rounded-lg shadow-2xl overflow-hidden"
            style={{
              background: color.bg,
              border: `2px solid ${color.border}50`,
              boxShadow: `0 20px 60px ${color.border}40, 0 4px 16px rgba(0,0,0,0.15)`,
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{
                background: `${color.border}20`,
                borderBottom: `1px solid ${color.border}30`,
              }}
            >
              <div className="flex items-center gap-2">
                <PenLine size={16} color={color.border} />
                <span
                  className="font-handwriting font-bold text-lg"
                  style={{ color: color.border }}
                >
                  {editNote ? 'Edit Sticky Note' : 'New Sticky Note'}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="rounded-full flex items-center justify-center"
                style={{
                  width: 26,
                  height: 26,
                  background: 'rgba(255,255,255,0.6)',
                  border: `1.5px solid ${color.border}50`,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <X size={13} color={color.border} strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* Textarea */}
            <div className="p-5 pb-3">
              {/* Lined background */}
              <div
                className="relative rounded-lg overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.45)' }}
              >
                <div className="absolute inset-0 pointer-events-none z-0">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-4 right-4"
                      style={{ height: 1, top: i * 30 + 42, background: `${color.border}20` }}
                    />
                  ))}
                </div>
                
                {/* Title Input */}
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Note Title..."
                  className="w-full font-handwriting text-xl font-bold outline-none bg-transparent relative z-10"
                  style={{
                    color: '#3d2b1f',
                    caretColor: color.border,
                    padding: '8px 14px 4px',
                    borderBottom: `2px dashed ${color.border}40`,
                  }}
                />

                {/* Formatting Toolbar */}
                <div className="flex gap-2 px-3 pt-2 relative z-10" style={{ borderBottom: `1px solid ${color.border}20`, paddingBottom: 6 }}>
                  <button
                    onPointerDown={(e) => handleFormat(e, 'bold')}
                    className={`p-1 rounded transition-all ${formats.bold ? 'shadow-inner' : 'hover:bg-black/5'}`}
                    style={{ background: formats.bold ? 'rgba(0,0,0,0.1)' : 'transparent' }}
                    title="Bold"
                  >
                    <Bold size={14} color={color.border} />
                  </button>
                  <button
                    onPointerDown={(e) => handleFormat(e, 'italic')}
                    className={`p-1 rounded transition-all ${formats.italic ? 'shadow-inner' : 'hover:bg-black/5'}`}
                    style={{ background: formats.italic ? 'rgba(0,0,0,0.1)' : 'transparent' }}
                    title="Italic"
                  >
                    <Italic size={14} color={color.border} />
                  </button>
                  <button
                    onPointerDown={(e) => handleFormat(e, 'underline')}
                    className={`p-1 rounded transition-all ${formats.underline ? 'shadow-inner' : 'hover:bg-black/5'}`}
                    style={{ background: formats.underline ? 'rgba(0,0,0,0.1)' : 'transparent' }}
                    title="Underline"
                  >
                    <Underline size={14} color={color.border} />
                  </button>
                </div>

                {/* Body Textarea (ContentEditable) */}
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleInput}
                  onKeyDown={handleKeyDown}
                  onKeyUp={updateFormats}
                  onMouseUp={updateFormats}
                  className="w-full font-handwriting text-lg outline-none bg-transparent relative z-10"
                  style={{
                    color: '#3d2b1f',
                    caretColor: color.border,
                    padding: '12px 14px',
                    minHeight: 120,
                    lineHeight: '30px',
                    wordBreak: 'break-word',
                  }}
                  data-placeholder="What's on your mind?..."
                />
              </div>

              {/* Character count */}
              <div className="flex justify-end items-center mt-1">
                <p
                  className="text-right text-xs"
                  style={{ color: `${color.border}80` }}
                >
                  {text.replace(/<[^>]*>/g, '').length}/200
                </p>
              </div>
            </div>

            {/* Color picker */}
            <div className="px-5 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <Palette size={14} color={color.border} />
                <span className="text-xs font-semibold" style={{ color: color.border }}>Note color</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {NOTE_COLORS.map((c, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setColorIndex(i)}
                    className="rounded-full flex items-center justify-center"
                    style={{
                      width: 26,
                      height: 26,
                      background: c.bg,
                      border: `2px solid ${i === colorIndex ? c.border : c.border + '50'}`,
                      cursor: 'pointer',
                      boxShadow: i === colorIndex ? `0 0 0 2px ${c.border}40` : 'none',
                      transition: 'all 0.15s',
                    }}
                    title={c.label}
                  >
                    {i === colorIndex && (
                      <div
                        className="rounded-full"
                        style={{ width: 10, height: 10, background: c.border }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex gap-3 px-5 py-4"
              style={{
                background: `${color.border}12`,
                borderTop: `1px solid ${color.border}20`,
              }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="flex-1 rounded-lg py-2 text-sm font-semibold"
                style={{
                  background: 'rgba(255,255,255,0.6)',
                  border: `1.5px solid ${color.border}40`,
                  color: '#6b5945',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: `0 4px 16px ${color.border}50` }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={!text.replace(/<[^>]*>/g, '').trim() && !title.trim()}
                className="flex-1 rounded-lg py-2 text-sm font-bold"
                style={{
                  background: (text.replace(/<[^>]*>/g, '').trim() || title.trim())
                    ? `linear-gradient(135deg, ${color.border} 0%, ${color.border}cc 100%)`
                    : `${color.border}40`,
                  color: (text.replace(/<[^>]*>/g, '').trim() || title.trim()) ? 'white' : `${color.border}80`,
                  cursor: (text.replace(/<[^>]*>/g, '').trim() || title.trim()) ? 'pointer' : 'default',
                  border: 'none',
                  transition: 'all 0.2s',
                }}
              >
                {editNote ? '📝 Save Changes' : '📌 Pin to Board'}
              </motion.button>
            </div>

            {/* Keyboard hint */}
            <p
              className="text-center text-xs pb-2"
              style={{ color: `${color.border}60` }}
            >
              ⌘ + Enter to add
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
