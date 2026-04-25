import React, { useRef } from 'react';
import './Keyboard.css';
import type { ChromaticNoteName } from './noteNames';

interface KeyProps {
  note: number;
  isPressed: boolean;
  setPressed: (state: boolean) => void;
  style?: React.CSSProperties;
  pressedColor?: string;
  keyWidth?: number;
  label?: ChromaticNoteName;
}

// Helper to determine if a key is white
function isWhiteKey(note: number): boolean {
  const n = note % 12;
  return ![1, 3, 6, 8, 10].includes(n);
}

const Key: React.FC<KeyProps> = ({
  note,
  isPressed,
  setPressed,
  style,
  pressedColor = '#888',
  keyWidth,
  label,
}) => {
  const isWhite = isWhiteKey(note);
  const mousePressed = useRef<boolean>(false);

  const bgStyle: React.CSSProperties = {
    background: isPressed ? pressedColor : isWhite ? 'white' : 'black'
  };

  const fontSize = keyWidth
    ? isWhite
      ? Math.max(7, Math.min(13, keyWidth * 0.35))
      : Math.max(6, Math.min(10, keyWidth * 0.24))
    : isWhite ? 10 : 8;

  const handleMouseDown = () => {
    mousePressed.current = true;
    setPressed(true);
  };

  const handleMouseUp = () => {
    if (mousePressed.current) {
      setPressed(false);
      mousePressed.current = false;
    }
  };

  const handleMouseLeave = () => {
    if (mousePressed.current) {
      setPressed(false);
      mousePressed.current = false;
    }
  };

  return (
    <div
      className={isWhite ? 'ivory' : 'ebony'}
      style={{ ...style, ...bgStyle }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {label && (
        <span
          className={isWhite ? 'key-label key-label--white' : 'key-label key-label--black'}
          style={{ fontSize }}
        >
          <span className="key-label__primary">{label.primary}</span>
          {label.secondary && (
            <span className="key-label__secondary">{label.secondary}</span>
          )}
        </span>
      )}
    </div>
  );
};

export default Key;
