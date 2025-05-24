'use client';
import { useEffect, useState } from 'react';

interface Props {
  text: string;
  speed?: number;
}

const TypewriterText: React.FC<Props> = ({ text, speed = 25 }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <p>{displayed}</p>;
};

export default TypewriterText;
