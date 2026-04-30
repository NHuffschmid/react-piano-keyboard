import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Key from '../src/Key';
import type { ChromaticNoteName } from '../src/noteNames';

describe('Key component', () => {
  it('renders a white key', () => {
    const { container } = render(
      <Key note={60} isPressed={false} setPressed={() => {}} />
    );
    expect(container.firstChild).toHaveClass('ivory');
  });

  it('renders a black key', () => {
    const { container } = render(
      <Key note={61} isPressed={false} setPressed={() => {}} />
    );
    expect(container.firstChild).toHaveClass('ebony');
  });

  it('applies pressed color when pressed', () => {
    const { container } = render(
      <Key note={60} isPressed={true} setPressed={() => {}} pressedColor="red" />
    );
    expect(container.firstChild).toHaveStyle('background: red');
  });

  it('calls setPressed on mouse events', () => {
    const setPressed = vi.fn();
    const { container } = render(
      <Key note={60} isPressed={false} setPressed={setPressed} />
    );
    fireEvent.mouseDown(container.firstChild!);
    expect(setPressed).toHaveBeenCalledWith(true);
    fireEvent.mouseUp(container.firstChild!);
    expect(setPressed).toHaveBeenCalledWith(false);
    fireEvent.mouseLeave(container.firstChild!);
    expect(setPressed).toHaveBeenCalledWith(false);
  });
});

describe('Key label', () => {
  it('shows no label when key is not pressed, even if label prop is set', () => {
    const label: ChromaticNoteName = { primary: 'C4' };
    const { container } = render(
      <Key note={60} isPressed={false} setPressed={() => {}} label={label} />
    );
    expect(container.querySelector('.key-label')).toBeNull();
  });

  it('shows label when key is pressed and label prop is set', () => {
    const label: ChromaticNoteName = { primary: 'C4' };
    const { container } = render(
      <Key note={60} isPressed={true} setPressed={() => {}} label={label} />
    );
    expect(container.querySelector('.key-label')).not.toBeNull();
    expect(container.querySelector('.key-label__primary')!.textContent).toBe('C4');
  });

  it('shows no label when label prop is not set, even when pressed', () => {
    const { container } = render(
      <Key note={60} isPressed={true} setPressed={() => {}} />
    );
    expect(container.querySelector('.key-label')).toBeNull();
  });

  it('shows primary and secondary in separate elements when secondary is present', () => {
    const label: ChromaticNoteName = { primary: 'C#4', secondary: 'D♭4' };
    const { container } = render(
      <Key note={61} isPressed={true} setPressed={() => {}} label={label} />
    );
    expect(container.querySelector('.key-label__primary')!.textContent).toBe('C#4');
    expect(container.querySelector('.key-label__secondary')!.textContent).toBe('/ D♭4');
  });

  it('shows only primary when secondary is absent', () => {
    const label: ChromaticNoteName = { primary: 'C4' };
    const { container } = render(
      <Key note={60} isPressed={true} setPressed={() => {}} label={label} />
    );
    expect(container.querySelector('.key-label__primary')!.textContent).toBe('C4');
  });

  it('applies key-label--white class for a white key', () => {
    const label: ChromaticNoteName = { primary: 'C4' };
    const { container } = render(
      <Key note={60} isPressed={true} setPressed={() => {}} label={label} />
    );
    expect(container.querySelector('.key-label--white')).not.toBeNull();
  });

  it('applies key-label--black class for a black key', () => {
    const label: ChromaticNoteName = { primary: 'C#4', secondary: 'D♭4' };
    const { container } = render(
      <Key note={61} isPressed={true} setPressed={() => {}} label={label} />
    );
    expect(container.querySelector('.key-label--black')).not.toBeNull();
  });
});
