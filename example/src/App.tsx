import { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardProgressBar, type KeyboardRef } from '../../src';
import '../../src/Keyboard.css';

function App() {
  const keyboardRef = useRef<KeyboardRef | null>(null);
  const [progress, setProgress] = useState(0);

  const handleKeyDown = (note: number) => {
    console.log(`Key down: ${note}`);
  };

  const handleKeyUp = (note: number) => {
    console.log(`Key up: ${note}`);
  };

  // Progress animation with easing: starts slow, accelerates strongly
  useEffect(() => {
    const startTime = Date.now();
    const duration = 10000; // 10 seconds

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1); // normalized time (0-1)
      
      // Mixed easing: starts linear, then accelerates
      const easedT = 0.3 * t + 0.7 * (t * t); // 30% linear + 70% quadratic
      const newProgress = easedT * 100;
      
      setProgress(newProgress);
      
      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      }
    };
    
    updateProgress();
  }, []);

  useEffect(() => {
    const from = 21;
    const to = 108;
    const totalDuration = 10000; // 10 seconds - same as progress animation
    const keyCount = to - from + 1;

    // Schedule each key press based on the eased timing curve
    for (let i = 0; i < keyCount; i++) {
      const note = from + i;
      const keyProgress = i / (keyCount - 1); // 0 to 1
      
      // Apply reverse mixed easing: more even distribution at start
      const linearPart = 0.3 * keyProgress;
      const quadPart = 0.7 * Math.sqrt(keyProgress);
      const easedProgress = linearPart + quadPart;
      const keyTime = easedProgress * totalDuration;
      
      setTimeout(() => {
        if (keyboardRef.current) {
          keyboardRef.current.setKeyPressed(note, 127);
          
          // Hold key for a short duration
          setTimeout(() => {
            if (keyboardRef.current) {
              keyboardRef.current.setKeyPressed(note, 0);
            }
          }, 150);
        }
      }, keyTime);
    }
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h1>react-piano-keyboard Demo</h1>
      
      <div style={{ marginBottom: 32 }}>
        <h2>Interactive Keyboard</h2>
        <Keyboard
          ref={keyboardRef}
          from={21}
          to={108}
          pressedColor="gray"
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        />
      </div>

      <div>
        <h2>Progress Bar Demo</h2>
        <div style={{ transform: 'scale(0.5)', transformOrigin: 'left top' }}>
          <KeyboardProgressBar
            value={progress}
            from={36}
            to={96}
            progressColor="forestgreen"
            showPercentage={true}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
