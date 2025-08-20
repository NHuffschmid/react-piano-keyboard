import React from 'react';
import './Keyboard.css';

// Helper to determine if a key is white
function isWhiteKey(note) {
    let n = note % 12; // Get the note within the octave
    if ((n === 1) || (n === 3) || (n === 6) || (n === 8) || (n === 10)) {
        return false; // Black key
    }
    else {
        return true; // White key
    }
}

const Key = ({ note, isPressed, setPressed, style, pressedColor = '#888' }) => {
    const isWhite = isWhiteKey(note);
    // Track if the key is currently pressed by mouse
    const mousePressed = React.useRef(false);

    // Use pressedColor if pressed, else white or black
    const bgStyle = {
        background: isPressed ? pressedColor : (isWhite ? 'white' : 'black'),
    };

    // Only send KeyUp if the key was pressed
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
        />
    );
};

export default Key;
