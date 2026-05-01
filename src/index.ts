export { default as Keyboard } from './Keyboard';
export { getSkrjabinColor, skrjabinColors } from './Keyboard';
export { default as KeyboardProgressBar } from './KeyboardProgressBar';
export { default as Key } from './Key';
export type { KeyboardRef } from './Keyboard';
export type { SupportedLanguage, ChromaticNoteName } from './noteNames';
export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, NOTE_NAMES, resolveLanguage, getNoteLabel } from './noteNames';

/** CSS class name for the realistic ivory (white-key) visual theme. */
export const IVORY_REALISTIC_CLASS = 'ivory--realistic';
/** CSS class name for the realistic ebony (black-key) visual theme. */
export const EBONY_REALISTIC_CLASS = 'ebony--realistic';