// SiteTitle.jsx
// Large, colorful, artistic title banner at the top of the page —
// pure UI/UX, sits above the 3D canvas as an HTML overlay. Uses a CSS
// gradient text effect for a lively, non-generic look instead of a flat
// solid color.

export default function SiteTitle() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '14px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(1.4rem, 4vw, 2.4rem)',
          fontWeight: 'bold',
          letterSpacing: '2px',
          // Gradient text: the background is a gradient, then we clip it
          // to only show through the text shape itself.
          background: 'linear-gradient(90deg, #ffb347, #ff6f91, #6fd6ff)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          textShadow: '0 2px 12px rgba(0,0,0,0.35)',
        }}
      >
        ALPHONCE FONSI{' '}
        <span
          style={{
            fontSize: 'clamp(1.8rem, 5.5vw, 3.2rem)',
            fontWeight: 900,
            letterSpacing: '4px',
            background: 'linear-gradient(90deg, #ffd93d, #ff6f91, #8fd694)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          PORTFOLIO
        </span>
      </h1>
    </div>
  );
}
