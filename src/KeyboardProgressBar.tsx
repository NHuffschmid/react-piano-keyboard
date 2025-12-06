import React, { useMemo } from 'react';
import Keyboard, { KeyboardRef } from './Keyboard';

interface KeyboardProgressBarProps {
  value: number;        // Aktueller Fortschritt (0-100)
  max?: number;         // Maximum-Wert (default: 100)
  from?: number;        // Start-Note (default: 36)
  to?: number;          // End-Note (default: 96)
  progressColor?: string; // Farbe für gedrückte Tasten (default: '#4CAF50')
  showPercentage?: boolean; // Zeige Prozentanzeige (default: false)
  className?: string;   // CSS-Klasse
  style?: React.CSSProperties; // Inline-Styles
}

const KeyboardProgressBar: React.FC<KeyboardProgressBarProps> = ({
  value,
  max = 100,
  from = 36,
  to = 96,
  progressColor = '#4CAF50',
  showPercentage = false,
  className,
  style
}) => {
  // Berechne welche Tasten als gedrückt dargestellt werden sollen
  const pressedNotes = useMemo(() => {
    const notes: Set<number> = new Set();
    
    // Sammle ALLE Tasten im Bereich (weiße und schwarze)
    const allNotes: number[] = [];
    
    for (let note = from; note <= to; note++) {
      allNotes.push(note);
    }
    
    // Berechne Fortschritt als Prozentsatz
    const progress = Math.max(0, Math.min(100, (value / max) * 100));
    
    // Bestimme Anzahl der zu aktivierenden Tasten
    const totalKeys = allNotes.length;
    const keysToActivate = Math.round((progress / 100) * totalKeys);
    
    // Aktiviere die ersten N Tasten (chromatisch)
    for (let i = 0; i < keysToActivate && i < allNotes.length; i++) {
      notes.add(allNotes[i]);
    }
    
    return notes;
  }, [value, max, from, to]);

  // Custom setKeyPressed Funktion, die den Progress-Zustand überschreibt
  const keyboardRef = React.useRef<KeyboardRef>(null);
  
  React.useEffect(() => {
    if (keyboardRef.current) {
      // Erst alle Tasten zurücksetzen
      keyboardRef.current.reset();
      
      // Dann die entsprechenden Tasten "drücken"
      pressedNotes.forEach(note => {
        keyboardRef.current?.setKeyPressed(note, 127); // Max velocity
      });
    }
  }, [pressedNotes]);

  return (
    <div 
      className={className}
      style={{
        ...style,
        position: 'relative'
      }}
    >
      <Keyboard
        ref={keyboardRef}
        from={from}
        to={to}
        pressedColor={progressColor}
        // Keine Event-Handler - ProgressBar ist read-only
        onKeyDown={undefined}
        onKeyUp={undefined}
      />
      
      {/* Conditional: Progress-Text Overlay */}
      {showPercentage && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          {Math.round((value / max) * 100)}%
        </div>
      )}
    </div>
  );
};

export default KeyboardProgressBar;