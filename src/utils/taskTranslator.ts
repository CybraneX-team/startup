import { LanguageCode } from '@/context/LanguageContext';

// Language code mapping for translation APIs
const languageCodeMap: Record<LanguageCode, string> = {
  en: 'en',
  hi: 'hi',
  bn: 'bn',
  te: 'te',
  mr: 'mr',
  ta: 'ta',
  ur: 'ur',
  gu: 'gu',
  kn: 'kn',
  or: 'or',
  ml: 'ml',
  pa: 'pa',
  as: 'as',
  sa: 'sa',
  kok: 'kok',
  mni: 'mni',
  ne: 'ne',
  brx: 'brx',
  doi: 'doi',
  mai: 'mai',
  sat: 'sat',
  ks: 'ks',
  sd: 'sd'
};

// Cache for translations to avoid repeated API calls
const translationCache = new Map<string, string>();

/**
 * Translates task name using MyMemory Translation API (free, no API key required)
 * Falls back to keyword-based translation if API fails
 */
async function translateWithAPI(text: string, targetLang: LanguageCode): Promise<string> {
  // Check cache first
  const cacheKey = `${text}_${targetLang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  // If English, return as is
  if (targetLang === 'en') {
    translationCache.set(cacheKey, text);
    return text;
  }

  try {
    const targetCode = languageCodeMap[targetLang] || 'en';
    
    // Use MyMemory Translation API (free, no key required)
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetCode}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Translation API failed');
    }

    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translated = data.responseData.translatedText;
      // Cache the translation
      translationCache.set(cacheKey, translated);
      return translated;
    }
    
    throw new Error('Invalid translation response');
  } catch (error) {
    console.warn('Translation API failed, using fallback:', error);
    // Fallback to original text if API fails
    return text;
  }
}

/**
 * Alternative: Use backend translation endpoint (if available)
 * This would use your existing Groq API to translate tasks
 */
async function translateWithBackend(text: string, targetLang: LanguageCode): Promise<string> {
  // Check cache first
  const cacheKey = `${text}_${targetLang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  if (targetLang === 'en') {
    translationCache.set(cacheKey, text);
    return text;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/translate-task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('userToken') || '',
      },
      body: JSON.stringify({
        text,
        targetLanguage: targetLang,
      }),
    });

    if (!response.ok) {
      throw new Error('Backend translation failed');
    }

    const data = await response.json();
    if (data.translatedText) {
      translationCache.set(cacheKey, data.translatedText);
      return data.translatedText;
    }

    throw new Error('Invalid backend translation response');
  } catch (error) {
    console.warn('Backend translation failed, using fallback:', error);
    return text;
  }
}

/**
 * Main translation function
 * Tries backend first (if available), then falls back to MyMemory API
 * Uses caching to avoid repeated translations
 */
export async function translateTaskName(
  taskName: string,
  language: LanguageCode
): Promise<string> {
  // If English, return immediately
  if (language === 'en') {
    return taskName;
  }

  // Try backend translation first (uses Groq AI - better quality)
  try {
    const backendTranslated = await translateWithBackend(taskName, language);
    if (backendTranslated !== taskName) {
      return backendTranslated;
    }
  } catch (error) {
    // Backend not available or failed, try free API
    console.log('Backend translation not available, using free API');
  }

  // Fallback to free MyMemory API
  try {
    return await translateWithAPI(taskName, language);
  } catch (error) {
    // If all fails, return original
    console.warn('All translation methods failed:', error);
    return taskName;
  }
}

/**
 * Synchronous version that returns cached translations immediately
 * Falls back to original if not cached (for initial render)
 */
export function translateTaskNameSync(
  taskName: string,
  language: LanguageCode
): string {
  if (language === 'en') {
    return taskName;
  }

  const cacheKey = `${taskName}_${language}`;
  return translationCache.get(cacheKey) || taskName;
}

/**
 * Pre-translate a batch of task names (useful for loading tasks)
 */
export async function translateTaskNames(
  taskNames: string[],
  language: LanguageCode
): Promise<string[]> {
  if (language === 'en') {
    return taskNames;
  }

  // Translate all tasks in parallel
  const translations = await Promise.all(
    taskNames.map(name => translateTaskName(name, language))
  );

  return translations;
}
