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

/** Returns '#000' for light backgrounds, '#fff' for dark ones (WCAG luminance). */
function parseCssColor(color: string): { r: number; g: number; b: number } | null {
  const value = color.trim();

  const shortHexMatch = value.match(/^#([\da-f]{3})$/i);
  if (shortHexMatch) {
    const [r, g, b] = shortHexMatch[1].split('').map((c) => parseInt(c + c, 16));
    return { r, g, b };
  }

  const fullHexMatch = value.match(/^#([\da-f]{6})$/i);
  if (fullHexMatch) {
    const hex = fullHexMatch[1];
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  const rgbMatch = value.match(
    /^rgba?\(\s*([+-]?\d*\.?\d+)%?\s*,\s*([+-]?\d*\.?\d+)%?\s*,\s*([+-]?\d*\.?\d+)%?(?:\s*,\s*[+-]?\d*\.?\d+\s*)?\)$/i
  );
  if (rgbMatch) {
    const r = Math.max(0, Math.min(255, Number(rgbMatch[1])));
    const g = Math.max(0, Math.min(255, Number(rgbMatch[2])));
    const b = Math.max(0, Math.min(255, Number(rgbMatch[3])));
    return { r, g, b };
  }

  if (typeof document !== 'undefined') {
    const el = document.createElement('span');
    el.style.color = '';
    el.style.color = value;

    if (el.style.color) {
      document.body.appendChild(el);
      const resolved = getComputedStyle(el).color;
      document.body.removeChild(el);
      return parseCssColor(resolved);
    }
  }

  return null;
}

function contrastColor(color: string): string {
  const rgb = parseCssColor(color);
  if (!rgb) return '#fff';

  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return L > 0.179 ? '#000' : '#fff';
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
      ? keyWidth * 0.9 : keyWidth * 0.85
    : isWhite ? 19 : 14;

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
          style={{ fontSize, color: contrastColor(pressedColor) }}
        >
          <span className="key-label__primary">{label.primary}</span>
          {label.secondary && (
            <span className="key-label__secondary">/ {label.secondary}</span>
          )}
        </span>
      )}
    </div>
  );
};

export default Key;
