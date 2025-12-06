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

  // Progress animation from 0% to 100% over 10 seconds
  useEffect(() => {
    const startTime = Date.now();
    const duration = 10000; // 10 seconds

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
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
    const maxDuration = 200;
    const minDuration = 30;
    const keyCount = to - from + 1;

    const durations = Array.from({ length: keyCount }, (_, i) =>
      maxDuration - ((maxDuration - minDuration) * i) / (keyCount - 1)
    );

    let time = 0;
    for (let i = 0; i < keyCount; i++) {
      const note = from + i;
      setTimeout(() => {
        if (keyboardRef.current) {
          keyboardRef.current.setKeyPressed(note, 127);
        }
        setTimeout(() => {
          if (keyboardRef.current) {
            keyboardRef.current.setKeyPressed(note, 0);
          }
        }, durations[i]);
      }, time);
      time += durations[i];
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
