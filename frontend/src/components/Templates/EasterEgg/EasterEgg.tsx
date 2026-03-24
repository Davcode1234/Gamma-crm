import { useState } from 'react';
import { useSecretShortcut } from '../../../hooks/useKonamiCode';

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  image: {
    maxWidth: '80%',
    maxHeight: '80%',
    borderRadius: '12px',
    boxShadow: '0 0 40px white',
  },
};

export default function EasterEgg() {
  const [visible, setVisible] = useState(false);

  useSecretShortcut(() => {
    const audio = new Audio('Kaz/.mp3');
    audio.play();
    setVisible(true);

    // Hide image after 5 seconds
    setTimeout(() => setVisible(false), 5000);
  });

  return (
    visible && (
      <div style={styles.overlay}>
        <img
          src="/image_J.png" // place the image in /public folder
          alt="Easter Egg"
          style={styles.image}
        />
      </div>
    )
  );
}
