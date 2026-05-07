// Cute capybara mascot built with pure CSS shapes and SVG
export default function Capybara() {
  return (
    <div className="relative select-none" style={{ width: 120, height: 100 }}>
      {/* Body */}
      <div
        className="absolute rounded-[50%] bg-amber-700"
        style={{
          width: 80,
          height: 55,
          bottom: 8,
          left: 20,
          background: 'linear-gradient(160deg, #a0714f 0%, #8b5e3c 60%, #6d4429 100%)',
        }}
      />
      {/* Head */}
      <div
        className="absolute rounded-[50%]"
        style={{
          width: 52,
          height: 44,
          bottom: 44,
          left: 34,
          background: 'linear-gradient(135deg, #a0714f 0%, #8b5e3c 100%)',
        }}
      />
      {/* Snout */}
      <div
        className="absolute rounded-[50%]"
        style={{
          width: 30,
          height: 18,
          bottom: 46,
          left: 45,
          background: '#b07a50',
        }}
      />
      {/* Nostrils */}
      <div
        className="absolute rounded-full bg-amber-900"
        style={{ width: 5, height: 4, bottom: 57, left: 51 }}
      />
      <div
        className="absolute rounded-full bg-amber-900"
        style={{ width: 5, height: 4, bottom: 57, left: 62 }}
      />
      {/* Eyes */}
      <div
        className="absolute rounded-full bg-amber-900"
        style={{ width: 8, height: 8, bottom: 68, left: 46, animation: 'blink 4s ease-in-out infinite' }}
      />
      <div
        className="absolute rounded-full bg-amber-900"
        style={{ width: 8, height: 8, bottom: 68, left: 62, animation: 'blink 4s ease-in-out 0.2s infinite' }}
      />
      {/* Eye shine */}
      <div
        className="absolute rounded-full bg-white"
        style={{ width: 3, height: 3, bottom: 73, left: 50 }}
      />
      <div
        className="absolute rounded-full bg-white"
        style={{ width: 3, height: 3, bottom: 73, left: 66 }}
      />
      {/* Ears */}
      <div
        className="absolute rounded-[50%]"
        style={{
          width: 16,
          height: 12,
          bottom: 84,
          left: 36,
          background: '#8b5e3c',
          transform: 'rotate(-15deg)',
        }}
      />
      <div
        className="absolute rounded-[50%]"
        style={{
          width: 16,
          height: 12,
          bottom: 84,
          left: 64,
          background: '#8b5e3c',
          transform: 'rotate(15deg)',
        }}
      />
      {/* Inner ear */}
      <div
        className="absolute rounded-[50%]"
        style={{ width: 8, height: 6, bottom: 86, left: 40, background: '#c4956a' }}
      />
      <div
        className="absolute rounded-[50%]"
        style={{ width: 8, height: 6, bottom: 86, left: 68, background: '#c4956a' }}
      />
      {/* Tiny legs */}
      <div
        className="absolute rounded-b-lg"
        style={{ width: 16, height: 18, bottom: 0, left: 26, background: '#8b5e3c' }}
      />
      <div
        className="absolute rounded-b-lg"
        style={{ width: 16, height: 18, bottom: 0, left: 46, background: '#8b5e3c' }}
      />
      <div
        className="absolute rounded-b-lg"
        style={{ width: 16, height: 18, bottom: 0, left: 66, background: '#7a5233' }}
      />
      {/* Flower on head (cute accessory) */}
      <div className="absolute" style={{ bottom: 84, left: 56 }}>
        <span style={{ fontSize: 14 }}>🌸</span>
      </div>

      {/* Arms reaching forward (typing posture) */}
      <div
        className="absolute rounded-full"
        style={{
          width: 28,
          height: 10,
          bottom: 30,
          left: 10,
          background: '#8b5e3c',
          transform: 'rotate(-25deg)',
          transformOrigin: 'right center',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 28,
          height: 10,
          bottom: 30,
          left: 82,
          background: '#8b5e3c',
          transform: 'rotate(25deg)',
          transformOrigin: 'left center',
        }}
      />
    </div>
  );
}
