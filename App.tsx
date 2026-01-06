
import React, { useState, useCallback } from 'react';
import LanguageSelector from './components/LanguageSelector';
import TranslationModeToggle from './components/TranslationModeToggle';
import { TranslationMode, TranslationResponse } from './types';
import { translateText } from './services/geminiService';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [mode, setMode] = useState<TranslationMode>(TranslationMode.FORMAL);
  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const translation = await translateText(inputText, targetLanguage, mode);
      setResult(translation);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 py-6 px-4 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Linguist Pro</h1>
              <p className="text-sm text-slate-500">Universal Expert Translator</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <LanguageSelector value={targetLanguage} onChange={setTargetLanguage} />
            <TranslationModeToggle mode={mode} onChange={setMode} />
          </div>
        </div>
      </header>

      <main className="w-full max-w-6xl px-4 flex-grow flex flex-col gap-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Source Text (Auto-detect)</span>
              <button 
                onClick={handleClear}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type text to translate..."
              className="w-full h-80 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none text-lg text-slate-800 leading-relaxed"
            />
            <button
              onClick={handleTranslate}
              disabled={isLoading || !inputText.trim()}
              className={`w-full py-4 rounded-xl text-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                isLoading || !inputText.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:transform active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Translating...</span>
                </>
              ) : (
                <>
                  <span>Translate to {targetLanguage}</span>
                </>
              )}
            </button>
          </div>

          {/* Result Section */}
          <div className="flex flex-col gap-4">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Translated Text ({mode === TranslationMode.FORMAL ? 'Formal' : 'Informal'})</span>
            <div className={`w-full h-80 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-y-auto ${isLoading ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
              {error ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3 text-red-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-900 font-semibold mb-1">Translation Failed</p>
                  <p className="text-slate-500 text-sm">{error}</p>
                </div>
              ) : result ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p className="text-lg text-slate-800 leading-relaxed whitespace-pre-wrap">{result.translatedText}</p>
                  {result.notes && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Cultural Notes</h4>
                      <p className="text-sm text-slate-600 italic leading-relaxed">{result.notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300">
                  <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <p className="text-sm">Translation results will appear here</p>
                </div>
              )}
            </div>

            {/* Grounding / Sources */}
            {result?.groundingLinks && result.groundingLinks.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Search Grounding References</span>
                </div>
                <ul className="space-y-2">
                  {result.groundingLinks.map((link, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <a 
                        href={link.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline decoration-blue-200 hover:decoration-blue-600 transition-all line-clamp-1"
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="w-full py-6 bg-slate-100 border-t border-slate-200 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Linguist Pro. Powered by Gemini 3 Flash.</p>
      </footer>
    </div>
  );
};

export default App;
