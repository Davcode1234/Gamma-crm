import { useEffect, useState } from 'react';

const secretSequence = ['g', 's', 's']; // lowercase letters

export function useSecretShortcut(callback: () => void) {
  const [input, setInput] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase(); // normalize input
      setInput((prev) => {
        const newInput = [...prev, key].slice(-secretSequence.length);
        if (newInput.join(',') === secretSequence.join(',')) {
          callback();
        }
        return newInput || input;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callback]);
}
