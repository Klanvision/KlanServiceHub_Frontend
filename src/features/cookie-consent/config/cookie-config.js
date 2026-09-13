/**
 * Enterprise Cookie Consent Configuration & Category Definitions
 * KlanServiceHub Enterprise Architecture
 */

export const CONSENT_STORAGE_KEY = 'klanservicehub_cookie_consent_v1';
export const CONSENT_VERSION = '1.0';

export const COOKIE_CATEGORIES = {
  NECESSARY: 'necessary',
  ANALYTICS: 'analytics',
  FUNCTIONAL: 'functional',
  MARKETING: 'marketing',
};

export const COOKIE_DEFINITIONS = [
  {
    id: COOKIE_CATEGORIES.NECESSARY,
    name: 'Strictly Necessary Cookies',
    shortName: 'Necessary',
    required: true,
    defaultEnabled: true,
    summary:
      'Essential for the core functionality, security, authentication, and session integrity of the platform. These cannot be disabled.',
    details:
      'These cookies are necessary for the website to function securely and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as logging in, setting privacy preferences, maintaining CSRF tokens, or navigating between workspace views.',
    cookies: [
      {
        name: 'klanservicehub_session',
        provider: 'KlanServiceHub',
        purpose: 'Authenticates your user session and keeps you securely logged in.',
        expiry: 'Session / 30 days',
        type: 'HTTP / Secure / SameSite',
      },
      {
        name: 'csrf_token',
        provider: 'KlanServiceHub',
        purpose: 'Protects against Cross-Site Request Forgery attacks on API mutations.',
        expiry: 'Session',
        type: 'Secure',
      },
      {
        name: 'klanservicehub_cookie_consent_v1',
        provider: 'KlanServiceHub',
        purpose: 'Remembers your cookie consent selections and privacy preferences.',
        expiry: '1 Year',
        type: 'Local Storage',
      },
    ],
  },
  {
    id: COOKIE_CATEGORIES.ANALYTICS,
    name: 'Performance & Analytics Cookies',
    shortName: 'Analytics',
    required: false,
    defaultEnabled: false,
    summary:
      'Collect aggregated and anonymized data to measure page performance, error rates, and user engagement.',
    details:
      'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our platform. They help us understand which features are most and least popular, track API latency, and monitor error diagnostics. All information collected is aggregated and anonymous.',
    cookies: [
      {
        name: '_ga, _gid',
        provider: 'Google Analytics (Optional)',
        purpose: 'Collects aggregated metrics on user interactions and page load speeds.',
        expiry: '2 Years',
        type: 'Third-Party',
      },
      {
        name: 'ph_session_id',
        provider: 'PostHog / Telemetry (Optional)',
        purpose: 'Monitors client-side error telemetry and UX performance metrics.',
        expiry: '1 Year',
        type: 'First-Party',
      },
    ],
  },
  {
    id: COOKIE_CATEGORIES.FUNCTIONAL,
    name: 'Functional & Personalization Cookies',
    shortName: 'Functional',
    required: false,
    defaultEnabled: false,
    summary:
      'Enable enhanced features, layout customization, saved filter queries, and personalized workspace preferences.',
    details:
      'These cookies enable the platform to provide enhanced functionality and personalization, such as remembering your selected workspace, collapsed sidebar state, task table column filters, active kanban views, and language preferences. If you do not allow these cookies, some features may reset upon page reload.',
    cookies: [
      {
        name: 'klan_workspace_pref',
        provider: 'KlanServiceHub',
        purpose: 'Stores your last active workspace and project navigation context.',
        expiry: '6 Months',
        type: 'Local Storage',
      },
      {
        name: 'klan_theme_ui',
        provider: 'KlanServiceHub',
        purpose: 'Remembers dark/light theme and responsive sidebar layout state.',
        expiry: '1 Year',
        type: 'Local Storage',
      },
    ],
  },
  {
    id: COOKIE_CATEGORIES.MARKETING,
    name: 'Targeting & Marketing Cookies',
    shortName: 'Marketing',
    required: false,
    defaultEnabled: false,
    summary:
      'Used to deliver relevant announcements, product updates, and evaluate campaign effectiveness.',
    details:
      'These cookies may be set through our site by our marketing partners or product communication services. They may be used to build a profile of your interests and show you relevant enterprise features or webinar invitations. They do not store directly personal information, but are based on uniquely identifying your browser and internet device.',
    cookies: [
      {
        name: '_fbp',
        provider: 'Meta / LinkedIn (Optional)',
        purpose: 'Measures effectiveness of enterprise developer campaign attribution.',
        expiry: '90 Days',
        type: 'Third-Party',
      },
      {
        name: 'hubspotutk',
        provider: 'HubSpot (Optional)',
        purpose: 'Tracks enterprise demo requests and whitepaper download forms.',
        expiry: '1 Year',
        type: 'Third-Party',
      },
    ],
  },
];
