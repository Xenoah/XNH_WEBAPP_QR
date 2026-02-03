import React, { useState, useEffect } from 'react';
import { QRReader } from './components/QRReader';
import { QRGenerator } from './components/QRGenerator';
import { Language, Tab, Theme } from './types';
import { TRANSLATIONS } from './constants';
import { Moon, Sun, Languages, QrCode, ScanLine, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.READ);
  const [lang, setLang] = useState<Language>(Language.EN);
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  
  // Shared State for Validation
  const [verificationImage, setVerificationImage] = useState<string | null>(null);
  
  // Reset Key to force component remount
  const [resetKey, setResetKey] = useState(0);

  // Theme effect
  useEffect(() => {
    if (theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  const toggleLang = () => {
    setLang(prev => prev === Language.EN ? Language.JP : Language.EN);
  };

  const handleVerifyRequest = (image: string) => {
    setVerificationImage(image);
    setActiveTab(Tab.READ);
    setTimeout(() => alert(TRANSLATIONS[lang]['verificationSuccess']), 100);
  };

  const handleReset = () => {
    if (confirm(lang === Language.EN ? 'Reset all data?' : 'すべてのデータをリセットしますか？')) {
        setResetKey(prev => prev + 1);
        setVerificationImage(null);
        setActiveTab(Tab.READ);
    }
  };

  const t = (key: keyof typeof TRANSLATIONS['en']) => TRANSLATIONS[lang][key];

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <QrCode size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {t('appTitle')}
            </h1>
          </div>

          <div className="flex items-center gap-3">
             <button 
              onClick={handleReset}
              className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
              aria-label="Reset"
              title={t('reset')}
            >
              <RotateCcw size={20} />
            </button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
             <button 
              onClick={toggleLang}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="Toggle Language"
            >
              <div className="flex items-center gap-1 text-sm font-medium">
                <Languages size={18} />
                <span>{lang === Language.EN ? 'EN' : 'JP'}</span>
              </div>
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === Theme.LIGHT ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
          <button
            onClick={() => setActiveTab(Tab.READ)}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors ${
              activeTab === Tab.READ 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <ScanLine size={18} />
            {t('tabRead')}
          </button>
          <button
            onClick={() => setActiveTab(Tab.GENERATE)}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors ${
              activeTab === Tab.GENERATE 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <QrCode size={18} />
            {t('tabGen')}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className={activeTab === Tab.READ ? 'block' : 'hidden'}>
          <QRReader key={`reader-${resetKey}`} lang={lang} initialImage={verificationImage} />
        </div>
        
        <div className={activeTab === Tab.GENERATE ? 'block' : 'hidden'}>
          <QRGenerator key={`gen-${resetKey}`} lang={lang} onVerify={handleVerifyRequest} />
        </div>
      </main>

    </div>
  );
};

export default App;
