import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, Check, Lock } from 'lucide-react';
import { useCookieConsent } from '../context/cookie-consent-context';
import { COOKIE_DEFINITIONS, COOKIE_CATEGORIES } from '../config/cookie-config';
import { CookieCategoryItem } from './cookie-category-item';

export const CookiePreferencesModal = () => {
  const {
    consent,
    isPreferencesModalOpen,
    closePreferencesModal,
    saveCustomPreferences,
    allowNecessaryOnly,
    acceptAll,
  } = useCookieConsent();

  // Local draft state for toggles before saving
  const [draft, setDraft] = useState({
    [COOKIE_CATEGORIES.NECESSARY]: true,
    [COOKIE_CATEGORIES.ANALYTICS]: false,
    [COOKIE_CATEGORIES.FUNCTIONAL]: false,
    [COOKIE_CATEGORIES.MARKETING]: false,
  });

  const modalRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  // Sync draft state whenever modal opens
  useEffect(() => {
    if (isPreferencesModalOpen) {
      previouslyFocusedElementRef.current = document.activeElement;
      setDraft({
        [COOKIE_CATEGORIES.NECESSARY]: true,
        [COOKIE_CATEGORIES.ANALYTICS]: Boolean(consent[COOKIE_CATEGORIES.ANALYTICS]),
        [COOKIE_CATEGORIES.FUNCTIONAL]: Boolean(consent[COOKIE_CATEGORIES.FUNCTIONAL]),
        [COOKIE_CATEGORIES.MARKETING]: Boolean(consent[COOKIE_CATEGORIES.MARKETING]),
      });

      // Trap ESC key
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          closePreferencesModal();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Focus modal container
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        if (previouslyFocusedElementRef.current?.focus) {
          previouslyFocusedElementRef.current.focus();
        }
      };
    }
  }, [isPreferencesModalOpen, consent, closePreferencesModal]);

  if (!isPreferencesModalOpen) return null;

  const handleToggle = (categoryId, val) => {
    if (categoryId === COOKIE_CATEGORIES.NECESSARY) return; // cannot disable
    setDraft((prev) => ({
      ...prev,
      [categoryId]: val,
    }));
  };

  const handleSave = () => {
    saveCustomPreferences(draft);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-preferences-title"
      aria-describedby="cookie-preferences-desc"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closePreferencesModal}
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-2xl bg-white border border-neutral-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="px-6 py-5 border-b border-neutral-200/80 bg-neutral-50/80 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="size-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h3 id="cookie-preferences-title" className="text-lg font-black tracking-tight text-neutral-950">
                Privacy & Cookie Preferences
              </h3>
              <p id="cookie-preferences-desc" className="text-xs text-neutral-500 mt-0.5">
                Customize which cookie categories you allow KlanServiceHub to use.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closePreferencesModal}
            aria-label="Close Cookie Preferences"
            className="size-8 rounded-xl bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Categories Body */}
        <div className="px-6 py-5 overflow-y-auto space-y-4 text-left flex-1">
          <p className="text-xs text-neutral-600 leading-relaxed bg-blue-50/60 border border-blue-100 p-3.5 rounded-2xl">
            We use cookies to maintain security, understand how our platform performs, and tailor features to your organization. Strictly necessary cookies cannot be disabled as they are required to operate the service.
          </p>

          <div className="space-y-3">
            {COOKIE_DEFINITIONS.map((category) => (
              <CookieCategoryItem
                key={category.id}
                category={category}
                enabled={draft[category.id]}
                onChange={(val) => handleToggle(category.id, val)}
              />
            ))}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-200/80 bg-neutral-50/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={allowNecessaryOnly}
              className="flex-1 sm:flex-initial h-10 px-4 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold transition duration-150 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              Reject Optional
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="flex-1 sm:flex-initial h-10 px-4 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              Accept All
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition duration-150 cursor-pointer flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <Check className="size-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
