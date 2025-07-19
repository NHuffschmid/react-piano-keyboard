import React, { useState, useImperativeHandle, forwardRef } from 'react';
import './Keyboard.css';
import Key from './Key';

const Keyboard = forwardRef(({ from = 36, to = 96, pressedColor = '#888', onKeyDown, onKeyUp }, ref) => {
  // Input validation
  if (from < 12 || to > 120 || to <= from) {
    throw new Error(
      `Invalid Keyboard range: 'from' must be >= 12, 'to' must be <= 120, and 'to' must be greater than 'from'. Received from=${from}, to=${to}`
    );
  }

  // State for all keys: { [note]: isPressed }
  const [pressed, setPressed] = useState(() => {
    const obj = {};
    for (let note = from; note <= to; note++) {
      obj[note] = false;
    }
    return obj;
  });

  // Setter for each key
  const setKeyPressed = (note, state) => {
    setPressed(prev => ({ ...prev, [note]: state }));
  };

  // Expose setKeyPressed and reset to parent via ref
  useImperativeHandle(ref, () => ({
    setKeyPressed: (note, velocity) => {
      setKeyPressed(note, velocity > 0);
    },
    reset: () => {
      setPressed(() => {
        const obj = {};
        for (let note = from; note <= to; note++) {
          obj[note] = false;
        }
        return obj;
      });
    }
  }));

  const containerRef = React.useRef(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }
    updateWidth();
    // Use ResizeObserver for all container size changes
    let observer;
    if (window.ResizeObserver && containerRef.current) {
      observer = new ResizeObserver(() => updateWidth());
      observer.observe(containerRef.current);
    } else {
      window.addEventListener('resize', updateWidth);
    }
    return () => {
      if (observer && containerRef.current) observer.unobserve(containerRef.current);
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const widgetWidth = containerWidth || 800; // Fallback for SSR
  function isWhiteKey(note) {
    return [0, 2, 4, 5, 7, 9, 11].includes(note % 12);
  }

  const whiteNotes = [];
  const blackNotes = [];
  for (let note = from; note <= to; note++) {
    if (isWhiteKey(note)) {
      whiteNotes.push(note);
    } else {
      blackNotes.push(note);
    }
  }

  const whiteKeyCount = whiteNotes.length;
  const keyWidth = widgetWidth / whiteKeyCount;
  const widgetHeight = keyWidth * 6.5;

  const whiteKeys = whiteNotes.map((note) => (
    <Key
      key={note}
      note={note}
      isPressed={pressed[note]}
      setPressed={state => {
        setKeyPressed(note, state);
        if (state && typeof onKeyDown === 'function') onKeyDown(note);
        if (!state && typeof onKeyUp === 'function') onKeyUp(note);
      }}
      style={{ width: keyWidth, height: widgetHeight }}
      pressedColor={pressedColor}
    />
  ));

  const blackKeyOffsets = {
    1: -0.15, // cis
    3: 0.10,  // dis
    6: -0.15, // fis
    8: 0.0,   // gis
    10: 0.10  // ais
  };

  const blackKeys = blackNotes.map(note => {
    let leftWhiteIdx = -1;
    for (let i = 0; i < whiteNotes.length; i++) {
      if (whiteNotes[i] < note) leftWhiteIdx = i;
      if (whiteNotes[i] > note) break;
    }
    let rightWhiteIdx = leftWhiteIdx + 1;
    if (leftWhiteIdx === -1 || rightWhiteIdx >= whiteNotes.length) return null;
    const noteInOctave = note % 12;
    const offset = blackKeyOffsets[noteInOctave];
    let left = (leftWhiteIdx + 1) * keyWidth - (keyWidth * 0.25);
    left += keyWidth * offset;
    return (
      <Key
        key={note}
        note={note}
        isPressed={pressed[note]}
        setPressed={state => {
          setKeyPressed(note, state);
          if (state && typeof onKeyDown === 'function') onKeyDown(note);
          if (!state && typeof onKeyUp === 'function') onKeyUp(note);
        }}
        style={{
          width: keyWidth * 0.6,
          left: left,
          height: widgetHeight * 0.65
        }}
        pressedColor={pressedColor}
      />
    );
  });

  return (
    <div
      ref={containerRef}
      className="keyboard-widget"
      style={{
        position: 'relative',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        width: '100%',
        height: widgetHeight
      }}
    >
      <div style={{ display: 'flex', width: widgetWidth, height: '100%', position: 'relative', zIndex: 1 }}>
        {whiteKeys}
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, height: '65%', width: widgetWidth, zIndex: 2 }}>
        {blackKeys}
      </div>
    </div>
  );
});

export default Keyboard;
