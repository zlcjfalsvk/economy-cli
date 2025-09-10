import { locales, SupportedLanguage, Locale } from './locales.js';
import dotenv from 'dotenv';

// Load environment variables before initializing i18n
dotenv.config();

class I18n {
  private currentLanguage: SupportedLanguage;
  private locale: Locale;

  constructor() {
    // Get language from environment variable, default to 'en'
    const lang = (process.env.CLI_LANG?.toLowerCase() || 'en') as string;
    this.currentLanguage = this.validateLanguage(lang);
    this.locale = locales[this.currentLanguage];
  }

  private validateLanguage(lang: string): SupportedLanguage {
    if (lang === 'ko' || lang === 'kr') {
      return 'ko';
    }
    // Default to English for any other value
    return 'en';
  }

  get t(): Locale {
    return this.locale;
  }

  getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  setLanguage(lang: SupportedLanguage): void {
    this.currentLanguage = lang;
    this.locale = locales[lang];
  }

  // Format date based on current language
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const locale = this.currentLanguage === 'ko' ? 'ko-KR' : 'en-US';
    
    if (this.currentLanguage === 'ko') {
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } else {
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  }

  // Format number based on indicator type
  formatValue(value: number, indicatorId: string): string {
    if (isNaN(value)) return 'N/A';

    const locale = this.currentLanguage === 'ko' ? 'ko-KR' : 'en-US';

    switch (indicatorId) {
      case 'DFF':
        return `${value.toFixed(2)}%`;
      case 'GDPC1':
        if (this.currentLanguage === 'ko') {
          return `${value.toLocaleString(locale)} (십억 달러)`;
        } else {
          return `${value.toLocaleString(locale)} (B)`;
        }
      case 'PAYEMS':
        if (this.currentLanguage === 'ko') {
          return `${value.toLocaleString(locale)} (천명)`;
        } else {
          return `${value.toLocaleString(locale)} (K)`;
        }
      case 'CPIAUCSL':
      case 'PCEPILFE':
      case 'PPIACO':
        return value.toFixed(2);
      default:
        return value.toLocaleString(locale);
    }
  }
}

// Export singleton instance
export const i18n = new I18n();

// Re-export types
export type { SupportedLanguage, Locale };