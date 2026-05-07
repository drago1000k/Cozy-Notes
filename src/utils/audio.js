// Web Audio API Utilities for ASMR Sounds
// These synthesize sounds without needing external assets

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume in case it's suspended (browser auto-play policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Generates a short burst of noise for paper crinkling
export function playCrinkle() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.15; // 150ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Filter to make it sound like paper (bandpass)
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1500;
    filter.Q.value = 0.8;

    // Envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();
  } catch (e) {
    console.warn('Audio play failed', e);
  }
}

// Generates a short, satisfying "pop" sound for deletion
export function playPop() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    // Rapid pitch drop
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.warn('Audio play failed', e);
  }
}

// Generates a scribbling sound for marking done
export function playScribble() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.3; // 300ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Brown noise approximation
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Compensate gain
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    // Add some amplitude modulation to simulate back-and-forth scribbling
    gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.15);
    gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.25);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();
  } catch (e) {
    console.warn('Audio play failed', e);
  }
}

// Rain loop management
let rainNode = null;
let rainGain = null;

export function toggleRainSound(enabled) {
  try {
    const ctx = getAudioContext();
    
    if (!enabled && rainGain) {
      // Fade out
      rainGain.gain.cancelScheduledValues(ctx.currentTime);
      rainGain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1);
      setTimeout(() => {
        if (rainNode) {
          rainNode.stop();
          rainNode.disconnect();
          rainNode = null;
        }
      }, 1000);
      return;
    }

    if (enabled && !rainNode) {
      const bufferSize = ctx.sampleRate * 2; // 2 seconds loop
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Pink noise
      let b0, b1, b2, b3, b4, b5, b6;
      b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        let white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11; // scaling
        b6 = white * 0.115926;
      }

      rainNode = ctx.createBufferSource();
      rainNode.buffer = buffer;
      rainNode.loop = true;

      // Lowpass to make it sound muffled/outside
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;

      rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0, ctx.currentTime);
      rainGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 2); // Fade in

      rainNode.connect(filter);
      filter.connect(rainGain);
      rainGain.connect(ctx.destination);

      rainNode.start();
    }
  } catch (e) {
    console.warn('Audio play failed', e);
  }
}

// Generates a splash sound for sending the bottle
export function playSplash() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    noiseSource.start();
  } catch (error) { console.debug(error); }
}

// Generates a soft chime for AI response
export function playChime() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.5);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  } catch (error) { console.debug(error); }
}

// Generates a magic twinkle
export function playMagicTwinkle() {
  try {
    const ctx = getAudioContext();
    const notes = [880, 1046, 1318, 1760]; // A5, C6, E6, A6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.5);
    });
  } catch(error){ console.debug(error); }
}

// Generates a bird chirp
export function playBirdChirp() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch(error){ console.debug(error); }
}

// Generates a soft wind swoosh
export function playWindSwoosh() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 1.5);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch(error){ console.debug(error); }
}

// Generates a glass clink sound for the message bottle
export function playGlassClink() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch(error){ console.debug(error); }
}

// Generates a pleasant double chime for the alarm
export function playAlarm() {
  try {
    const ctx = getAudioContext();
    const playNote = (freq, startTime) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.4, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 1.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 1.2);
    };

    const now = ctx.currentTime;
    playNote(1046.50, now); // C6
    playNote(1318.51, now + 0.15); // E6
    
    // repeat
    playNote(1046.50, now + 0.6); 
    playNote(1318.51, now + 0.75);
  } catch(error){ console.debug(error); }
}

// Generates a rapid keyboard typing burst sound
export function playKeyboardTap() {
  try {
    const ctx = getAudioContext();
    
    const playClack = (startTime) => {
      // The high click
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = 'triangle';
      click.frequency.setValueAtTime(2000, startTime);
      click.frequency.exponentialRampToValueAtTime(800, startTime + 0.02);
      clickGain.gain.setValueAtTime(0, startTime);
      clickGain.gain.linearRampToValueAtTime(0.05, startTime + 0.005);
      clickGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.03);
      click.connect(clickGain);
      clickGain.connect(ctx.destination);
      
      // The low thump
      const thump = ctx.createOscillator();
      const thumpGain = ctx.createGain();
      thump.type = 'sine';
      thump.frequency.setValueAtTime(300, startTime);
      thump.frequency.exponentialRampToValueAtTime(50, startTime + 0.04);
      thumpGain.gain.setValueAtTime(0, startTime);
      thumpGain.gain.linearRampToValueAtTime(0.15, startTime + 0.005);
      thumpGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);
      thump.connect(thumpGain);
      thumpGain.connect(ctx.destination);

      click.start(startTime);
      click.stop(startTime + 0.03);
      thump.start(startTime);
      thump.stop(startTime + 0.05);
    };

    const now = ctx.currentTime;
    playClack(now);
    playClack(now + 0.07);
    playClack(now + 0.13);
    playClack(now + 0.22);
    playClack(now + 0.32);
  } catch(error){ console.debug(error); }
}

export function playMoodSound(mood) {
  if (mood === 'magical') playMagicTwinkle();
  else if (mood === 'clear') playBirdChirp();
  else if (mood === 'cloudy') playWindSwoosh();
  // rainy is handled by the continuous rain sound toggle
}
