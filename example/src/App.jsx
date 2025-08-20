import React, { useEffect, useRef } from 'react';
import Keyboard from './Keyboard';
import './Keyboard.css';

function App() {

    const keyboardRef = useRef();

    // Pressed and released keys will be logged to the console
    const handleKeyDown = (note) => {
        console.log(`Key down: ${note}`);
    };
    const handleKeyUp = (note) => {
        console.log(`Key up: ${note}`);
    };

    // On mount: press all keys from 21 to 108, only one at a time
    useEffect(() => {
        const from = 21;
        const to = 108;
        const maxDuration = 200; // ms for the lowest key
        const minDuration = 30;  // ms for the highest key
        const keyCount = to - from + 1;
        const durations = Array.from({ length: keyCount }, (_, i) =>
            maxDuration - ((maxDuration - minDuration) * i) / (keyCount - 1)
        );
        let time = 0;
        for (let i = 0; i < keyCount; i++) {
            const note = from + i;
            setTimeout(() => {
                if (keyboardRef.current) {
                    keyboardRef.current.setKeyPressed(note, true);
                }
                setTimeout(() => {
                    if (keyboardRef.current) keyboardRef.current.setKeyPressed(note, false);
                }, durations[i]);
            }, time);
            time += durations[i];
        }
    }, []);

    return (
        <div style={{ padding: 32 }}>
            <h1>react-piano-keyboard Demo</h1>
            <Keyboard
                ref={keyboardRef}
                from={21}
                to={108}
                pressedColor="gray"
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
            />
        </div>
    );
}

export default App;
