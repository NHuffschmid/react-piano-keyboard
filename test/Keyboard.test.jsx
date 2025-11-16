import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Keyboard, { GetSkrjabinColor } from '../src/Keyboard';

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
    const whiteKey = container.querySelector('.ivory');
    fireEvent.mouseDown(whiteKey);
    expect(onKeyDown).toHaveBeenCalledWith(60);
    fireEvent.mouseUp(whiteKey);
    expect(onKeyUp).toHaveBeenCalledWith(60);
  });

  it('supports ref methods setKeyPressed and reset', () => {
    const ref = React.createRef();
    render(<Keyboard ref={ref} from={60} to={61} />);
    expect(ref.current).toBeDefined();
    ref.current.setKeyPressed(60, 127);
    ref.current.reset();
  });
});


describe('GetSkrjabinColor', () => {
  it('returns correct Skrjabin color for each note in the octave', () => {
    // MIDI notes 60-71 correspond to C4-B4
    const expected = [
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
      expect(GetSkrjabinColor(midi)).toBe(expected[midi % 12]);
    }
  });
});


describe('Keyboard pressedColor="Skrjabin"', () => {
  it('uses Skrjabin color scale for pressed keys', () => {
    const { container } = render(<Keyboard from={60} to={72} pressedColor="sKrJaBiN" />);
    // Simulate pressing the C4 key (MIDI 60)
    const whiteKey = container.querySelector('.ivory');
    fireEvent.mouseDown(whiteKey);
    // Check the computed background color of the pressed key
    const bg = window.getComputedStyle(whiteKey).backgroundColor;
    expect(bg.replace(/\s/g, '').toLowerCase()).toMatch(/rgb\(255,0,0\)|#ff0000/);
  });
});
