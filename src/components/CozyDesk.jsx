import { motion } from 'framer-motion';
import Fox from './Fox';
import BottleCompanion from './BottleCompanion';

// Coffee cup with steam animation
function CoffeeCup({ isNight }) {
  const steamColor = isNight ? 'rgba(200,180,150,0.6)' : 'rgba(120,100,80,0.4)';
  return (
    <div className="relative" style={{ width: 36, height: 42 }}>
      {/* Steam wisps */}
      <div className="absolute" style={{ bottom: 38, left: 6 }}>
        <div className="animate-steam1 absolute rounded-full" style={{ width: 4, height: 10, background: steamColor, filter: 'blur(1px)' }} />
      </div>
      <div className="absolute" style={{ bottom: 38, left: 14 }}>
        <div className="animate-steam2 absolute rounded-full" style={{ width: 4, height: 12, background: steamColor, filter: 'blur(1px)' }} />
      </div>
      <div className="absolute" style={{ bottom: 38, left: 22 }}>
        <div className="animate-steam3 absolute rounded-full" style={{ width: 4, height: 8, background: steamColor, filter: 'blur(1px)' }} />
      </div>

      {/* Cup body */}
      <div className="absolute rounded-b-xl" style={{ width: 30, height: 26, bottom: 8, left: 3, background: 'linear-gradient(160deg, #f5ede0 0%, #e8d5b7 100%)', border: '2px solid #c4956a' }} />
      {/* Coffee liquid */}
      <div className="absolute rounded-full" style={{ width: 22, height: 10, bottom: 24, left: 7, background: '#6f4e37' }} />
      {/* Handle */}
      <div className="absolute rounded-full" style={{ width: 10, height: 14, bottom: 12, left: 24, border: '3px solid #c4956a', background: 'transparent' }} />
      {/* Saucer */}
      <div className="absolute rounded-full" style={{ width: 36, height: 8, bottom: 0, left: 0, background: 'linear-gradient(160deg, #d4b896 0%, #c4956a 100%)', border: '1px solid #a0714f' }} />
    </div>
  );
}

// Mini laptop SVG / Timer
function Laptop({ timerMode, timeLeft, onToggleTimer }) {
  return (
    <div className="relative" style={{ width: 100, height: 70 }}>
      {/* Screen */}
      <div
        className="absolute rounded-t-lg flex flex-col items-center pt-2 cursor-pointer"
        onClick={onToggleTimer}
        style={{
          width: 90, height: 52, top: 0, left: 5,
          background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
          border: '3px solid #4a5568', overflow: 'hidden',
          boxShadow: timerMode ? '0 0 15px rgba(236, 72, 153, 0.4)' : 'none',
          transition: 'box-shadow 0.3s',
        }}
        title="Toggle Pomodoro Timer"
      >
        {timerMode ? (
          <div className="text-center font-bold" style={{ color: '#fbcfe8', textShadow: '0 0 5px rgba(244,114,182,0.8)' }}>
            <div style={{ fontSize: 18, lineHeight: 1 }}>{timeLeft}</div>
            <div style={{ fontSize: 7, color: '#f472b6', marginTop: 2, letterSpacing: 1 }}>FOCUS</div>
          </div>
        ) : (
          <div className="p-1.5 pt-2 w-full h-full">
            <div className="h-1.5 rounded-full mb-1" style={{ background: '#68d391', width: '60%', opacity: 0.8 }} />
            <div className="h-1.5 rounded-full mb-1" style={{ background: '#fbd38d', width: '45%', opacity: 0.7 }} />
            <div className="h-1.5 rounded-full mb-1" style={{ background: '#fc8181', width: '70%', opacity: 0.6 }} />
            <div className="h-1.5 rounded-full mb-1" style={{ background: '#76e4f7', width: '38%', opacity: 0.8 }} />
            <div className="h-1.5 rounded-full mb-1" style={{ background: '#b794f4', width: '52%', opacity: 0.7 }} />
            <div className="h-1 rounded-full" style={{ background: '#68d391', width: '30%', opacity: 0.5 }} />
            {/* Play button hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition-opacity">
              <span style={{ fontSize: 18 }}>⏱️</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(72,187,120,0.08) 0%, transparent 70%)' }} />
      </div>
      
      {/* Base */}
      <div className="absolute" style={{ width: 100, height: 8, bottom: 4, left: 0, background: 'linear-gradient(180deg, #4a5568 0%, #2d3748 100%)', borderRadius: '2px 2px 6px 6px', border: '2px solid #2d3748' }} />
      {/* Hinge line */}
      <div className="absolute" style={{ width: 96, height: 2, bottom: 16, left: 2, background: '#2d3748', borderRadius: 1 }} />
    </div>
  );
}

// Plant decoration
function PlantPot() {
  return (
    <div className="relative" style={{ width: 40, height: 52 }}>
      <div className="absolute rounded-[50%]" style={{ width: 22, height: 28, bottom: 22, left: 0, background: 'linear-gradient(135deg, #68d391 0%, #38a169 100%)', transform: 'rotate(-20deg)', transformOrigin: 'bottom right' }} />
      <div className="absolute rounded-[50%]" style={{ width: 22, height: 28, bottom: 22, left: 18, background: 'linear-gradient(135deg, #9ae6b4 0%, #48bb78 100%)', transform: 'rotate(20deg)', transformOrigin: 'bottom left' }} />
      <div className="absolute rounded-[50%]" style={{ width: 18, height: 24, bottom: 26, left: 11, background: 'linear-gradient(135deg, #68d391 0%, #2f855a 100%)', transform: 'rotate(0deg)' }} />
      <div className="absolute" style={{ width: 4, height: 16, bottom: 20, left: 18, background: '#276749', borderRadius: 2 }} />
      <div className="absolute" style={{ width: 36, height: 22, bottom: 0, left: 2, background: 'linear-gradient(160deg, #fc8181 0%, #e53e3e 100%)', borderRadius: '2px 2px 8px 8px', clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 100%, 0% 100%)' }} />
      <div className="absolute rounded" style={{ width: 38, height: 6, bottom: 19, left: 1, background: '#fc8181' }} />
    </div>
  );
}

// Books stack
function Books() {
  return (
    <div className="relative flex flex-col-reverse items-center" style={{ width: 32, height: 48 }}>
      {[
        { color: '#fbd38d', width: 28, height: 12 },
        { color: '#fc8181', width: 26, height: 10 },
        { color: '#76e4f7', width: 30, height: 12 },
        { color: '#b794f4', width: 24, height: 10 },
      ].map((book, i) => (
        <div key={i} className="rounded-sm" style={{ width: book.width, height: book.height, background: book.color, border: '1px solid rgba(0,0,0,0.1)', marginBottom: 1, boxShadow: '1px 1px 2px rgba(0,0,0,0.15)' }} />
      ))}
    </div>
  );
}

// Desk Lamp
function DeskLamp({ isNight }) {
  return (
    <div className="relative" style={{ width: 40, height: 60 }}>
      {/* Base */}
      <div className="absolute" style={{ width: 24, height: 6, bottom: 0, left: 8, background: '#4a5568', borderRadius: '4px 4px 2px 2px' }} />
      {/* Arm SVG */}
      <svg className="absolute" style={{ bottom: 4, left: 0 }} width="40" height="50">
        <path d="M20 46 L20 25 L30 12" fill="none" stroke="#718096" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {/* Head + Bulb Wrapper */}
      <div className="absolute flex justify-center" style={{ width: 22, height: 16, bottom: 26, left: 19, background: '#2d3748', borderRadius: '8px 8px 4px 4px', transform: 'rotate(-45deg)', transformOrigin: 'top center', zIndex: 5 }}>
        {/* Light Bulb */}
        <div className={`absolute ${isNight ? 'lamp-glow' : ''}`} style={{ width: 14, height: 6, bottom: -5, background: isNight ? '#fef08a' : '#cbd5e1', borderRadius: '0 0 8px 8px', transition: 'all 1s' }} />
      </div>
    </div>
  );
}

export default function CozyDesk({ mascotState, timerMode, timeLeft, onToggleTimer, mood, onSendBottle }) {
  const isNight = mood === 'magical';

  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end pointer-events-none z-10">
      {/* Desk surface */}
      <div className="relative flex items-end" style={{ width: '70%', maxWidth: 900 }}>
        {/* Desk top surface */}
        <div className="wood-desk absolute bottom-[60px] left-0 right-0 rounded-t-xl pointer-events-auto" style={{ height: 28, boxShadow: '0 -4px 12px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.2)', border: '2px solid var(--color-wood-dark)', borderBottom: 'none' }} />

        {/* Desk front face */}
        <div className="absolute left-0 right-0" style={{ height: 60, bottom: 0, background: 'linear-gradient(180deg, var(--color-wood-dark) 0%, var(--color-wood) 100%)', borderRadius: '0 0 8px 8px', border: '2px solid var(--color-wood-dark)', borderTop: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }} />

        {/* Desk drawer detail */}
        <div className="absolute rounded" style={{ width: 60, height: 20, bottom: 20, left: '50%', transform: 'translateX(-50%)', border: '1.5px solid var(--color-wood-dark)' }} />
        <div className="absolute rounded-full" style={{ width: 8, height: 8, bottom: 28, left: '50%', transform: 'translateX(-50%)', background: 'var(--color-wood-dark)', border: '1px solid var(--color-wood)' }} />

        {/* Legs */}
        <div className="absolute rounded-b-lg" style={{ width: 18, height: 60, bottom: 0, left: 24, background: 'linear-gradient(180deg, var(--color-wood-dark) 0%, var(--color-wood) 100%)', border: '2px solid var(--color-wood-dark)' }} />
        <div className="absolute rounded-b-lg" style={{ width: 18, height: 60, bottom: 0, right: 24, background: 'linear-gradient(180deg, var(--color-wood-dark) 0%, var(--color-wood) 100%)', border: '2px solid var(--color-wood-dark)' }} />

        {/* Items on desk */}
        <div className="relative w-full flex justify-between items-end px-10 md:px-16 pointer-events-auto" style={{ paddingBottom: 82 }}>
          {/* Left side: plant + books + lamp */}
          <div className="flex items-end gap-2 md:gap-4">
            <DeskLamp isNight={isNight} />
            <PlantPot />
            <div className="hidden sm:block">
              <Books />
            </div>
          </div>

          {/* Center: Fox + Laptop */}
          <div className="flex flex-col items-center gap-0">
            <motion.div className="animate-float" style={{ transformOrigin: 'bottom center' }}>
              <Fox mascotState={mascotState} mood={mood} />
            </motion.div>
            <div style={{ marginTop: -10 }}>
              <Laptop timerMode={timerMode} timeLeft={timeLeft} onToggleTimer={onToggleTimer} />
            </div>
          </div>

          {/* Right side: Coffee cup, Bottle, Note pad */}
          <div className="flex items-end gap-3 md:gap-5">
            <div className="hidden sm:block">
              <BottleCompanion onSend={onSendBottle} />
            </div>
            <CoffeeCup isNight={isNight} />
            {/* Sticky note pad */}
            <div className="rounded" style={{ width: 40, height: 40, background: '#fddb6d', border: '1px solid #f0c93a', boxShadow: '1px 2px 4px rgba(0,0,0,0.2)', transform: 'rotate(3deg)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
