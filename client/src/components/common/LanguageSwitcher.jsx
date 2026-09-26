import { useLanguage } from '../../context/LanguageContext';
import { Globe, Languages } from 'lucide-react';

export default function LanguageSwitcher({ className = '', variant = 'pill' }) {
  const { language, setLanguage, toggleLanguage, isHindi } = useLanguage();

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleLanguage}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all ${className}`}
        title={isHindi ? 'Switch to English' : 'हिंदी में बदलें'}
        aria-label="Switch Language"
      >
        <Globe size={13} className="text-gov-saffron shrink-0" />
        <span className="font-semibold tracking-wide">{isHindi ? 'English' : 'हिन्दी'}</span>
      </button>
    );
  }

  if (variant === 'landing') {
    return (
      <div className={`inline-flex items-center p-0.5 rounded-full bg-slate-900/60 border border-slate-700/60 backdrop-blur-md shadow-inner text-xs ${className}`}>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold transition-all duration-200 ${
            !isHindi
              ? 'bg-gov-saffron text-white shadow-xs'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <span className="text-[11px]">EN</span>
          <span className="text-[10px] opacity-80">English</span>
        </button>
        <button
          type="button"
          onClick={() => setLanguage('hi')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold transition-all duration-200 ${
            isHindi
              ? 'bg-gov-saffron text-white shadow-xs'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <span className="text-[11px]">HI</span>
          <span className="text-[11px] font-devanagari">हिन्दी</span>
        </button>
      </div>
    );
  }

  // Default 'pill'
  return (
    <div className={`inline-flex items-center bg-gov-off-white/80 border border-gov-gray-200 rounded-full p-0.5 shadow-xs ${className}`}>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
          !isHindi
            ? 'bg-gov-navy text-white shadow-xs'
            : 'text-gov-gray-600 hover:text-gov-navy'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
          isHindi
            ? 'bg-gov-navy text-white shadow-xs'
            : 'text-gov-gray-600 hover:text-gov-navy'
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
}
