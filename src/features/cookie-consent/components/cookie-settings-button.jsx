import React from 'react';
import { Cookie, Settings, ShieldCheck } from 'lucide-react';
import { useCookieConsent } from '../context/cookie-consent-context';

/**
 * Standard inline button/link for footers and legal pages
 */
export const CookieSettingsButton = ({
  className = '',
  children,
  variant = 'link',
}) => {
  const { openPreferencesModal } = useCookieConsent();

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={openPreferencesModal}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold shadow-2xs transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${className}`}
      >
        <Cookie className="size-3.5 text-neutral-500" />
        <span>{children || 'Cookie Preferences'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openPreferencesModal}
      className={`hover:text-blue-600 transition cursor-pointer text-left font-medium inline-flex items-center gap-1 ${className}`}
    >
      {children || 'Cookie Preferences'}
    </button>
  );
};

/**
 * Discreet floating trigger button displayed once consent is stored
 */
export const FloatingCookieButton = ({ className = '' }) => {
  const { isBannerVisible, openPreferencesModal } = useCookieConsent();

  // Only show when the bottom banner is NOT actively displayed
  if (isBannerVisible) return null;

  return (
    <button
      type="button"
      onClick={openPreferencesModal}
      aria-label="Open Cookie Privacy Preferences"
      title="Cookie Privacy Preferences"
      className={`fixed bottom-4 left-4 z-40 size-9 rounded-full bg-white/90 hover:bg-white border border-neutral-200 shadow-md hover:shadow-lg text-neutral-600 hover:text-blue-600 flex items-center justify-center backdrop-blur-sm transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 hover:scale-105 active:scale-95 ${className}`}
    >
      <Cookie className="size-4" />
    </button>
  );
};
