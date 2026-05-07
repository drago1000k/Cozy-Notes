// Cute CSS fox mascot with animation states
// states: 'idle', 'working', 'celebrating'
export default function Fox({ mascotState = 'idle', mood = 'clear' }) {
  const isWorking = mascotState === 'working';
  const isCelebrating = mascotState === 'celebrating';

  return (
    <div className="relative select-none" style={{ width: 130, height: 110 }}>
      {/* Confetti / Hearts for celebrating state */}
      {isCelebrating && (
        <div style={{ position: 'absolute', top: -30, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
          <div className="animate-confetti" style={{ fontSize: 24 }}>💖</div>
          <div className="animate-confetti" style={{ fontSize: 20, animationDelay: '0.2s', marginLeft: 15 }}>✨</div>
          <div className="animate-confetti" style={{ fontSize: 18, animationDelay: '0.4s', marginRight: 20 }}>🎉</div>
        </div>
      )}

      {/* ── Tail (behind body) ── */}
      <div
        style={{
          position: 'absolute', width: 52, height: 38, bottom: 10, right: 2,
          background: 'linear-gradient(135deg, #e8642a 0%, #d4521a 100%)',
          borderRadius: '60% 80% 30% 50%', transform: 'rotate(-20deg)', zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute', width: 22, height: 18, bottom: 12, right: 4,
          background: 'linear-gradient(135deg, #fff8f0 0%, #f5e6d8 100%)',
          borderRadius: '50% 70% 40% 60%', transform: 'rotate(-20deg)', zIndex: 0,
        }}
      />

      {/* ── Body ── */}
      <div
        style={{
          position: 'absolute', width: 78, height: 58, bottom: 8, left: 22,
          background: 'linear-gradient(160deg, #e8642a 0%, #c94e18 70%, #b54010 100%)',
          borderRadius: '46% 46% 38% 38%', zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute', width: 38, height: 32, bottom: 12, left: 42,
          background: 'linear-gradient(160deg, #fff0e0 0%, #fddbc0 100%)',
          borderRadius: '50%', zIndex: 2,
        }}
      />

      {/* ── Head Wrapper (for shake and curious animations) ── */}
      <div 
        className={mascotState === 'shake' ? 'animate-head-shake' : ''}
        style={{
          position: 'absolute', inset: 0, zIndex: 10,
          transform: mascotState === 'curious' ? 'rotate(-10deg) translateX(-5px)' : 'none',
          transformOrigin: '63px 70px',
          transition: 'transform 0.3s ease'
        }}
      >
        {/* ── Head ── */}
        <div
          style={{
            position: 'absolute', width: 60, height: 52, bottom: 52, left: 33,
            background: 'linear-gradient(140deg, #e8642a 0%, #d4521a 100%)',
            borderRadius: '50% 50% 42% 42%', zIndex: 3,
          }}
        />

        {/* ── Ears ── */}
        <div style={{ position: 'absolute', width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '26px solid #d4521a', bottom: 96, left: 30, transform: 'rotate(-12deg)', zIndex: 3 }} />
        <div style={{ position: 'absolute', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '16px solid #f5a0a0', bottom: 98, left: 35, transform: 'rotate(-12deg)', zIndex: 4 }} />
        
        <div style={{ position: 'absolute', width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '26px solid #d4521a', bottom: 96, left: 72, transform: 'rotate(12deg)', zIndex: 3 }} />
        <div style={{ position: 'absolute', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '16px solid #f5a0a0', bottom: 98, left: 77, transform: 'rotate(12deg)', zIndex: 4 }} />

        {/* ── Face ── */}
        <div style={{ position: 'absolute', width: 28, height: 18, bottom: 62, left: 49, background: 'linear-gradient(160deg, #fff0e0 0%, #fddbc0 100%)', borderRadius: '50%', zIndex: 5 }} />
        <div style={{ position: 'absolute', width: 10, height: 7, bottom: 76, left: 58, background: '#2d1a10', borderRadius: '50%', zIndex: 6 }} />

        {/* Eyes (blink in idle, wide in celebrate) */}
        <div style={{ position: 'absolute', width: 14, height: isCelebrating ? 15 : 13, bottom: 84, left: 40, background: '#fff', borderRadius: '50%', zIndex: 5 }} />
        <div style={{ position: 'absolute', width: 9, height: isCelebrating ? 11 : 10, bottom: 85, left: 43, background: '#1a0e08', borderRadius: '50%', zIndex: 6, animation: !isWorking && !isCelebrating && mascotState !== 'curious' ? 'blink 4s ease-in-out infinite' : 'none' }} />
        <div style={{ position: 'absolute', width: 4, height: 4, bottom: 89, left: 44, background: 'white', borderRadius: '50%', zIndex: 7 }} />

        <div style={{ position: 'absolute', width: 14, height: isCelebrating ? 15 : 13, bottom: 84, left: 68, background: '#fff', borderRadius: '50%', zIndex: 5 }} />
        <div style={{ position: 'absolute', width: 9, height: isCelebrating ? 11 : 10, bottom: 85, left: 71, background: '#1a0e08', borderRadius: '50%', zIndex: 6, animation: !isWorking && !isCelebrating && mascotState !== 'curious' ? 'blink 4s ease-in-out 0.2s infinite' : 'none' }} />
        <div style={{ position: 'absolute', width: 4, height: 4, bottom: 89, left: 72, background: 'white', borderRadius: '50%', zIndex: 7 }} />

        <div style={{ position: 'absolute', width: 12, height: 7, bottom: 72, left: 37, background: 'rgba(255,130,100,0.35)', borderRadius: '50%', zIndex: 5 }} />
        <div style={{ position: 'absolute', width: 12, height: 7, bottom: 72, left: 77, background: 'rgba(255,130,100,0.35)', borderRadius: '50%', zIndex: 5 }} />

        <div style={{
          position: 'absolute', bottom: isCelebrating ? 60 : 61, left: 56, zIndex: 6,
          width: 14, height: isCelebrating ? 8 : 6,
          borderBottom: mascotState === 'shake' ? '2.5px solid transparent' : '2.5px solid #8b4a2a', borderLeft: '1.5px solid transparent', borderRight: '1.5px solid transparent',
          borderRadius: mascotState === 'shake' ? '50%' : '0 0 50% 50%',
          backgroundColor: isCelebrating ? '#8b4a2a' : mascotState === 'shake' ? '#8b4a2a' : 'transparent',
          transform: mascotState === 'shake' ? 'scaleY(0.5) translateY(4px)' : 'none'
        }} />
      </div>

      {/* ── Suit ── */}
      <div style={{ position: 'absolute', bottom: 42, left: 45, width: 14, height: 18, background: '#f8f4f0', borderRadius: '2px 2px 0 8px', transform: 'rotate(10deg)', zIndex: 3 }} />
      <div style={{ position: 'absolute', bottom: 42, left: 67, width: 14, height: 18, background: '#f8f4f0', borderRadius: '2px 2px 8px 0', transform: 'rotate(-10deg)', zIndex: 3 }} />
      <div style={{ position: 'absolute', bottom: 34, left: 59, width: 10, height: 22, background: 'linear-gradient(180deg, #4a7fd4 0%, #2e5ab5 100%)', borderRadius: '2px 2px 4px 4px', zIndex: 4 }} />
      <div style={{ position: 'absolute', bottom: 54, left: 57, width: 14, height: 9, background: '#3868c2', borderRadius: '3px', zIndex: 5, clipPath: 'polygon(50% 0%, 100% 40%, 50% 100%, 0% 40%)' }} />

      {/* ── Scarf (Rainy Mood) ── */}
      {mood === 'rainy' && (
        <div style={{ position: 'absolute', zIndex: 6, bottom: 62, left: 36 }}>
          <div style={{ position: 'absolute', width: 54, height: 14, background: '#dc2626', borderRadius: 8, transform: 'rotate(-4deg)' }} />
          <div style={{ position: 'absolute', width: 14, height: 28, top: 10, left: 32, background: '#b91c1c', borderRadius: '0 0 6px 6px', transform: 'rotate(8deg)' }} />
          <div style={{ position: 'absolute', width: 54, height: 2, top: 6, background: 'rgba(0,0,0,0.15)', transform: 'rotate(-4deg)' }} />
          <div style={{ position: 'absolute', width: 2, height: 14, top: 0, left: 16, background: 'rgba(0,0,0,0.15)', transform: 'rotate(-4deg)' }} />
          <div style={{ position: 'absolute', width: 2, height: 14, top: 0, left: 40, background: 'rgba(0,0,0,0.15)', transform: 'rotate(-4deg)' }} />
        </div>
      )}

      {/* ── Arms ── */}
      <div
        className={isWorking ? "animate-type-left" : mascotState === 'wave' ? "animate-wave-arm" : ""}
        style={{
          position: 'absolute', width: 32, height: 11, bottom: isCelebrating ? 36 : 28, left: 8,
          background: '#7a5038', borderRadius: 6,
          transform: isCelebrating ? 'rotate(-45deg)' : mascotState === 'wave' ? 'rotate(45deg)' : 'rotate(-18deg)',
          transformOrigin: 'right center', zIndex: 6,
          transition: 'all 0.2s ease',
        }}
      />
      <div
        className={isWorking ? "animate-type-right" : ""}
        style={{
          position: 'absolute', width: 32, height: 11, bottom: isCelebrating ? 36 : 28, right: 2,
          background: '#7a5038', borderRadius: 6,
          transform: isCelebrating ? 'rotate(45deg)' : 'rotate(18deg)',
          transformOrigin: 'left center', zIndex: 2,
          transition: 'all 0.2s ease',
        }}
      />

      {/* ── Legs ── */}
      <div style={{ position: 'absolute', width: 18, height: 20, bottom: 0, left: 40, background: '#b54010', borderRadius: '4px 4px 6px 6px', zIndex: 2 }} />
      <div style={{ position: 'absolute', width: 18, height: 20, bottom: 0, left: 66, background: '#a83a0c', borderRadius: '4px 4px 6px 6px', zIndex: 2 }} />
    </div>
  );
}
