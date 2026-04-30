import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Keyboard, { getSkrjabinColor } from '../src/Keyboard';
import type { KeyboardRef } from '../src/Keyboard';

describe('Keyboard component', () => {
  it('renders without crashing', () => {
    render(<Keyboard from={21} to={108} />);
  });

  it('throws error for invalid range', () => {
    expect(() => render(<Keyboard from={10} to={108} />)).toThrow();
    expect(() => render(<Keyboard from={21} to={121} />)).toThrow();
    expect(() => render(<Keyboard from={50} to={20} />)).toThrow();
  });

  it('renders correct number of keys', () => {
    const from = 60, to = 72;
    const { container } = render(<Keyboard from={from} to={to} />);
    // 13 notes in range, 8 white keys
    expect(container.querySelectorAll('.ivory').length).toBe(8);
    expect(container.querySelectorAll('.ebony').length).toBe(5);
  });

  it('calls onKeyDown and onKeyUp when key is pressed/released', () => {
    const onKeyDown = vi.fn();
    const onKeyUp = vi.fn();
    const from = 60, to = 61;
    const { container } = render(
      <Keyboard from={from} to={to} onKeyDown={onKeyDown} onKeyUp={onKeyUp} />
    );
    const whiteKey = container.querySelector('.ivory')!;
    fireEvent.mouseDown(whiteKey);
    expect(onKeyDown).toHaveBeenCalledWith(60);
    fireEvent.mouseUp(whiteKey);
    expect(onKeyUp).toHaveBeenCalledWith(60);
  });

  it('supports ref methods setKeyPressed and reset', () => {
    const ref = React.createRef<KeyboardRef>();
    render(<Keyboard ref={ref} from={60} to={61} />);
    expect(ref.current).toBeDefined();
    ref.current!.setKeyPressed(60, 127);
    ref.current!.reset();
  });
});


describe('getSkrjabinColor', () => {
  it('returns correct Skrjabin color for each note in the octave', () => {
    // MIDI notes 60-71 correspond to C4-B4
    const expected: string[] = [
      '#ff0000', // C
      '#ce9aff', // C#
      '#ffff00', // D
      '#656599', // D#
      '#e3fbff', // E
      '#ac1c02', // F
      '#00ccff', // F#
      '#ff6501', // G
      '#ff00ff', // G#
      '#33cc33', // A
      '#8c8a8c', // A#
      '#0000fe'  // B/H
    ];
    for (let midi = 60; midi < 72; ++midi) {
      expect(getSkrjabinColor(midi)).toBe(expected[midi % 12]);
    }
  });
});


describe('Keyboard pressedColor="Skrjabin"', () => {
  it('uses Skrjabin color scale for pressed keys', () => {
    const { container } = render(<Keyboard from={60} to={72} pressedColor="sKrJaBiN" />);
    const whiteKey = container.querySelector('.ivory')!;
    fireEvent.mouseDown(whiteKey);
    const bg = window.getComputedStyle(whiteKey).backgroundColor;
    expect(bg.replace(/\s/g, '').toLowerCase()).toMatch(/rgb\(255,0,0\)|#ff0000/);
  });
});


describe('Keyboard language / key labels', () => {
  it('shows no labels when language prop is absent', () => {
    const { container } = render(<Keyboard from={60} to={62} />);
    const whiteKey = container.querySelector('.ivory')!;
    fireEvent.mouseDown(whiteKey);
    expect(container.querySelector('.key-label')).toBeNull();
  });

  it('shows label on pressed key when language="en"', () => {
    const { container } = render(<Keyboard from={60} to={62} language="en" />);
    const whiteKey = container.querySelector('.ivory')!;
    fireEvent.mouseDown(whiteKey);
    expect(container.querySelector('.key-label')).not.toBeNull();
  });

  it('shows correct English note label for C4 (MIDI 60)', () => {
    const { container } = render(<Keyboard from={60} to={62} language="en" />);
    const whiteKey = container.querySelector('.ivory')!;
    fireEvent.mouseDown(whiteKey);
    expect(container.querySelector('.key-label__primary')!.textContent).toBe('C4');
  });

  it('shows correct German note label for C4 (MIDI 60)', () => {
    const { container } = render(<Keyboard from={60} to={62} language="de" />);
    const whiteKey = container.querySelector('.ivory')!;
    fireEvent.mouseDown(whiteKey);
    expect(container.querySelector('.key-label__primary')!.textContent).toBe('C4');
  });

  it('falls back to English for unsupported language', () => {
    const { container } = render(<Keyboard from={60} to={62} language="xx" />);
    const whiteKey = container.querySelector('.ivory')!;
    fireEvent.mouseDown(whiteKey);
    expect(container.querySelector('.key-label')).not.toBeNull();
    expect(container.querySelector('.key-label__primary')!.textContent).toBe('C4');
  });

  it('shows correct English label for black key C#4 / D♭4 (MIDI 61)', () => {
    const { container } = render(<Keyboard from={60} to={62} language="en" />);
    const blackKey = container.querySelector('.ebony')!;
    fireEvent.mouseDown(blackKey);
    expect(container.querySelector('.key-label__primary')!.textContent).toBe('C#4');
    expect(container.querySelector('.key-label__secondary')!.textContent).toBe('/ D♭4');
  });

  it('shows correct German label for black key Cis4 / Des4 (MIDI 61)', () => {
    const { container } = render(<Keyboard from={60} to={62} language="de" />);
    const blackKey = container.querySelector('.ebony')!;
    fireEvent.mouseDown(blackKey);
    expect(container.querySelector('.key-label__primary')!.textContent).toBe('Cis4');
    expect(container.querySelector('.key-label__secondary')!.textContent).toBe('/ Des4');
  });

  it('hides label again after key is released', () => {
    const { container } = render(<Keyboard from={60} to={62} language="en" />);
    const whiteKey = container.querySelector('.ivory')!;
    fireEvent.mouseDown(whiteKey);
    expect(container.querySelector('.key-label')).not.toBeNull();
    fireEvent.mouseUp(whiteKey);
    expect(container.querySelector('.key-label')).toBeNull();
  });
});
