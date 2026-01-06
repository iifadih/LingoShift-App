
import React from 'react';
import { TranslationMode } from '../types';

interface TranslationModeToggleProps {
  mode: TranslationMode;
  onChange: (mode: TranslationMode) => void;
}

const TranslationModeToggle: React.FC<TranslationModeToggleProps> = ({ mode, onChange }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-semibold text-slate-700">Tone & Context</label>
      <div className="flex p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => onChange(TranslationMode.FORMAL)}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            mode === TranslationMode.FORMAL
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Formal
        </button>
        <button
          onClick={() => onChange(TranslationMode.INFORMAL)}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            mode === TranslationMode.INFORMAL
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Informal
        </button>
      </div>
    </div>
  );
};

export default TranslationModeToggle;
