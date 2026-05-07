import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Coffee, Minus, Plus } from 'lucide-react';
import keyboardSound from '../assets/Sounds/KeyboardSound.mp3';

export default function TimerModal({ mode, onClose, onStart, onAcknowledge }) {
  const [mins, setMins] = useState(25);

  useEffect(() => {
    if (mode !== 'selecting') return;
    
    const audio = new Audio(keyboardSound);
    audio.loop = true;
    audio.volume = 0.4;
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [mode]);
  if (mode === 'complete') {
    return (
      <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onAcknowledge}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4 border-2 border-emerald-400"
          style={{ width: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-4xl">🎉</div>
          <h2 className="font-handwriting text-2xl font-bold text-emerald-600">Time's Up!</h2>
          <p className="text-center text-sm text-gray-600">Great focus session. Take a short break, stretch your legs, and grab some water.</p>
          <button
            onClick={onAcknowledge}
            className="mt-2 w-full py-2 rounded-xl font-bold text-white shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            Got it!
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl flex flex-col gap-4 border border-white/50"
        style={{ width: 320 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Coffee size={18} className="text-amber-700" />
            <h2 className="font-handwriting text-xl font-bold text-amber-900">Set Focus Time</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full cursor-pointer"><X size={16} /></button>
        </div>

        <div className="flex flex-col items-center gap-4 py-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMins(Math.max(1, mins - 5))}
              className="p-2 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer transition-colors"
            >
              <Minus size={20} />
            </button>
            
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                min="1"
                max="999"
                value={mins}
                onChange={(e) => setMins(parseInt(e.target.value) || 0)}
                className="text-center text-5xl font-bold text-amber-600 bg-transparent outline-none p-0 m-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                style={{ fontFamily: 'Nunito, sans-serif', width: `${Math.max(1, mins.toString().length)}ch` }}
              />
              <span className="text-amber-700 font-bold">m</span>
            </div>

            <button 
              onClick={() => setMins(mins + 5)}
              className="p-2 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <div className="flex gap-2 w-full mt-2">
            {[10, 25, 50, 90].map(preset => (
              <button
                key={preset}
                onClick={() => setMins(preset)}
                className="flex-1 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold hover:bg-amber-100 cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              const finalMins = Math.max(1, mins);
              onStart(finalMins * 60);
            }}
            className="mt-2 w-full py-3 rounded-xl font-bold text-white shadow-lg hover:opacity-90 transition-opacity cursor-pointer text-lg flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
          >
            ▶ Start Session
          </button>
        </div>
      </motion.div>
    </div>
  );
}
