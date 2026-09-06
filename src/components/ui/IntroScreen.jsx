// IntroScreen.jsx
// Full-screen splash shown before entering Kowinga — combines the
// personal reflection, a playful Bruno-Simon-style warning, and an
// invitation to join Fonsi in the village's activities. Clicking "Enter
// Kowinga" dismisses it AND serves as the user gesture that unlocks
// audio autoplay (browsers require a real click/keypress before audio
// can play — this button click satisfies that requirement cleanly).

import { useGameStore } from '../../state/useGameStore';
import { INTRO_SCREEN_CONTENT } from '../../story/introScreenContent';

export default function IntroScreen() {
  const showIntroScreen = useGameStore((state) => state.showIntroScreen);
  const setShowIntroScreen = useGameStore((state) => state.setShowIntroScreen);

  if (!showIntroScreen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(10, 20, 12, 0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20, // above everything else, including PortfolioPanel
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          width: '90%',
          color: 'white',
          fontFamily: 'sans-serif',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        <h1
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
            marginBottom: '24px',
            background: 'linear-gradient(90deg, #ffb347, #ff6f91, #6fd6ff)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Welcome to Kowinga
        </h1>

        <p style={{ lineHeight: 1.7, opacity: 0.95, fontStyle: 'italic' }}>
          {INTRO_SCREEN_CONTENT.reflection}
        </p>

        <p style={{ lineHeight: 1.7, opacity: 0.9, marginTop: '20px' }}>
          {INTRO_SCREEN_CONTENT.warning}
        </p>

        <p style={{ lineHeight: 1.7, opacity: 0.9, marginTop: '20px' }}>
          {INTRO_SCREEN_CONTENT.invitation}
        </p>

        <button
          onClick={() => setShowIntroScreen(false)}
          style={{
            marginTop: '28px',
            background: '#8fd694',
            color: '#1e2a20',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 28px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Enter Kowinga
        </button>
      </div>
    </div>
  );
}
