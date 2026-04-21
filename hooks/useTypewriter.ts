'use client';

import * as React from 'react';

export interface UseTypewriterOptions {
  text: string;
  speed?: number;
  delay?: number;
  loop?: boolean;
}

export interface UseTypewriterReturn {
  displayedText: string;
  isComplete: boolean;
  reset: () => void;
}

export function useTypewriter({ text, speed = 50, delay = 0, loop = false }: UseTypewriterOptions): UseTypewriterReturn {
  const [displayedText, setDisplayedText] = React.useState('');
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    let index = 0;

    const start = () => {
      timeout = setTimeout(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
          start();
        } else {
          setIsComplete(true);
          if (loop) {
            timeout = setTimeout(() => {
              setIsComplete(false);
              index = 0;
              start();
            }, speed * 2);
          }
        }
      }, speed);
    };

    const initialDelay = setTimeout(() => {
      start();
    }, delay);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timeout);
    };
  }, [text, speed, delay, loop]);

  const reset = React.useCallback(() => {
    setDisplayedText('');
    setIsComplete(false);
  }, []);

  return { displayedText, isComplete, reset };
}
