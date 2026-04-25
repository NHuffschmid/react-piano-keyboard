export type SupportedLanguage = 'de' | 'en' | 'fr' | 'it' | 'es' | 'pt';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['de', 'en', 'fr', 'it', 'es', 'pt'];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

/** Primary and optional secondary (enharmonic) name of a chromatic pitch. */
export interface ChromaticNoteName {
  primary: string;
  secondary?: string;
}

/**
 * Note names per language, in chromatic order.
 * Index 0 = C, 1 = C#/D♭, 2 = D, ..., 11 = B/H
 */
export const NOTE_NAMES: Record<SupportedLanguage, ChromaticNoteName[]> = {
  de: [
    { primary: 'C' },
    { primary: 'Cis', secondary: 'Des' },
    { primary: 'D' },
    { primary: 'Dis', secondary: 'Es' },
    { primary: 'E' },
    { primary: 'F' },
    { primary: 'Fis', secondary: 'Ges' },
    { primary: 'G' },
    { primary: 'Gis', secondary: 'As' },
    { primary: 'A' },
    { primary: 'Ais', secondary: 'B' },
    { primary: 'H' },
  ],
  en: [
    { primary: 'C' },
    { primary: 'C#', secondary: 'D♭' },
    { primary: 'D' },
    { primary: 'D#', secondary: 'E♭' },
    { primary: 'E' },
    { primary: 'F' },
    { primary: 'F#', secondary: 'G♭' },
    { primary: 'G' },
    { primary: 'G#', secondary: 'A♭' },
    { primary: 'A' },
    { primary: 'A#', secondary: 'B♭' },
    { primary: 'B' },
  ],
  fr: [
    { primary: 'do' },
    { primary: 'do#', secondary: 'ré♭' },
    { primary: 'ré' },
    { primary: 'ré#', secondary: 'mi♭' },
    { primary: 'mi' },
    { primary: 'fa' },
    { primary: 'fa#', secondary: 'sol♭' },
    { primary: 'sol' },
    { primary: 'sol#', secondary: 'la♭' },
    { primary: 'la' },
    { primary: 'la#', secondary: 'si♭' },
    { primary: 'si' },
  ],
  it: [
    { primary: 'do' },
    { primary: 'do#', secondary: 're♭' },
    { primary: 're' },
    { primary: 're#', secondary: 'mi♭' },
    { primary: 'mi' },
    { primary: 'fa' },
    { primary: 'fa#', secondary: 'sol♭' },
    { primary: 'sol' },
    { primary: 'sol#', secondary: 'la♭' },
    { primary: 'la' },
    { primary: 'la#', secondary: 'si♭' },
    { primary: 'si' },
  ],
  es: [
    { primary: 'do' },
    { primary: 'do#', secondary: 're♭' },
    { primary: 're' },
    { primary: 're#', secondary: 'mi♭' },
    { primary: 'mi' },
    { primary: 'fa' },
    { primary: 'fa#', secondary: 'sol♭' },
    { primary: 'sol' },
    { primary: 'sol#', secondary: 'la♭' },
    { primary: 'la' },
    { primary: 'la#', secondary: 'si♭' },
    { primary: 'si' },
  ],
  pt: [
    { primary: 'dó' },
    { primary: 'dó#', secondary: 'ré♭' },
    { primary: 'ré' },
    { primary: 'ré#', secondary: 'mi♭' },
    { primary: 'mi' },
    { primary: 'fá' },
    { primary: 'fá#', secondary: 'sol♭' },
    { primary: 'sol' },
    { primary: 'sol#', secondary: 'lá♭' },
    { primary: 'lá' },
    { primary: 'lá#', secondary: 'si♭' },
    { primary: 'si' },
  ],
};

/**
 * Resolves the requested language string to a SupportedLanguage,
 * falling back to DEFAULT_LANGUAGE if unsupported or absent.
 */
export function resolveLanguage(lang?: string): SupportedLanguage {
  if (lang && SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
    return lang as SupportedLanguage;
  }
  return DEFAULT_LANGUAGE;
}

/**
 * Returns the labeled note name(s) with octave for a MIDI note number.
 * MIDI note 60 = C4 (middle C). Octave = floor(note / 12) - 1.
 */
export function getNoteLabel(note: number, lang: SupportedLanguage): ChromaticNoteName {
  const noteInOctave = note % 12;
  const octave = Math.floor(note / 12) - 1;
  const names = NOTE_NAMES[lang][noteInOctave];
  return {
    primary: `${names.primary}${octave}`,
    secondary: names.secondary ? `${names.secondary}${octave}` : undefined,
  };
}
