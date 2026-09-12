import { useEffect, useState } from 'react';

/**
 * Reusable typewriter effect hook.
 * Cycles through `words`, typing each one out character by character,
 * pausing, then deleting it before moving to the next word — looping forever.
 *
 * @param {string[]} words - list of strings to cycle through
 * @param {object} [options]
 * @param {number} [options.typingSpeed=85]   - ms per character while typing
 * @param {number} [options.deletingSpeed=45] - ms per character while deleting
 * @param {number} [options.pauseTime=1400]   - ms to pause after a word is fully typed
 * @returns {string} the text currently displayed
 */
export default function useTypewriter(words, options = {}) {
  const { typingSpeed = 85, deletingSpeed = 45, pauseTime = 1400 } = options;

  const [wordIndex, setWordIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return undefined;

    const currentWord = words[wordIndex % words.length];

    // Fully typed — pause, then start deleting.
    if (!deleting && charCount === currentWord.length) {
      const pause = setTimeout(() => setDeleting(true), pauseTime);
      return () => clearTimeout(pause);
    }

    // Fully deleted — move to the next word.
    if (deleting && charCount === 0) {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
      return undefined;
    }

    const speed = deleting ? deletingSpeed : typingSpeed;
    const timeout = setTimeout(() => {
      setCharCount((c) => c + (deleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [charCount, deleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  const currentWord = words?.[wordIndex % (words?.length || 1)] || '';
  return currentWord.slice(0, charCount);
}
