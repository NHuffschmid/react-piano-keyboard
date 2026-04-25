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
      ? Math.max(10, Math.min(22, keyWidth * 0.70))
      : Math.max(10, Math.min(17, keyWidth * 0.85))
    : isWhite ? 14 : 14;

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
      {label && isPressed && (
        <span
          className={isWhite ? 'key-label key-label--white' : 'key-label key-label--black'}
          style={{ fontSize }}
        >
          {isWhite ? (
            <>
              <span className="key-label__primary">{label.primary}</span>
              {label.secondary && (
                <span className="key-label__secondary">{label.secondary}</span>
              )}
            </>
          ) : (
            <span className="key-label__primary">
              {label.secondary ? `${label.primary} / ${label.secondary}` : label.primary}
            </span>
          )}
        </span>
      )}
    </div>
  );
};

export default Key;
