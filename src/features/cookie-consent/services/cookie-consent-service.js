import { CONSENT_STORAGE_KEY, CONSENT_VERSION, COOKIE_CATEGORIES } from '../config/cookie-config';

/**
 * Event name dispatched when cookie preferences are saved or updated
 */
export const COOKIE_CONSENT_EVENT = 'klanservicehub:cookie_consent_updated';

/**
 * Default initial unconsented state
 */
export const DEFAULT_CONSENT_STATE = {
  [COOKIE_CATEGORIES.NECESSARY]: true,
  [COOKIE_CATEGORIES.ANALYTICS]: false,
  [COOKIE_CATEGORIES.FUNCTIONAL]: false,
  [COOKIE_CATEGORIES.MARKETING]: false,
  timestamp: null,
  version: CONSENT_VERSION,
};

/**
 * Read stored cookie consent from localStorage
 * Returns parsed object or null if not set or version mismatch
 */
export const getStoredConsent = () => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    // Version check: if stored version is outdated, invalidate to re-prompt
    if (!parsed || parsed.version !== CONSENT_VERSION) {
      return null;
    }

    return {
      [COOKIE_CATEGORIES.NECESSARY]: true, // Always true
      [COOKIE_CATEGORIES.ANALYTICS]: Boolean(parsed[COOKIE_CATEGORIES.ANALYTICS]),
      [COOKIE_CATEGORIES.FUNCTIONAL]: Boolean(parsed[COOKIE_CATEGORIES.FUNCTIONAL]),
      [COOKIE_CATEGORIES.MARKETING]: Boolean(parsed[COOKIE_CATEGORIES.MARKETING]),
      timestamp: parsed.timestamp || new Date().toISOString(),
      version: parsed.version || CONSENT_VERSION,
    };
  } catch (error) {
    console.warn('[CookieConsentService] Failed to read stored consent:', error);
    return null;
  }
};

/**
 * Persist consent state to localStorage and broadcast change event
 */
export const saveConsent = (preferences) => {
  if (typeof window === 'undefined') return DEFAULT_CONSENT_STATE;

  const sanitized = {
    [COOKIE_CATEGORIES.NECESSARY]: true, // Always mandatory
    [COOKIE_CATEGORIES.ANALYTICS]: Boolean(preferences[COOKIE_CATEGORIES.ANALYTICS]),
    [COOKIE_CATEGORIES.FUNCTIONAL]: Boolean(preferences[COOKIE_CATEGORIES.FUNCTIONAL]),
    [COOKIE_CATEGORIES.MARKETING]: Boolean(preferences[COOKIE_CATEGORIES.MARKETING]),
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (error) {
    console.warn('[CookieConsentService] Failed to save consent in localStorage:', error);
  }

  // Dispatch custom window event
  try {
    window.dispatchEvent(
      new CustomEvent(COOKIE_CONSENT_EVENT, {
        detail: sanitized,
      })
    );
  } catch (eventError) {
    // Silently ignore if CustomEvent is unsupported
  }

  return sanitized;
};

/**
 * Grant full consent (Accept All)
 */
export const acceptAllConsent = () => {
  return saveConsent({
    [COOKIE_CATEGORIES.NECESSARY]: true,
    [COOKIE_CATEGORIES.ANALYTICS]: true,
    [COOKIE_CATEGORIES.FUNCTIONAL]: true,
    [COOKIE_CATEGORIES.MARKETING]: true,
  });
};

/**
 * Reject optional cookies (Allow Only Necessary)
 */
export const rejectOptionalConsent = () => {
  return saveConsent({
    [COOKIE_CATEGORIES.NECESSARY]: true,
    [COOKIE_CATEGORIES.ANALYTICS]: false,
    [COOKIE_CATEGORIES.FUNCTIONAL]: false,
    [COOKIE_CATEGORIES.MARKETING]: false,
  });
};

/**
 * Clear stored consent (for testing or user revocation)
 */
export const clearStoredConsent = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent(COOKIE_CONSENT_EVENT, {
        detail: null,
      })
    );
  } catch (error) {
    console.warn('[CookieConsentService] Failed to clear consent:', error);
  }
};

/**
 * Check if the user has given consent for a specific category
 */
export const hasConsent = (category) => {
  if (category === COOKIE_CATEGORIES.NECESSARY) return true;

  const current = getStoredConsent();
  if (!current) return false;

  return Boolean(current[category]);
};

/**
 * Privacy Guard: Execute callback ONLY if consent is granted, or register listener for future consent
 */
export const withConsent = (category, callback) => {
  if (typeof window === 'undefined' || typeof callback !== 'function') return;

  if (hasConsent(category)) {
    try {
      callback();
    } catch (err) {
      console.error(`[CookieConsentService] Error in withConsent(${category}):`, err);
    }
    return;
  }

  // Otherwise listen for future consent updates
  const handler = (e) => {
    const updated = e.detail;
    if (updated && updated[category]) {
      window.removeEventListener(COOKIE_CONSENT_EVENT, handler);
      try {
        callback();
      } catch (err) {
        console.error(`[CookieConsentService] Error executing deferred withConsent(${category}):`, err);
      }
    }
  };

  window.addEventListener(COOKIE_CONSENT_EVENT, handler);
};
