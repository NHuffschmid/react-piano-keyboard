import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Keyboard from './Keyboard';

describe('Keyboard component', () => {
  it('renders without crashing', () => {
    render(<Keyboard from={21} to={108} />);
  });

  it('throws error for invalid range', () => {
    expect(() => render(<Keyboard from={10} to={108} />)).toThrow();
    expect(() => render(<Keyboard from={21} to={121} />)).toThrow();
    expect(() => render(<Keyboard from={50} to={20} />)).toThrow();
  });
});
