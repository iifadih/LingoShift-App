
export enum TranslationMode {
  FORMAL = 'Formal (Fusha/Standard)',
  INFORMAL = 'Informal (Slang/Colloquial)'
}

export interface GroundingLink {
  uri: string;
  title: string;
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
  groundingLinks?: GroundingLink[];
  notes?: string;
}

export interface TranslationSettings {
  targetLanguage: string;
  mode: TranslationMode;
  dialect?: string;
}
