import React from 'react';
import { CookieBanner } from './cookie-banner';
import { CookiePreferencesModal } from './cookie-preferences-modal';
import { FloatingCookieButton } from './cookie-settings-button';

export const CookieConsentRoot = ({ showFloatingTrigger = true }) => {
  return (
    <>
      <CookieBanner />
      <CookiePreferencesModal />
      {showFloatingTrigger && <FloatingCookieButton />}
    </>
  );
};
