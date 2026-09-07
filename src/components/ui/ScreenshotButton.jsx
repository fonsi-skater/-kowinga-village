// ScreenshotButton.jsx
// Captures the current 3D view as a downloadable image (or uses the
// native share sheet on mobile, if available). Requires the Canvas to be
// created with gl={{ preserveDrawingBuffer: true }} — otherwise WebGL
// clears its buffer immediately after each frame and toDataURL() would
// only ever capture a blank image.

const buttonStyle = {
  background: 'rgba(0,0,0,0.55)',
  color: 'white',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: '6px',
  padding: '8px 16px',
  fontFamily: 'sans-serif',
  fontSize: '0.85rem',
  cursor: 'pointer',
  pointerEvents: 'auto',
};

export default function ScreenshotButton() {
  async function handleCapture() {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');

    // On devices/browsers that support the native Web Share API (mostly
    // mobile), share directly; otherwise fall back to a plain download —
    // both paths are equally valid, just different UX depending on device.
    if (navigator.share) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'kowinga-village.png', { type: 'image/png' });
        await navigator.share({
          files: [file],
          title: 'My moment in Kowinga',
        });
        return;
      } catch {
        // User cancelled the share sheet, or share failed — fall through
        // to the download approach below rather than leaving them stuck.
      }
    }

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'kowinga-village.png';
    link.click();
  }

  return (
    <button style={buttonStyle} onClick={handleCapture}>
      📸 Capture
    </button>
  );
}
