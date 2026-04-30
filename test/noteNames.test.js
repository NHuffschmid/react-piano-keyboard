import { describe, it, expect } from 'vitest';
import { resolveLanguage, getNoteLabel, SUPPORTED_LANGUAGES } from '../src/noteNames';

describe('resolveLanguage', () => {
  it('returns supported language as-is', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(resolveLanguage(lang)).toBe(lang);
    }
  });

  it('falls back to "en" for an unsupported language', () => {
    expect(resolveLanguage('xx')).toBe('en');
    expect(resolveLanguage('jp')).toBe('en');
  });

  it('falls back to "en" when called without argument', () => {
    expect(resolveLanguage(undefined)).toBe('en');
  });
});

describe('getNoteLabel', () => {
  it('returns correct primary name with octave for C4 (MIDI 60) in English', () => {
    const label = getNoteLabel(60, 'en');
    expect(label.primary).toBe('C4');
    expect(label.secondary).toBeUndefined();
  });

  it('returns correct label with secondary for C#4/D♭4 (MIDI 61) in English', () => {
    const label = getNoteLabel(61, 'en');
    expect(label.primary).toBe('C#4');
    expect(label.secondary).toBe('D♭4');
  });

  it('returns correct German label for H4 (MIDI 71)', () => {
    const label = getNoteLabel(71, 'de');
    expect(label.primary).toBe('H4');
    expect(label.secondary).toBeUndefined();
  });

  it('returns correct German label for Cis4/Des4 (MIDI 61)', () => {
    const label = getNoteLabel(61, 'de');
    expect(label.primary).toBe('Cis4');
    expect(label.secondary).toBe('Des4');
  });

  it('computes octave correctly: MIDI 48 = C3', () => {
    expect(getNoteLabel(48, 'en').primary).toBe('C3');
  });

  it('computes octave correctly: MIDI 72 = C5', () => {
    expect(getNoteLabel(72, 'en').primary).toBe('C5');
  });

  it('works for all supported languages on MIDI 60 (root note)', () => {
    const rootNames = {
      en: 'C4',
      de: 'C4',
      fr: 'do4',
      it: 'do4',
      es: 'do4',
      pt: 'dó4',
    };
    for (const [lang, expected] of Object.entries(rootNames)) {
      expect(getNoteLabel(60, lang).primary).toBe(expected);
    }
  });
});
