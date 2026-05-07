import { motion } from 'framer-motion';

const MOODS = [
  { id: 'clear', icon: '☀️', label: 'Clear' },
  { id: 'rainy', icon: '🌧️', label: 'Rainy' },
  { id: 'magical', icon: '✨', label: 'Magical' },
  { id: 'cloudy', icon: '☁️', label: 'Cozy' },
];

export default function MoodSelector({ currentMood, onSelectMood }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px',
        borderRadius: 999, background: 'var(--color-bg)',
        border: '1px solid var(--color-whiteboard-border)'
      }}
    >
      <span style={{ fontSize: 12, color: 'var(--color-muted)', fontFamily: 'Nunito, sans-serif', marginRight: 4 }}>Mood</span>
      {MOODS.map((mood) => {
        const isActive = currentMood === mood.id;
        return (
          <motion.button
            key={mood.id}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelectMood(mood.id)}
            title={mood.label}
            style={{
              background: isActive ? 'var(--color-wood-dark)' : 'transparent',
              border: 'none',
              borderRadius: '50%',
              width: 26,
              height: 26,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 14,
              opacity: isActive ? 1 : 0.6,
              transition: 'opacity 0.2s',
            }}
          >
            {mood.icon}
          </motion.button>
        );
      })}
    </div>
  );
}
